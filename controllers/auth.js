const jwt = require('jsonwebtoken');
const _ = require('lodash');

const User = require('../models/user');

const {sendEmail} = require('../helpers/nodemailer');

const {
  registerValidation,
  loginValidation,
  forgotValidation,
} = require('../helpers/validator');

exports.register = async (req, res) => {
  const {error} = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({success: false, message: error.details[0].message});

  const userExist = await User.findOne({email: req.body.email});

  if (userExist)
    return res.status(401).json({
      success: false,
      message: `User with email ${req.body.email} already exist. Please login or try again.`,
    });

  const user = new User(req.body);
  await user.save();

  const token = jwt.sign({user: user}, process.env.JWT_SECRET, {
    expiresIn: '100h',
  });
  res.cookie('token', token);
  res.json({success: true, message: 'Registration Successful', token});
};

exports.login = (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) return res.status(400).json({message: error.details[0].message});

  const {email, password} = req.body;

  User.findOne({email}, (err, user) => {
    if (err || !user)
      return res.status(401).json({
        success: false,
        message: 'email or password is incorrect. Please try again.',
      });

    if (!user.comparePassword(password))
      return res.status(401).json({
        success: false,
        message: 'email or password is incorrect. Please try again.',
      });

    console.log(user);

    const token = jwt.sign({user: user}, process.env.JWT_SECRET, {
      expiresIn: '100h',
    });
    res.cookie('auth', token);
    res.json({success: true, message: 'Login Successful', token});
  });
};

exports.forgotPassword = (req, res) => {
  const {error} = forgotValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({success: false, message: error.details[0].message});

  User.findOne({email: req.body.email}, (err, user) => {
    if (err || !user)
      return res.status(401).json({
        success: false,
        message: `User with email: ${req.body.email} does not exist.`,
      });

    const token = jwt.sign(
      {user, iss: process.env.APP_NAME},
      process.env.JWT_SECRET,
      {expiresIn: '30m'}
    );

    const emailData = {
      from: process.env.APP_NAME,
      to: req.body.email,
      subject: 'Password Reset Request',
      text: `This email is generated to reset tyour password on pandawear.com
              Please click here to reset password
              or, copy the link below and paste in your address bar to reset password
              https://www.${process.env.CLIENT_URL}/reset-password/${token}
              Please ignore this email if you did not make any password reset request.Thank you!`,

      html: `<p>This email is generated to reset tyour password on pandawear.com</p>
              <p><a title="click password" href="https://www.${process.env.CLIENT_URL}/reset-password/${token}">Please click here to reset password</a></p>
              <p>or, copy the link below and paste in your address bar to reset password</p>
              <h1>https://www.${process.env.CLIENT_URL}/reset-password/${token}</h1>
              <p>Please ignore this email if you did not make any password reset request.</p>
              <p>Thank you!</p>
              <p style="text-align: center;">#BeMoreWithLess</p>`,
    };

    return user.updateOne({reset_password: token}, (err) => {
      if (err) return res.json({success: false, message: err});

      sendEmail(emailData);
      return res.json({
        success: true,
        message: `Email has been sent to ${req.body.email}. Follow the instructions to reset your password.`,
      });
    });
  });
};

exports.resetPassword = (req, res) => {
  const {reset_password, new_password} = req.body;

  User.findOne({reset_password}, (err, user) => {
    if (err || !user)
      return res.status(401).json({message: 'Invalid Reset Link'});

    const updateFields = {
      password: new_password,
      reset_password: '',
    };

    user = _.extend(user, updateFields);
    user.account_updated = Date.now();

    user.save((err) => {
      if (err) return res.status(400).json({success: false, message: err});

      res.json({success: true, message: 'Password reset successful'});
    });
  });
};

exports.userProfile = (req, res) => {
  User.findOne({_id: req.decoded._id}, (err, user) => {
    if (err) return res.status(400).json({message: err});

    user.password = undefined;
    res.json(user);
  });
};
