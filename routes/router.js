const express = require('express');
const router = express.Router();

const temp = (passport) => router.use('/oauth/google', (req, res) => {
    console.log('hi');
    passport.authenticate(
        'googleToken', function(error, user, info) {
          if (!user) res.send(401); 
          return res.send(user);
      })(req, res);
    });

module.exports = temp;