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
  const {
    name,
    alias,
    playerQuote,
    positions,
    favoritePosition,
    socialMedia: { facebook, twitter, instagram },
    stats: { legacyGoals, futureStats },
  } = req.body;

  //confirm that all data came in
  //note that only image, stats, socialMedia can be skipped
  if (!name || !alias || !playerQuote || !positions || !favoritePosition) {
    return res.status(400).json({
      message:
        "Only Image, monthly registration, socialMedia and stats can be ommited.",
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
    playerQuote,
    positions,
    favoritePosition,
    socialMedia: { facebook, twitter, instagram },
    stats: { legacyGoals, futureStats },
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

const updatePlayerStats = asyncHandler(async (req, res) => {
  const playerId = req.params.playerId;
  const seasonStats = req.body;

  const updatedPlayer = await Player.findOneAndUpdate(
    { _id: playerId },
    { $push: { "stats.futureStats": seasonStats } },
    { new: true }
  );

  if (updatedPlayer) {
    //created
    res.status(201).json({ message: `Player updated` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updatePlayerGoals = asyncHandler(async (req, res) => {
  const playerId = req.params.playerId;
  const season = req.params.season;
  const goals = req.body.goals;

  const updatedPlayer = await Player.findOneAndUpdate(
    { _id: playerId, "stats.futureStats.season": season },
    { $inc: { "stats.futureStats.$.goals": goals } },
    { new: true }
  );

  if (updatedPlayer) {
    //created
    res
      .status(201)
      .json({ message: `Player updated for ${season} with ${goals}` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const getAllPlayersIds = asyncHandler(async (req, res) => {
  const players = await Player.find({}, "_id name alias");
  if (!players || players.length === 0) {
    return res.status(400).json({ message: "No Players found" });
  }
  return res.json(players);
});

const createMultiplePlayers = asyncHandler(async (req, res) => {
  //destructure our variables from req.body
  //positions is an array
  const playersList = req.body;
  const createdPlayers = [];
  for (let i = 0; i < playersList.length; i++) {
    const {
      name,
      alias,
      playerQuote,
      positions,
      favoritePosition,
      socialMedia: { facebook, twitter, instagram },
      stats: { legacyGoals, futureStats },
    } = playersList[i];

    //confirm that all data came in
    //note that only image, stats, socialMedia can be skipped
    if (!name || !alias || !playerQuote || !positions || !favoritePosition) {
      return res.status(400).json({
        message:
          "Only Image, monthly registration, socialMedia and stats can be ommited.",
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
      playerQuote,
      positions,
      favoritePosition,
      socialMedia: { facebook, twitter, instagram },
      stats: { legacyGoals, futureStats },
    };

    //create and save an admin to mongoDb
    const player = await Player.create(playerObject);

    if (player) {
      //created
      createdPlayers.push(player);
    }
  }

  if (createdPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Created all Players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updateMultiplePlayerGoals = asyncHandler(async (req, res) => {
  const season = req.params.season;
  const playersList = req.body;
  const updatedPlayers = [];

  for (let i = 0; i < playersList.length; i++) {
    const singlePlayerId = playersList[i].playerId;
    const goals = playersList[i].goals;
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: singlePlayerId, "stats.futureStats.season": season },
      { $inc: { "stats.futureStats.$.goals": goals } },
      { new: true }
    );
    updatedPlayers.push(updatedPlayer);
  }

  if (updatedPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Updated all players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updateMultiplePlayerAssists = asyncHandler(async (req, res) => {
  const season = req.params.season;
  const playersList = req.body;
  const updatedPlayers = [];

  for (let i = 0; i < playersList.length; i++) {
    const singlePlayerId = playersList[i].playerId;
    const assists = playersList[i].assists;
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: singlePlayerId, "stats.futureStats.season": season },
      { $inc: { "stats.futureStats.$.assists": assists } },
      { new: true }
    );
    updatedPlayers.push(updatedPlayer);
  }

  if (updatedPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Updated all players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updateMultiplePlayerCleanSheets = asyncHandler(async (req, res) => {
  const season = req.params.season;
  const playersList = req.body;
  const updatedPlayers = [];

  for (let i = 0; i < playersList.length; i++) {
    const singlePlayerId = playersList[i].playerId;
    const cleanSheets = playersList[i].cleanSheets;
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: singlePlayerId, "stats.futureStats.season": season },
      { $inc: { "stats.futureStats.$.cleanSheets": cleanSheets } },
      { new: true }
    );
    updatedPlayers.push(updatedPlayer);
  }

  if (updatedPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Updated all players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updateMultiplePlayerYellowCards = asyncHandler(async (req, res) => {
  const season = req.params.season;
  const playersList = req.body;
  const updatedPlayers = [];

  for (let i = 0; i < playersList.length; i++) {
    const singlePlayerId = playersList[i].playerId;
    const yellowCards = playersList[i].yellowCards;
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: singlePlayerId, "stats.futureStats.season": season },
      { $inc: { "stats.futureStats.$.yellowCards": yellowCards } },
      { new: true }
    );
    updatedPlayers.push(updatedPlayer);
  }

  if (updatedPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Updated all players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

const updateMultiplePlayerRedCards = asyncHandler(async (req, res) => {
  const season = req.params.season;
  const playersList = req.body;
  const updatedPlayers = [];

  for (let i = 0; i < playersList.length; i++) {
    const singlePlayerId = playersList[i].playerId;
    const redCards = playersList[i].redCards;
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: singlePlayerId, "stats.futureStats.season": season },
      { $inc: { "stats.futureStats.$.redCards": redCards } },
      { new: true }
    );
    updatedPlayers.push(updatedPlayer);
  }

  if (updatedPlayers.length === playersList.length) {
    //created
    res.status(201).json({ message: `Updated all players` });
  } else {
    res.status(400).json({ message: "Invalid Player data received" });
  }
});

module.exports = {
  getAllPlayers,
  createNewPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerStats,
  updatePlayerGoals,
  getAllPlayersIds,
  createMultiplePlayers,
  updateMultiplePlayerGoals,
  updateMultiplePlayerAssists,
  updateMultiplePlayerCleanSheets,
  updateMultiplePlayerYellowCards,
  updateMultiplePlayerRedCards,
};
