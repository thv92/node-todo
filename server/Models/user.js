const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, //value will automatically get passed into function
            message: "{VALUE} is not a valid email"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    //Turns Model object into plain javascript object
    const userObject = this.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

//function keyword for binding this
userSchema.methods.generateAuthToken = function() {
    const access = 'auth';
    const token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();
    this.tokens = this.tokens.concat([{access, token}]);
    return this.save().then(() => {
        return token;
    });
};

const User = mongoose.model('User', userSchema);
//Tokens only available in mongodb
module.exports = {User};
