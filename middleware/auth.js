const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if there is not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtToken"));

    req.user = decoded.user;
    next();
  } catch (err) {
    //console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
