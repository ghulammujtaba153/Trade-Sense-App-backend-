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
        const mindfulResource = await MindfulResource.find();
        res.status(200).json(mindfulResource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

