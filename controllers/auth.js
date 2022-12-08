import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

// register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordhash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: 0,
      impressions: 0,
    });

    const saveduser = await newUser.save();
    res.status(200).json(saveduser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json("User not found");

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json(error);
  }
};
