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
  stats.sort((a, b) => {
    const aGoals = a.stats.futureStats[0].yellowCards;
    const bGoals = b.stats.futureStats[0].yellowCards;
    if (aGoals < bGoals) {
      return 1;
    }
    if (aGoals > bGoals) {
      return -1;
    }
    return 0;
  });
  return res.json(stats);
});

module.exports = {
  getAllPlayerStats,
};
