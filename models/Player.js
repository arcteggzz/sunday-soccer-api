import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  knownName: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  positions: [{ type: string }],
  image: {
    type: String,
    required: false,
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
      type: string,
      required: true,
    },
    goals: [
      {
        season23: Number,
        season24: Number,
      },
    ],
    assists: [
      {
        season23: Number,
        season24: Number,
      },
    ],
    yellowCards: [
      {
        season23: Number,
        season24: Number,
      },
    ],
    redCards: [
      {
        season23: Number,
        season24: Number,
      },
    ],
    cleanSheets: [
      {
        season23: Number,
        season24: Number,
      },
    ],
  },
});

module.exports = mongoose.model("Player", playerSchema);
