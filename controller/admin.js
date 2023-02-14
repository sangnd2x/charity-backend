const Charity = require('../models/charity');
const User = require('../models/user');
const Donation = require('../models/donation');
const user = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// exports.uploadImages = async (req, res, next) => {
//   const images = req.files; 
//   console.log(images);
//   try {
//     let imgPaths = [];
//     for (let image of images) {
//       const result = await cloudinary.uploader.upload(image.path);
//       imgPaths.push(result.secure_url);
//     }
//     res.status(200).json({ imgs: imgPaths });
//   } catch (error) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     return next(error);
//   }
// }

exports.postNewCharity = async (req, res, next) => {
  const { name, recipient, startDate, endDate, target, status, longDesc, shortDesc } = req.body;
  const images = req.files;
  // console.log(images);
  
  try {
    // upload images to 
    let imgPaths = [];
    for (let image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imgPaths.push(result.secure_url);
    }
    // console.log('imgPaths', imgPaths);
    // save new charity to db
    const charity = new Charity({
      name: name,
      recipient: recipient,
      startDate: startDate,
      endDate: endDate,
      target: target,
      status: status,
      images: imgPaths,
      long_desc: longDesc,
      short_desc: shortDesc,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    const response = await charity.save();
    res.status(200).json({ msg: 'New Charity Added!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminFetchCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find();
    const donations = await Donation.find();

    // Return to front-end the raised amount and progress of each charity
    const donatedCharity = charities.map(charity => {
      const donatedAmount = []
      donations.map(donation => {
        if (donation.charity.charityName === charity.name) {
          donatedAmount.push(+donation.amount)
        }
      });
      return {
        charityName: charity.name,
        donatedAmount: donatedAmount.reduce((a, b) => a + b, 0),
        progress: donatedAmount.reduce((a, b) => a + b, 0) / +charity.target * 100
      };
    });

    res.status(200).json({charities: charities, donated: donatedCharity});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminGetEditCharity = async (req, res, next) => {
  const { charityId } = req.params;
  // console.log(chdarityId);

  try {
    const response = await Charity.findById(charityId);
    res.status(200).send(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminPostEditCharity = async (req, res, next) => {
  const { id, name, recipient, startDate, endDate, target, status, longDesc, shortDesc } = req.body;
  const images = req.files;
  // console.log(target, typeof target)
  try {
    let imgPaths = [];
    for (let image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imgPaths.push(result.secure_url);
    }

    const charity = await Charity.findById(id);
    if (name) {
      charity.name = name;
    }
    if (recipient) {
      charity.recipient = recipient;
    }
    if (startDate) {
      charity.startDate = startDate;
    }
    if (endDate) {
      charity.endDate = endDate;
    }
    if (images) {
      charity.images = imgPaths;
    }
    if (target) {
      charity.target = +target;
    } 
    if (status) {
      charity.status = status;
    }
    if (longDesc) {
      charity.long_desc = longDesc;
    }
    if (shortDesc) {
      charity.short_desc = shortDesc;
    }

    const response = await charity.save();
    res.status(200).json({ msg: 'Charity Updated' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminDeleteCharity = async (req, res, next) => {
  const { status, charityId } = req.body;
  // console.log(charityId, status)
  try {
    const charity = await Charity.findById(charityId);
    charity.status = status;
    const response = await charity.save();
    res.status(200).json({ msg: 'Charity Delete!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminDeactivateUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    user.status = 'inactive';
    const response = await user.save();
    res.status(200).json({ msg: 'User deactivated' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}

exports.adminFetchUsers = async (req, res, next) => {
  try {
    const response = await User.find();
    res.status(200).send(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminFetchUser = async(req, res, next) => {
  const { userId } = req.params;
  // console.log(userId)
  try {
    const response = await User.findById(userId);
    res.status(200).send(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}

exports.adminFetchDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find();
    // console.log(donations);
    res.status(200).send(donations);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminFetchSearchedCharity = async (req, res, next) => {
  const { charityName } = req.params;

  try {
    const charities = await Charity.find();
    const results = charities.filter(charity => charity.name.includes(charityName));
    if (results) {
      res.status(200).send(results);
    } else {
      return;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}

exports.adminFetchSearchedDonation = async (req, res, next) => {
  const { donorName } = req.params;

  try {
    const donations = await Donation.find();
    // console.log(donations);
    const results = donations.filter(donation => donation.user.username.includes(donorName));
    if (results) {
      res.status(200).send(results);
    } else {
      return;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
}

exports.adminFetchSearchedUser = async (req, res, next) => {
  const { username } = req.params;

  try {
    const users = await User.find();
    const results = users.filter(user => user.username.includes(username));
    if (results) {
      res.status(200).send(results);
    } else {
      return
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminEditInfo = async (req, res, next) => {
  const { userId, newUsername, newEmail, newStatus } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ msg: 'Username not found' });
    } else {
      if (newUsername) {
        user.username = newUsername;
      }
      if (newEmail) {
        user.email = newEmail;
      }
      if (newStatus) {
        user.status = newStatus;
      }
      const response = await user.save();
      res.status(200).json({ msg: 'User info updated' });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminForgetPassword = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username: username, email: email });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ msg: 'No user found' });
    } else {
      // Send reset password email
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
        subject: 'RESET YOUR PASSWORD',
        html: `
        <h1>Hi ${user.username}</h1>
        <br>
        <p>Please click the link below to reset your password</p>
        <a href='http://localhost:3000/user/reset-password/${user._id}'>Click me<a/>
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

exports.adminResetPassword = async (req, res, next) => {
  const { newPass, confirmNewPass, userId } = req.body;

  try {
    const user = await User.findById(userId);
    // console.log(user);
    if (user) {
      if (newPass !== confirmNewPass) {
        return res.status(400).json({ msg: 'Passwords must be matched' });
      } else {
        const hashedPass = await bcrypt.hash(newPass, 12);
        user.password = hashedPass;
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