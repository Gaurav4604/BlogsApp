const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production')
      cookieOptions.secure = true;
  
    res.cookie("jwt", token, cookieOptions);
  
    user.password = undefined;
    // 4) log in with JWT token
    res.status(statusCode).json({
      status: "success",
      user,
      token,
    });
};


exports.signup = catchAsync(async (req, res, next) => {

    let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createAndSendToken(user, 201, res);
});