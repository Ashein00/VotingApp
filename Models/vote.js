const mongoose = require('mongoose');

const voteSchema = {
    NIC: String,
    party: String,
    vote1: String,
    vote2: String,
    vote3: String
  };

module.exports = mongoose.model('Vote',voteSchema);