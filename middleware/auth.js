require("dotenv").config();
const Jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get the token from the header of the request
  const token = req.header("x-auth-token");
  if (!token) {
    // if there is no token, send the client a 401 , unauthorised message
    return res
      .status(400)
      .json({ message: "Access denied, no token provider" });
  }
  // else verify that the token is a valid one
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.send(400).json({ message: "Invalid token" });
  }
}

