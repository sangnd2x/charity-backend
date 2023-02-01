const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  startDate: {
    type: Date, 
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  images: [
    {type: String, required: true}
  ],
  long_desc: {
    type: String,
    required: true
  },
  short_desc: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId, ref: 'User', required: true,
    require: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId, ref: 'User', required: true,
    require: true
  }
});

module.exports = mongoose.model('Charity', charitySchema);