const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },

});

userSchema.pre('save', async function (next) {
    try {
        if (this.method !== 'local') {
            next();
        }

        //generate a salt
        const salt = await bcrypt.genSalt(10);
        //generate password hash (salt+hash)
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        //re-assign hashed version over original, plain text password
        this.local.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
};

//Create model
const User = mongoose.model('user', userSchema)

module.exports = User;