const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required()
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