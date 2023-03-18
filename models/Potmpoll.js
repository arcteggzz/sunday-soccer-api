const mongoose = require("mongoose");

const potmPollSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    unique: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Potmpoll", potmPollSchema);
