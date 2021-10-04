const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'a user must have a name'],
        minlength: [5, 'name should atleast be 5 characters long'],
        maxlength: [40, 'name cannot be longer than 40 characters']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'a user must have a name'],
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
        required: [true, 'a user must have an age']
    },
    role: {
        type: String,
        default: 'user',
        select: false,
        enum: ['user', 'admin']
    },
    password: {
        type: String,
        minlength: 5,
        select: false,
        required: [true, 'a user must have a password']
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(passwordConfirm) {
                return passwordConfirm === this.password;
            }
        },
        message: 'Passwords are not the same'
    },
    active: {
        type: Boolean,
        select: false,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
        select: false,
    },
    passwordResetToken: {
        type: String,
    },
    tokenExpires: {
        type: Date
    }
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', catchAsync(async function(next){
    if(!this.isModified())
        next();
    // hashing the password before saving it
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
}));

// middleware to update timestamp when the password is updated

userSchema.pre('save', function(next) {
    if(!this.isModified() || this.isNew)
        next();

    this.passwordChangedAt = Date.now() - 1000;
    // to enable a delay caused by creation of JWT token
    next();
})

// to check if entered password is the same as hash
userSchema.methods.correctPassword = async function(originalPass, PassToBeChecked) {
    return await bcrypt.compare(PassToBeChecked, originalPass);
}

// to check if the password was changed after JWT timestamp was issued
userSchema.methods.passwordChangedAfter = function(JWTTokenTimeStamp){
    if (this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/ 1000, 10);
        return changedTimeStamp > JWTTokenTimeStamp;
    }

    return false;
}

userSchema.methods.createForgotPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // this is saving of the hashed token on the db
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    this.tokenExpires = Date.now() + (60 * 10 * 1000);

    return resetToken;
}

module.exports = User;