const Potmpoll = require("../models/Potmpoll");
//because of the asyncHandler package, we dont have to use a try catch
const asyncHandler = require("express-async-handler");

// @desc Get all players
// @route GET /potmPoll
// @access Public
const getAllPollPlayer = asyncHandler(async (req, res) => {
  const pollPlayers = await Potmpoll.find().lean();
  if (!pollPlayers || pollPlayers.length === 0) {
    return res.status(400).json({ message: "No PlayersPoll found" });
  }
  return res.json(pollPlayers);
});

// @desc Create a poll player
// @route POST /potmPoll
// @access Private
const createNewPollPlayer = asyncHandler(async (req, res) => {
  //destructure our variables from req.body
  //positions is an array
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({
      message: "Player name is required",
    });
  }

  const duplicate = await Potmpoll.findOne({ playerName }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Playername must be unique." });
  }

  const playerPollObject = {
    playerName,
  };

  const playerPoll = await Potmpoll.create(playerPollObject);
  if (playerPoll) {
    //created
    res.status(201).json({ message: `New Player Poll ${playerName} created` });
  } else {
    res.status(400).json({ message: "Invalid Player Poll data received" });
  }
});

// @desc update a player
// @route PATCH /potmPoll
// @access Public
const updatePollPlayer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Player name and vote is required",
    });
  }

  const playerPoll = await Potmpoll.findById(id).exec();
  if (!playerPoll) {
    return res.status(400).json({ message: "playerPoll account not found" });
  }

  playerPoll.votes = playerPoll.votes + 1;

  const updatedPlayerPoll = await playerPoll.save();

  res.json({ message: `Vote for ${updatedPlayerPoll.playerName} registered` });
});

// @desc delete a player
// @route DELETE /potmPoll
// @access Private
const deletePollPlayer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (id) {
    return res.status(400).json({ message: `Player ID required` });
  }

  const playerPoll = await Potmpoll.findById(id).exec();
  if (!playerPoll) {
    return res.status(400).json({ message: `Player not found` });
  }

  const result = await playerPoll.deleteOne();
  const reply = `Player ${result.playerName} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllPollPlayer,
  createNewPollPlayer,
  updatePollPlayer,
  deletePollPlayer,
};
