const mongoose = require("mongoose");

const seasonGoalsSchema = new mongoose.Schema({
  season: { type: String, required: true },
  goals: { type: Number },
});

const seasonAssistsSchema = new mongoose.Schema({
  season: { type: String, required: true },
  assists: { type: Number },
});

const seasonCleanSheetsSchema = new mongoose.Schema({
  season: { type: String, required: true },
  cleanSheets: { type: Number },
});

const seasonYellowCardsSchema = new mongoose.Schema({
  season: { type: String, required: true },
  yellowCards: { type: Number },
});

const seasonRedCardsSchema = new mongoose.Schema({
  season: { type: String, required: true },
  redCards: { type: Number },
});

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  knownName: {
    type: String,
    required: true,
    unique: true,
  },
  positions: [{ type: String }],
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  monthlyRegisteration: {
    type: Boolean,
    required: false,
  },
  isMember: {
    type: Boolean,
    required: true,
    default: true,
  },
  stats: {
    legacyGoals: {
      type: Number,
      required: true,
    },
    goals: [seasonGoalsSchema],
    assists: [seasonAssistsSchema],
    cleanSheets: [seasonCleanSheetsSchema],
    yellowCards: [seasonYellowCardsSchema],
    redCards: [seasonRedCardsSchema],
  },
});

module.exports = mongoose.model("Player", playerSchema);
