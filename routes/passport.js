const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

/*passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile', profile)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
    } catch(error) {
        done(error, false, error.message);
    }
})); */

//Google Oauth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '678945436199-s58cd2cg4b63hkq55liauockob72q3ev.apps.googleusercontent.com',
    clientSecret: 'eBSudil6qwvfhxNmgRUw0uxk',
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, next) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    next(undefined, profile);
}));

module.exports = passport;