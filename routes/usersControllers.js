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
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }

        //Create new user
        const newUser = new User({
            method: 'local',
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
        console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    secret: async (req, res, next) => {
        res.json({ secret: "resource" })
    }
}