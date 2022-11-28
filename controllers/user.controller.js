const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");

const { userValidation } = require("../validators/userValidation");
const JwtService = require("../services/JwtService");

const registerUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { fullname, email, password } = value;

    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      return res
        .status(400)
        .json({ message: "Bu email orqali ro'yhatdan o'tilgan" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const newUser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: "User qo'shildi", newUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Registration error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email noto'g'ri!" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Parol noto'g'ri!" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };
    const tokens = JwtService.generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_time_ms"),
      httpOnly: true,
    });

    return res.status(200).json({ ...tokens, payload });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Login error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const user = await UserModel.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    res.clearCookie("refreshToken");

    res.status(200).json("Tizimdan chiqdingiz");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Logout error" });
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ message: "Invalid token" });

    const userFromCookie = await JwtService.verifyRefresh(refreshToken);
    const userFromDB = await UserModel.findOne({ token: refreshToken });

    if (!userFromCookie || !userFromDB) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const user = await UserModel.findById(userFromCookie.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    const payload = {
      id: user._id,
      email: user.email,
    };
    const tokens = JwtService.generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_time_ms"),
      httpOnly: true,
    });

    return res.status(200).json({ ...tokens, ...payload });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Refresh error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    if (allUsers.length == 0) {
      return res.status(200).json({ message: "Birorta user yo'q" });
    }
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Get error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserToken,
  getUsers,
};
