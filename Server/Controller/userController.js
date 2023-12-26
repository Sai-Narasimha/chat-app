const { UserModel } = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with given email is already exist..." });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All feilds are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email must be valid Email" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be strong password" });
    }
    user = new UserModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Email or Password is not valid" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(400)
        .json({ message: "Email or Password are not valid" });
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {}
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
