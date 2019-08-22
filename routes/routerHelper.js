const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    password: Joi.string().alphanum().min(8).max(30).required('joi Password is required'),
    email: Joi.string().email({ minDomainSegments: 2 }).required('joi Email is required')
});

const validateBody = (schema) => {
    return (req, res, next) => {
        if (!req.body) return res.status(400).json(result.error);
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;

        next();
    }
};

module.exports = { schema, validateBody };