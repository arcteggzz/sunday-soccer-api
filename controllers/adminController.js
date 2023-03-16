const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all admins
// @route GET /admins
// @access Private
const getAllAdmin = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select("-password").lean();
  if (!admins || admins.length === 0) {
    return res.status(400).json({ message: "No Admins created" });
  }
  return res.json(admins);
});

// @desc Create an admin account
// @route POST /admins
// @access Private
const createNewAdmin = asyncHandler(async (req, res) => {
  //destructure our variables from req.body
  const { username, email, password, personalCode } = req.body;

  //confirm that all data came in
  if (!username || !email || !password || !personalCode) {
    return res
      .status(400)
      .json({ message: "Kindly fill all required fields." });
  }

  // Check for duplicate username
  //chain .lean() because you want to response gotten to not come with some unnencessary methods.
  //https://mongoosejs.com/docs/tutorials/lean.html
  //chain .exec() after findOne
  const duplicate = await Admin.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash password using bcrypt
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const adminObject = { username, email, password: hashedPwd, personalCode };

  //create and save an admin to mongoDb
  const admin = await Admin.create(adminObject);
  if (admin) {
    //created
    res.status(201).json({ message: `New Admin ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid Admin data received" });
  }
});

// @desc update a admin
// @route PATCH /admins
// @access Private
const updateAdmin = asyncHandler(async (req, res) => {
  const { id, username, password, personalCode } = req.body;

  //confirm data gotten
  if (!id || !username || !personalCode) {
    return res
      .status(400)
      .json({ message: "All fields except password and email are required" });
  }

  //check if admin account exists
  //notice we don't chain .lean() because we need the .save() on this object
  const admin = await Admin.findById(id).exec();
  if (!admin) {
    return res.status(400).json({ message: "Admin account not found" });
  }

  //check for duplicates
  const duplicate = await Admin.findOne({ username }).lean().exec();
  //we will find a duplicate and then check if it is the one we want by using the id
  //prevent admins from changing their usernames to existing usernames
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  //all checks done, we can update our admin object
  admin.username = username;
  admin.personalCode = personalCode;

  //for someone trying to update his password
  if (password) {
    // Hash password
    admin.password = await bcrypt.hash(password, 10); // salt rounds
  }

  //save admin back to database
  const updatedAdmin = await admin.save();

  res.json({ message: `${updatedAdmin.username} updated` });
});

// @desc delete a admin
// @route DELETE /admins
// @access Private
const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Admin ID Required" });
  }

  // Does the admin exist to delete?
  const admin = await Admin.findById(id).exec();
  if (!admin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const result = await admin.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllAdmin, createNewAdmin, updateAdmin, deleteAdmin };
