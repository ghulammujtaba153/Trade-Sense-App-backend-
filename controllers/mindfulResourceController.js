import express from "express";
import MindfulResource from "../models/mindfulResourceSchema.js";

export const createMindfulResource = async (req, res) => {
    const { title, type, url, category, duration, isPremium, tags} = req.body;
    try {
        const mindfulResource = new MindfulResource({
            title,
            type,
            url,
            category,
            tags,
            duration,
            isPremium,
        });
        await mindfulResource.save();
        res.status(201).json(mindfulResource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getMindfulResource = async (req, res) => {
    try {
        const mindfulResource = await MindfulResource.find({isDeleted: false});
        res.status(200).json(mindfulResource);
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
    const { title, type, url, category, tags, isPremium, duration } = req.body;
  
    try {
      const resource = await MindfulResource.findByIdAndUpdate(
        id,
        {
          title,
          type,
          url,
          category,
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
  

