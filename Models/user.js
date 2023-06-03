const mongoose = require('mongoose');

const userSchema = {
    NIC: String,
    password: String,
    name: String,
    voted:Boolean
  };
  

module.exports = mongoose.model("User",userSchema);