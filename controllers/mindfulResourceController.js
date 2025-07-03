import express from "express";
import MindfulResource from "../models/mindfulResourceSchema.js";
import User from "../models/userSchema.js";

export const createMindfulResource = async (req, res) => {
    const { title, description, thumbnail, type, url, category, pillar, isPremium, tags} = req.body;

    
    try {
        const mindfulResource = new MindfulResource({
            title,
            description,
            thumbnail,
            type,
            pillar,
            category,
            url,
            tags,
            isPremium,
        });
        await mindfulResource.save();
        res.status(201).json(mindfulResource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getMindfulResource = async (req, res) => {
  const { pillar, category, type } = req.query;

  try {
    const query = { isDeleted: false };

    if (pillar) query.pillar = pillar;
    if (category) query.category = category;
    if (type) query.type = type;

    const mindfulResources = await MindfulResource.find(query);
    res.status(200).json(mindfulResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const recommendMindfulResource = async (req, res) => {
  const { pillar, category, type } = req.query;

  try {
    const query = { isDeleted: false };

    if (pillar) query.pillar = pillar;
    if (category) query.category = category;
    if (type) query.type = type;

    const mindfulResources = await MindfulResource.find(query);
    res.status(200).json(mindfulResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteResource = async (req, res) => {
    const { id } = req.params;
  
    try {
      console.log("Deleting resource with ID:", id);
      const resource = await MindfulResource.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  

  export const updateResource = async (req, res) => {
    const { id } = req.params;
    const { title, description, thumbnail, type, url, pillar, category, tags, isPremium, duration } = req.body;
  
    try {
      const resource = await MindfulResource.findByIdAndUpdate(
        id,
        {
          title,
          description,
          thumbnail,
          type,
          pillar,
          category,
          url,
          tags,
          isPremium,
          duration,
        },
        { new: true }
      );
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  export const getBundleResource = async (req, res) => {
  const { pillar, category, type } = req.query;

  try {
    const query = { isDeleted: false };

    if (pillar) query.pillar = pillar;
    if (category) query.category = category;
    if (type) query.type = type;

    const mindfulResources = await MindfulResource.find(query);
    res.status(200).json(mindfulResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const bundleResources = async (req, res) => {
  const { pillar, category, type } = req.query;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGoals = user.goals || [];

    const result = [];

    for (const goal of userGoals) {
      const query = { isDeleted: false, tags: goal };

      // Add optional filters
      if (pillar) query.pillar = pillar;
      if (category) query.category = category;
      if (type) query.type = type;

      // Fetch resources for this goal
      const resources = await MindfulResource.find(query)
        .sort({ createdAt: -1 })
        .limit(2); // You can adjust the limit if needed

      result.push({
        goal,
        resources,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bundle resources:", error);
    res.status(500).json({ error: error.message });
  }
};



export const RandomOneAudioOneVideoResource = async (req, res) => {
  try {
    
    const audioResources = await MindfulResource.find({ type: "audio", isDeleted: false });
    const randomAudio = audioResources[Math.floor(Math.random() * audioResources.length)];

    
    const videoResources = await MindfulResource.find({ type: "video", isDeleted: false });
    const randomVideo = videoResources[Math.floor(Math.random() * videoResources.length)];

    res.status(200).json({
      audio: randomAudio || null,
      video: randomVideo || null,
    });
  } catch (error) {
    console.error("Error fetching random resources:", error);
    res.status(500).json({ error: error.message });
  }
};

