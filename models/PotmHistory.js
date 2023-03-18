const mongoose = require("mongoose");

const potmHistorySchema = new mongoose.Schema({
  season: { type: String, required: true },
  winner: { type: String, required: true },
});

module.exports = mongoose.model("PotmHistory", potmHistorySchema);
