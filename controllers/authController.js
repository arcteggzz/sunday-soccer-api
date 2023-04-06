const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const refreshTokenDuration = `7d`;
const accessTokenDuration = `15m`;

// @desc admin Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  //of course these are the two fields we need.
  //note that it is email not username
  //we destructure them from req.body
  const { email, password } = req.body;

  //confirm that both fields are sent in
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  //confirm that both Admin exitsts.
  const foundAdmin = await Admin.findOne({ email }).exec();
  if (!foundAdmin) return res.status(401).json({ message: "Unauthorized" });

  //we use bcrypt to match the password passed to us against the password we have stored in the database.
  const match = await bcrypt.compare(password, foundAdmin.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  //create access token for admin
  //we are logged in at this point
  const accessToken = jwt.sign(
    {
      //all of this info in this object would be destructured when it reaches the Frontend
      //all the FE would need to decrypt this information
      AdminInfo: {
        username: foundAdmin.username,
        email: foundAdmin.email,
        personalCode: foundAdmin.personalCode,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${accessTokenDuration}` }
  );

  //create referesh token for admin
  const refreshToken = jwt.sign(
    { email: foundAdmin.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${refreshTokenDuration}` }
  );

  //save refresh token to database
  foundAdmin.refreshToken = refreshToken;
  const response = await foundAdmin.save();
  console.log(response);

  // Create secure cookie with refresh token
  //why are we creating a cookie?
  //we create a secure cookie with the refresh token to prevent random access
  //we send this cookie back to the client app and the app never has direct access to the refresh token generated.
  //when the client sends a request for the refresh token using the refresh route we created, we send back the jwt cookie.
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  const _username = foundAdmin.username;
  const _email = foundAdmin.email;
  const _id = foundAdmin._id;
  const _personalCode = foundAdmin.personalCode;

  // Send accessToken containing email and personalCode and username
  //we send this back to the client
  res.json({ _username, _email, accessToken, _id, _personalCode });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundAdmin = await Admin.findOne({
        email: decoded.email,
      }).exec();

      if (!foundAdmin) return res.status(401).json({ message: "Unauthorized" });

      //create a new access token for the user to use.
      const accessToken = jwt.sign(
        {
          AdminInfo: {
            username: foundAdmin.username,
            email: foundAdmin.email,
            personalCode: foundAdmin.personalCode,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${accessTokenDuration}` }
      );

      res.json({ accessToken });
    })
  );
});

// @desc admin Logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  //delete refreshToken from database
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundAdmin = await Admin.findOne({ refreshToken }).exec();
  if (!foundAdmin) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundAdmin.refreshToken = "";
  const result = await foundAdmin.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

module.exports = {
  login,
  refresh,
  logout,
};
