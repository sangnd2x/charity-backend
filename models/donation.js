const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  amount: {
    type: String,
    required: true
  },
  charity: {
    charityId: { type: Schema.Types.ObjectId, ref: 'Charity', required: true },
    charityName: {type: String, required: true}
  },
  user: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: {type: String, required: true}
  },
  donatedAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Donation', donationSchema);