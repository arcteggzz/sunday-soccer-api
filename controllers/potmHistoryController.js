const PotmHistory = require("../models/PotmHistory");
//because of the asyncHandler package, we dont have to use a try catch
const asyncHandler = require("express-async-handler");

// @desc get history of polls
// @route GET /potm-history
// @access Public
const getAllPotmHistory = asyncHandler(async (req, res) => {
  const potmHistory = await PotmHistory.find().lean();
  if (!potmHistory || potmHistory.length === 0) {
    return res.status(400).json({ message: "No History found" });
  }
  return res.json(potmHistory);
});

// @desc add a playerPoll to the history
// @route POST /potm-histroy
// @access Private
const addPotmHistory = asyncHandler(async (req, res) => {
  const { season, winner } = req.body;

  if (!season || !winner) {
    return res
      .status(400)
      .json({ message: "Kindly fill all required fields, season and winner" });
  }

  const duplicate = await PotmHistory.findOne({ season }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate season" });
  }

  const historyObject = { season, winner };

  const history = await PotmHistory.create(historyObject);
  if (history) {
    //created
    res.status(201).json({ message: `New Entry for Potm` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

module.exports = {
  getAllPotmHistory,
  addPotmHistory,
};
