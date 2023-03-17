const mongoose = require("mongoose");

// const seasonGoalsSchema = new mongoose.Schema({
//   season: { type: String, required: true },
//   goals: { type: Number },
// });

// const seasonAssistsSchema = new mongoose.Schema({
//   season: { type: String, required: true },
//   assists: { type: Number },
// });

// const seasonCleanSheetsSchema = new mongoose.Schema({
//   season: { type: String, required: true },
//   cleanSheets: { type: Number },
// });

// const seasonYellowCardsSchema = new mongoose.Schema({
//   season: { type: String, required: true },
//   yellowCards: { type: Number },
// });

// const seasonRedCardsSchema = new mongoose.Schema({
//   season: { type: String, required: true },
//   redCards: { type: Number },
// });

// const seasonStatsSchema = new mongoose.Schema({
//   season: {},
// });

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  // array of strings
  positions: [{ type: String }],
  //this image parameter may change eventually
  image: {
    public_id: { type: String, default: "No Image" },
    url: { type: String, default: "No Image" },
  },
  monthlyRegisteration: {
    type: Boolean,
    default: true,
  },
  isMember: {
    type: Boolean,
    default: true,
  },
  legacyGoals: {
    type: Number,
    required: true,
  },
  // stats: {
  //   futureStats: [seasonStats],
  // },
});

module.exports = mongoose.model("Player", playerSchema);
