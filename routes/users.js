const express = require('express');
const usersRouter = express.Router();
const passport = require('passport');
const passportConf = require('./passport')

const { validateBody, schema } = require('./routerHelper');
const UsersController = require('./usersControllers');

usersRouter.route('/signup')
    .post(
        validateBody(schema),
        UsersController.signUp
    );

usersRouter.route('/login')
    .post(
        validateBody(schema), 
        passport.authenticate('local', { session: false }), 
        UsersController.logIn
    );

usersRouter.route('/secret')
    .get(
        passport.authenticate('jwt', { session: false }), 
        UsersController.secret
   );

usersRouter.use(passportConf.initialize());
usersRouter.use(passportConf.session());

usersRouter.route('/oauth/facebook')
    .post(
        passport.authenticate('facebookToken', { session: false }),
        UsersController.generateOAuthToken
    );

usersRouter.route('/oauth/google')
    .post(
        passportConf.authenticate('googleToken', { session: false}),
        UsersController.generateOAuthToken
    );

/*usersRouter.use('/oauth/google', (req, res) => {
    passportConf.authenticate(
        'googleToken', function (error, user, info) {
            if (!user) res.send(401);
            return res.send(user);
        })(req, res);
})*/

module.exports = usersRouter;