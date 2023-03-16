const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  personalCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
