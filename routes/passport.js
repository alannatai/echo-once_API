const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET, oauth } = require('../configuration');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

//json web token strategy
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        //find user specified in token
        const user = await User.findById(payload.sub);
        //handle not found user
        if (!user) {
            return done(null, false);
        }
        //else return user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

//Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        try {
            //find the user via email
            const user = await User.findOne({ "local.email": email })
            //if not, handle it
            if (!user) {
                return done(null, false);
            }
            //check if password is correct
            const isMatch = await user.isValidPassword(password);
            //else handle
            if (!isMatch) {
                return done(null, false);
            }
            //return user
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }));

//Facebook Oauth Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: oauth.facebook.clientID,
    clientSecret: oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile', profile)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)

        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
            console.log('This facebook user already exists in our database');
            return done(null, existingUser)
        }

        console.log('New facebook user, creating in database');

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));

//Google Oauth Strategy
/*passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '',
    clientSecret: ''
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, next) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    next(undefined, profile);
}));*/

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: oauth.google.clientID,
    clientSecret: oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        //check if user exists in DB
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
            console.log('This google user already exists in our database');
            return done(null, existingUser);
        }

        console.log('New google user, creating in database');

        //if new account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));

module.exports = passport;