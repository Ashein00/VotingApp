const mongoose = require('mongoose');

const candidateSchema = {
    name: String,
    qualifications: String,
    party: String,
    voting_number: Number
  };

  module.exports = mongoose.model('Candidate', candidateSchema);