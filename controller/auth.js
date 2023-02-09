const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// require('dotenv').config();

exports.postAdminSignUp = async (req, res, next) => {
  const { username, password, email } = req.body;
  // console.log(role);
  try {
    const role = await Role.findOne({ name: 'admin' });
    const hashedPass = await bcrypt.hash(password, 12);

    // Check if this email is already existed. If not, create new user
    const isExisted = await User.find({ email: email });
    if (isExisted.length !== 0) {
      return res.status(401).json({ msg: 'This email has already been used!' });
    } else {
      const user = new User({
        username: username,
        email: email,
        password: hashedPass,
        role: role.name,
        status: 'inactive',
        avatar: 'https://res.cloudinary.com/dsaog9ptb/image/upload/v1675826585/male-avt_hpv8fq.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Send confirmation email after sign up
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'derp12.08@gmail.com',
          pass: process.env.NODEMAILER_PASSWORD_GMAIL
        }
      });

      let mailDetails = {
        from: 'derp12.08@gmail.com',
        to: email,
        subject: 'ACCOUNT REGISTER CONFIRMATION',
        html: `
        <h1>Hi ${user.username}</h1>
        <br>
        <p>Thank you for creating an account with us.</p>
        <p>Please verify you email</p>
        <a href='http://localhost:3000/new-user/${user._id}'>Click me<a/>
        <br>
        <p>Best Regards,</p>
        <p>The Giving Circle Team</p>
        `
      }

      transporter.sendMail(mailDetails, async (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          console.log('Email sent1');
          const result = await user.save();
          if (result) {
            res.status(200).json({ msg: 'New User Created!' });
          }
        }
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const response = await User.findById(userId);
    if (!response) return;
    response.status = 'active';
    response.save();
    res.status(200).json({ msg: 'Verified' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}

exports.postAdminSignIn = async (req, res, next) => {
  const { username, password } = req.body;
  // console.log(username, password)
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ msg: 'Username is not exist' });
    } else if (user.status !== 'inactive') {
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(404).json({ msg: 'Wrong Passwrod' });
      } else {
        const accessToken = jwt.sign(user.toJSON(), `${process.env.ACCESS_TOKEN}`);
        return res.status(200).json({ msg: 'Successfully Signed In!', accessToken: accessToken, user: user._id });
      }
    } else {
      return res.status(404).json({ msg: 'You need to verify your email before signing in' });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { userId, oldPass, newPass, confirmNewPass } = req.body;

  try {
    const user = await User.findById(userId);
    const isMatched = await bcrypt.compare(oldPass, user.password);
    if (!isMatched) {
      return res.status(404).json({ msg: 'Wrong Password' });
    } else {
      if (newPass !== confirmNewPass) {
        return res.status(400).json({ msg: 'Password is not matched' });
      } else {
        const changedPass = await bcrypt.hash(newPass, 12);
        user.password = changedPass;
        const response = await user.save();
        res.status(200).json({ msg: 'New Password Updated' });
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}