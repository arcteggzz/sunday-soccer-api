const mongoose = require("mongoose");
const validFavoritePositions = [
  "Goal Keeper",
  "Defender",
  "Midfielder",
  "Forward",
];

const seasonStatsSchema = new mongoose.Schema({
  season: { type: String, default: "2021/2022" },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  cleanSheets: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
});

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  twitter: { type: String, default: "" },
});

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
  playerQuote: { type: String, required: true },
  // array of strings
  positions: [{ type: String, required: true }],
  favoritePosition: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validFavoritePositions.includes(v);
      },
      message: (props) => `${props.value} is not a valid favorite position!`,
    },
  },
  //this image parameter may change eventually
  image: {
    public_id: { type: String, default: "No Image" },
    url: { type: String, default: "No Image" },
  },
  socialMedia: socialMediaSchema,
  stats: {
    legacyGoals: {
      type: Number,
      default: 0,
    },
    futureStats: [seasonStatsSchema],
  },
});

module.exports = mongoose.model("Player", playerSchema);
