import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";

const handelErrors = (err) => {

  let errors = { name: "", email: "", password: "" };

  if (err.message === "Email is not registered") {
    errors.email = "Email is not registered";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Password do not match";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({ name, email, password });

    const token = createToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    const errors = handelErrors(error);
    res.status(401).json({ errors });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user });
  } catch (error) {
    const errors = handelErrors(error);
    res.status(401).json({ errors });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send("logout");
};
