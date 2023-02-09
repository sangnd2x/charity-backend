const path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Initialize server using express
const server = express();

// Import routes
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');

// morgan access log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flag: 'a' });

// multer config
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

server.use(cors());
server.use(express.json({
  type: ['application/json']
}));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(helmet());
server.use(compression());
server.use(morgan('combined', { stream: accessLogStream }));
server.use(multer({ storage: fileStorage, fileFilter: fileFilter }).array('images'));
server.use('/images', express.static(path.join(__dirname, 'images')));

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j1wx6nb.mongodb.net/${process.env.DB}`;
mongoose.set('strictQuery', false)

// Using routes
server.use('/admin', adminRoute);
server.use(authRoute);

// Handling errors
server.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data
  res.status(status).json({ msg: message, data: data });
})

mongoose.connect(MONGO_URI)
  .then(result => {
    server.listen(5000);
    console.log('CONNECTED');
  })
  .catch(err => {
    console.log(err)
  });