const Sneaker = require("../models/Sneaker");
//because of the asyncHandler package, we dont have to use a try catch
const asyncHandler = require("express-async-handler");

// @desc Get all players
// @route GET /players
// @access Public
const getAllSneakers = asyncHandler(async (req, res) => {
  const sneakers = await Sneaker.find().lean();
  if (!sneakers || players.length === 0) {
    return res.status(400).json({ message: "No sneakers found" });
  }
  return res.json(sneakers);
});

// @desc Create a player
// @route POST /players
// @access Private
const createNewSneaker = asyncHandler(async (req, res) => {
  //destructure our variables from req.body
  //positions is an array
  const { name, purchased, quantity } = req.body;

  //confirm that all data came in
  //note that only image, stats, socialMedia can be skipped
  if (!name || !quantity) {
    return res.status(400).json({
      message: "Some fields ommited.",
    });
  }

  // Check for duplicate name
  const duplicate = await Sneaker.findOne({ name }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Nname must be unique." });
  }

  const sneakerObject = {
    name,
    purchased,
    quantity,
  };

  //create and save an admin to mongoDb
  const sneaker = await Sneaker.create(sneakerObject);
  if (sneaker) {
    //created
    res.status(201).json({ message: `New Sneaker ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid Sneaker data received" });
  }
});

// @desc update a player
// @route PATCH /players
// @access Private
const updateSneaker = asyncHandler(async (req, res) => {
  const { ownerName, newOwnerAge } = req.body;

  const sneaker = await Sneaker.findOne({
    "purchaseDetails.owners.ownerName": "Jite",
  });

  console.log(sneaker);
});

// @desc delete a player
// @route DELETE /players
// @access Private
const deleteSneaker = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (id) {
    return res.status(400).json({ message: `Sneaker ID required` });
  }

  const player = await Sneaker.findById(id).exec();
  if (!player) {
    return res.status(400).json({ message: `Sneaker not found` });
  }

  const result = await player.deleteOne();
  const reply = `Sneaker ${result.name} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllSneakers,
  createNewSneaker,
  updateSneaker,
  deleteSneaker,
};
