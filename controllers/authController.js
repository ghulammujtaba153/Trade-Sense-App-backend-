import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


export const register = async (req, res) => {
  const { name, phone, email, password, role, gender, ageRange, goals, choosenArea, questionnaireAnswers } = req.body;

  try {

    console.log("registering user", req.body);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const data={}
    data.name = name;
    data.phone = phone;
    data.email = email;
    data.password = bcrypt.hashSync(password, 10);

    if (role) {
      data.role = role;
    }

    if (gender, ageRange, goals, choosenArea, questionnaireAnswers) {
      data.gender = gender;
      data.ageRange = ageRange;
      data.goals = goals;
      data.choosenArea = choosenArea;
      data.questionnaireAnswers = questionnaireAnswers;
    }
    const user = await User.create(data);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(401).json({ message: "User is deleted" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // Don't send password back
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({ 
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const setupProfile = async (req, res) => {
  const { id } = req.params;
  const { gender, ageRange, goals, choosenArea } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User is deleted" });
    }
    user.gender = gender;
    user.ageRange = ageRange;
    user.goals = goals;
    user.choosenArea = choosenArea;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { profilePic, name, phone, email, password, role, gender, ageRange, goals, choosenArea, questionnaireAnswers } = req.body;

  try {

    console.log("registering user", req.body);

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const data={}
    data.name = name;
    data.phone = phone;
    data.email = email;
    if(password)
      data.password = bcrypt.hashSync(password, 10);

    if (profilePic) {
      data.profilePic = profilePic;
    }

    if (role) {
      data.role = role;
    }

    if (gender, ageRange, goals, choosenArea, questionnaireAnswers) {
      data.gender = gender;
      data.ageRange = ageRange;
      data.goals = goals;
      data.choosenArea = choosenArea;
      data.questionnaireAnswers = questionnaireAnswers;
    }
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params;
  

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isDeleted) {
      return res.status(404).json({ message: "User is deleted" });
    }
    
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false, role: "user" });
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getEditors = async (req, res) => {
  try {
    const users = await User.find({ 
      isDeleted: false, 
      role: { $in: ["editor"] }
    });    
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const addCategory = async (req, res) => {
  const { userId, tagName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (!Array.isArray(user.categories)) {
      user.categories = [];
    }

    if (!user.categories.includes(tagName)) {
      user.categories.push(tagName);
    }

    await user.save();
    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCategories = async (req, res) => {
  const { userId, categories } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.categories = categories;
    await user.save();
    res.status(200).json({ message: "Categories updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const getAdmins = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false, role: "admin" });
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const updatePassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}