const Player = require("../models/Player");
const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all players
// @route GET /players
// @access Public
const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find().lean();
  if (!players) {
    return res.status(400).json({ message: "No Players found" });
  }
  return res.json(players);
});

// @desc Create a player
// @route POST /players
// @access Private
const createNewPlayer = asyncHandler(async (req, res) => {});

// @desc update a player
// @route PATCH /players
// @access Private
const updatePlayer = asyncHandler(async (req, res) => {});

// @desc delete a player
// @route DELETE /players
// @access Private
const deletePlayer = asyncHandler(async (req, res) => {});

module.exports = { getAllPlayers, createNewPlayer, updatePlayer, deletePlayer };
