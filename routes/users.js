const express = require('express');
const usersRouter = express.Router();
const passport = require('./passport');

const { validateBody, schema } = require('./routerHelper');
const UsersController = require('./usersControllers');

/* usersRouter.post('/signup', (req, res, next) => {
    const isValidated = validateBody(schema)(req, res, next);
    if (true) {
        res.send('signuphere!');
        UsersController.signUp;
    }
});*/

usersRouter.route('/signup')
    .post(
        validateBody(schema),
        UsersController.signUp
    );

usersRouter.post('/signin', (req, res, next) => {

});

usersRouter.get('/secret', (req, res, next) => {

});

usersRouter.use(passport.initialize());
usersRouter.use(passport.session());

usersRouter.use('/oauth/google', (req, res) => {
    passport.authenticate(
        'googleToken', function (error, user, info) {
            if (!user) res.send(401);
            return res.send(user);
        })(req, res);
})

module.exports = usersRouter;