const Player = require("../models/Player");
//because of the asyncHandler package, we dont have to use a try catch
const asyncHandler = require("express-async-handler");

// @desc Get all players
// @route GET /players
// @access Public
const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find().lean();
  if (!players || players.length === 0) {
    return res.status(400).json({ message: "No Players found" });
  }
  return res.json(players);
});

// @desc Create a player
// @route POST /players
// @access Private
const createNewPlayer = asyncHandler(async (req, res) => {
  //destructure our variables from req.body
  //positions is an array
  const { name, alias, positions, monthlyRegisteration } = req.body;

  //confirm that all data came in
  //note that only image, monthlyregistration and stats can be skipped
  if (!name || !alias || !positions) {
    return res.status(400).json({
      message: "Only Image, monthly registration and stats can be ommited.",
    });
  }

  // Check for duplicate name
  const duplicate = await Player.findOne({ name }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Playername must be unique." });
  }

  // Check for duplicate alias
  const duplicateAlias = await Player.findOne({ alias }).lean().exec();
  if (duplicateAlias) {
    return res.status(409).json({ message: "AliasName must be unique." });
  }

  const playerObject = {
    name,
    alias,
    positions,
    monthlyRegisteration,
  };

  //create and save an admin to mongoDb
  const player = await Player.create(playerObject);
  if (player) {
    //created
    res.status(201).json({ message: `New Player ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

// @desc update a player
// @route PATCH /players
// @access Private
const updatePlayer = asyncHandler(async (req, res) => {});

// @desc delete a player
// @route DELETE /players
// @access Private
const deletePlayer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (id) {
    return res.status(400).json({ message: `Player ID required` });
  }

  const player = await Player.findById(id).exec();
  if (!player) {
    return res.status(400).json({ message: `Player not found` });
  }

  const result = await player.deleteOne();
  const reply = `Player ${result.name} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllPlayers, createNewPlayer, updatePlayer, deletePlayer };
