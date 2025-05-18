const jwt = require("jsonwebtoken");
const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is require" });
  }
  try {
    const decoded = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};
const checkUserType = (userTypes) => {
  return (req, res, next) => {
    console.log("Decoded user:", req.user); // Add this line
    const userType = req.user.type;
    console.log("User type:", userType); // Add this line
    if (!userTypes.includes(userType)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
module.exports = { ensureAuthenticated, checkUserType };
