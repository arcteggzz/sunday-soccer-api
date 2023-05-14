const Player = require("../models/Player");
//because of the asyncHandler package, we dont have to use a try catch
const asyncHandler = require("express-async-handler");

// @desc Get all players
// @route GET /players
// @access Public
const getAllPlayerStats = asyncHandler(async (req, res) => {
  const stats = await Player.find().select("name stats.futureStats");
  if (!stats || stats.length === 0) {
    return res.status(400).json({ message: "No Players found" });
  }

  return res.json(stats);
});

module.exports = {
  getAllPlayerStats,
};
