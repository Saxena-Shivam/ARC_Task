const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password, userType });
    userModel.userType = userType || "Requestor";
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    console.log("User", user);
    if (!user) {
      console.log("User not found");
      return res.status(403).json({ message: errorMsg, success: false });
    }
    console.log("User", user);
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      console.log("Password not matched");
      return res.status(403).json({ message: errorMsg, success: false });
    }
    console.log("User", user);
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, type: user.userType }, // <-- use user.userType
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    console.log("User", user);
    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
      userType: user.userType,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
