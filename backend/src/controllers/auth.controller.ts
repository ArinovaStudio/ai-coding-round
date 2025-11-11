import { Request, Response } from "express";
import User from "../models/auth";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: string, role: "admin" | "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const user = await User.findOne({ email: data.email });
    if (!user || !(await user.comparePassword(data.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

