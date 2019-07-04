module.exports = {
    signUp: async (req, res, next) => {
        res.send('controller sign up called');
        console.log(req.value.body);
    },
    signIn: async (req, res, next) => {
        res.send('controller sign in called');
    },
    secret: async (req, res, next) => {
        res.send('controller secret called');
    }
}