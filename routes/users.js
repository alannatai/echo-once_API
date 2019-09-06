const express = require('express');
const usersRouter = express.Router();
const passport = require('passport');
const passportConf = require('./passport')

const { validateBody, schema } = require('./routerHelper');
const UsersController = require('./usersControllers');

const passportJWT = passport.authenticate('jwt', { session: false });

usersRouter.use(passport.initialize());
usersRouter.use(passport.session());


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

usersRouter.route('/oauth/facebook')
    .post(
        passport.authenticate('facebookToken', { session: false }),
        UsersController.generateOAuthToken
    );

usersRouter.route('/oauth/google')
    .post(
        passport.authenticate('googleToken', { session: false }),
        UsersController.generateOAuthToken
    );

usersRouter.route('/oauth/link/facebook')
    .post(
        passportJWT,
        passport.authorize('facebookToken', { session: false }),
        UsersController.linkFacebook
    );

usersRouter.route('/oauth/link/google')
    .post(
        passportJWT,
        passport.authorize('googleToken', { session: false }),
        UsersController.linkGoogle
    );

usersRouter.route('/oauth/unlink/google')
    .post(
        passportJWT,
        UsersController.unlinkGoogle
    );

usersRouter.route('/oauth/unlink/facebook')
    .post(
        passportJWT,
        UsersController.unlinkFacebook
    );

usersRouter.route('/submit')
    .get(
        passportJWT,
        UsersController.submitSecret
    );

usersRouter.route('/account')
    .get(
        passportJWT,
        UsersController.accountSecret
    );

module.exports = usersRouter;