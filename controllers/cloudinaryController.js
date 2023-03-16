const cloudinary = require("../cloudinary");
const Player = require("../models/Player");

// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
const imageUrl = cloudinary.image("lady.jpg", {
  transformation: [
    { gravity: "face", height: 400, width: 400, crop: "crop" },
    { radius: "max" },
    { width: 200, crop: "scale" },
  ],
});

//for update request
player.imageUrl = imageUrl;

//for creating player object during post request for player
const playerObject = {
  name,
  nickName,
  image: {
    public_id: imageUrl.public_id,
    url: imageUrl.url,
  },
  //other params
};
