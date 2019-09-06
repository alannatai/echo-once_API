const JWT = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'echoOnce',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        const { email, password } = req.value.body;

        //Check if user exists with same email 
        let foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }

        //Check if there is Google/Facebook account with same email
        foundUser = await User.findOne({ "google.email": email })
        if (foundUser) {
            //merge
            foundUser.methods.push('local');
            foundUser.local = {
                email: email,
                password: password
            };
            await foundUser.save();

            //Generate token
            const token = signToken(foundUser);

            //Respond with token
            return res.status(200).json({ token });
        };

        foundUser = await User.findOne({ "facebook.email": email })
        if (foundUser) {
            //merge
            foundUser.methods.push('local');
            foundUser.local = {
                email: email,
                password: password
            };
            await foundUser.save();

            //Generate token
            const token = signToken(foundUser);

            //Respond with token
            return res.status(200).json({ token });
        };

        //Create new user
        const newUser = new User({
            methods: ['local'],
            local: {
                email: email,
                password: password
            }
        });
        await newUser.save();

        //Generate token
        const token = signToken(newUser);

        //Respond with token
        res.status(200).json({ token });
    },

    logIn: async (req, res, next) => {
        //generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    generateOAuthToken: async (req, res, next) => {
        //generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    linkFacebook: async (req, res, next) => {
        res.json({
            success: true,
            methods: req.user.methods,
            message: 'Successfully linked account with Facebook'
        })
    },

    linkGoogle: async (req, res, next) => {
        res.json({
            success: true,
            methods: req.user.methods,
            message: 'Successfully linked account with Google'
        })
    },

    unlinkFacebook: async (req, res, next) => {
         if (req.user.facebook) {
            req.user.facebook = undefined
        }
        
        const facebook = req.user.methods.indexOf('facebook');
        if (facebook >= 0) {
            req.user.methods.splice(facebook, 1)
        }
       
        await req.user.save();

        res.json({
            success: true,
            methods: req.user.methods,
            message: 'Successfully unlinked Facebook account'
        })
    },

    unlinkGoogle: async (req, res, next) => {
        //delete google sub-object
        if (req.user.google) {
            req.user.google = undefined
        }
        //remove google from methods array
        const google = req.user.methods.indexOf('google');
        if (google >= 0) {
            req.user.methods.splice(google, 1)
        }
        //save changes
        await req.user.save();

        res.json({
            success: true,
            methods: req.user.methods,
            message: 'Successfully unlinked Google account'
        })
    },

    //later specify for different components eg. accountSecret, submitSecret etc.
    submitSecret: async (req, res, next) => {
        res.json({
            submitSecret: "submit resource"
        })
    },

    accountSecret: async (req, res, next) => {
        res.json({
            accountSecret: "account resource",
            methods: req.user.methods
        })
    }
}