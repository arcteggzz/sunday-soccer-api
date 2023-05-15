const mongoose = require("mongoose");

const ownersDetailsSchema = new mongoose.Schema({
  ownerName: { type: String },
  ownerAge: { type: Number },
});

const sneakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  purchased: {
    type: Boolean,
  },
  quantity: {
    type: Number,
    required: true,
  },
  purchaseDetails: {
    purchaseTime: {
      type: Number,
    },
    owners: [ownersDetailsSchema],
  },
});

module.exports = mongoose.model("Sneaker", sneakerSchema);
