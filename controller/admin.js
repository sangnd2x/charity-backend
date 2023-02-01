const Charity = require('../models/charity');
const User = require('../models/user');
const Donation = require('../models/donation');
const charity = require('../models/charity');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

exports.postNewCharity = async (req, res, next) => {
  const { name, recipient, startDate, endDate, target, status, longDesc, shortDesc } = req.body;
  const images = req.files;
  
  try {
    // upload images to 
    let imgPaths = [];
    for (let image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imgPaths.push(result.secure_url);
    }
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
    const response = await Charity.find();
    // console.log(response);
    const results = response.filter(res => res.status !== 'stopped');
    res.status(200).send(results);
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
  const { charityId } = req.params;
  // console.log(charityId)
  try {
    const charity = await Charity.findById(charityId);
    charity.status = 'stopped';
    const response = await charity.save();
    res.status(200).json({ msg: 'Charity Delete!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

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
    console.log(donations);
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
}