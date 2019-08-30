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
            return res.status(200).json({
                token,
                methods: foundUser.methods
            });
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
            return res.status(200).json({
                token,
                methods: foundUser.methods
            });
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
        res.status(200).json({
            token,
            methods: newUser.methods
        });
    },

    logIn: async (req, res, next) => {
        //generate token
        const token = signToken(req.user);
        res.status(200).json({
            token,
            methods: req.user.methods
        });
    },

    generateOAuthToken: async (req, res, next) => {
        //generate token
        console.log('USERS CONTROLLER req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({
            token,
            methods: req.user.methods
        });
    },

    linkFacebook: async (req, res, next) => {
        res.json({ success: true, message: 'Successfully linked account with Facebook' })
    },

    linkGoogle: async (req, res, next) => {
        res.json({ sucess: true, message: 'Successfully linked account with Google' })
    },

    secret: async (req, res, next) => {
        res.json({ secret: "resource" })
    }
}