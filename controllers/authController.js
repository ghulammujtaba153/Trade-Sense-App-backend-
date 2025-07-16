import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from 'crypto';

dotenv.config();


export const register = async (req, res) => {
  const { profilePic, description, links, name, phone, email, password, role, gender, ageRange, goals, choosenArea, questionnaireAnswers } = req.body;

  try {

    console.log("registering user", req.body);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const deletedUser = await User.findOne({ email, isDeleted: true });
    if (deletedUser) {
      return res.status(400).json({ message: "User deleted by the admin, use different mail" });
    }
    const data={}
    data.name = name;
    data.phone = phone;
    data.email = email;
    data.password = bcrypt.hashSync(password, 10);

    if (role) {
      data.role = role;
    }

    if(profilePic) {
      data.profilePic = profilePic;
    }
    if(description) {
      data.description = description;
    }
    if(links) {
      data.links = links;
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


export const registerGoogle = async (req, res) => {
  const { email , profilePic, firstName, lastName, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(200).json({ existingUser , token });
      
    }

    const deletedUser = await User.findOne({ email, isDeleted: true });
    if (deletedUser) {
      return res.status(400).json({ message: "User deleted by the admin, use different mail" });
    }


    

    const data ={}
   
    if(profilePic){
      data.profilePic = profilePic
    }
    data.email = email;
    if(firstName && lastName){
      data.name = firstName + " " + lastName;
    }

    
    
    if(phone){
      data.phone = phone
    }
    
    data.isGoogle = true;

    const user = await User.create(data);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(201).json({ user , token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email , isDeleted: false});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    console.log("user", user)

    if(user.status !== "active"){
      return res.status(401).json({ message: "User is suspended by the admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    


    res.status(200).json({ 
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const setupProfile = async (req, res) => {
  const { id } = req.params;
  const { questionnaireAnswers} = req.body;

  console.log(req.body)

  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User is deleted" });
    }
    
    user.questionnaireAnswers = questionnaireAnswers;
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const updateProfile = async (req, res) => {
  
  const {userId, profilePic} = req.body

  try {
    const user = await User.findByIdAndUpdate(userId, {profilePic}, {new: true});
    res.status(200).json({ user });
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
  const { profilePic, description, links, name, phone, email, password, role, gender, ageRange, goals, choosenArea, questionnaireAnswers } = req.body;

  try {

    console.log("updating user", req.body);

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

    if (gender, ageRange) {
      data.gender = gender;
      data.ageRange = ageRange;
    }
    if(goals){
      data.goals = goals;
    }

    if(choosenArea){
      data.choosenArea = choosenArea;
    }
    if(description){
      data.description = description;
    }

    if(links){
      data.links = links;
    }

    if(questionnaireAnswers){
      data.questionnaireAnswers = questionnaireAnswers;
    }
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    delete user.password;
    user.password=password

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





// Generate a random alphanumeric code (e.g. 8 characters)
const generateRandomCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-character hex
};

// Check if code already exists
const isCodeUnique = async (code) => {
  const existing = await User.findOne({ affiliateCode: code });
  return !existing;
};

// Generate unique code
const generateUniqueAffiliateCode = async () => {
  let code;
  let attempts = 0;

  do {
    code = generateRandomCode();
    attempts++;
    if (attempts > 10) throw new Error('Failed to generate unique code');
  } while (!(await isCodeUnique(code)));

 

  return code;
};


export const makeAffiliate = async (req, res) => {
  const {id} = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAffiliate = true;
    const affiliateCode = await generateUniqueAffiliateCode();
    user.affiliateCode = affiliateCode;
    await user.save();
    res.status(200).json({ affiliateCode: affiliateCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 

