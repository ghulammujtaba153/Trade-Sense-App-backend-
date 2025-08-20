import express from "express";
import MindfulResource from "../models/mindfulResourceSchema.js";
import User from "../models/userSchema.js";
import HabitLog from "../models/habitLogSchema.js";
import { startOfWeek, endOfWeek } from 'date-fns';
import OnBoardingQuestionnaire from './../models/onBoardingQuestionnaireSchema.js';
import DailyThought from "../models/dailyThoughtSchema.js";
import TradingForm from './../models/tradingFormSchema.js';
import DailyQuote from "../models/dailyQuoteSchema.js";

export const createMindfulResource = async (req, res) => {
    const { instructor, title, description, thumbnail, type, url, category, pillar, duration, isPremium, tags} = req.body;

    
    try {
        const mindfulResource = new MindfulResource({
            instructor,
            title,
            description,
            thumbnail,
            type,
            pillar,
            category,
            url,
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

    const mindfulResources = await MindfulResource.find(query).populate("instructor").limit(6);
    res.status(200).json(mindfulResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const topPickResource = async (req, res) => {
  const { pillar, category, type } = req.query;

  try {
    const query = { isDeleted: false };

    if (pillar) query.pillar = pillar;
    if (category) query.category = category;
    if (type) query.type = type;

    const mindfulResources = await MindfulResource.find(query).populate("instructor").limit(7).sort({ likes: -1 });
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
    const { instructor, title, description, thumbnail, type, url, pillar, category, tags, isPremium, duration } = req.body;
  
    try {
      const resource = await MindfulResource.findByIdAndUpdate(
        id,
        {
          instructor,
          title,
          description,
          thumbnail,
          type,
          pillar,
          category,
          url,
          tags,
          duration,
          isPremium,
          
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

    const mindfulResources = await MindfulResource.find(query).populate("instructor");
    res.status(200).json(mindfulResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// export const bundleResources = async (req, res) => {
//   const { pillar, category, type } = req.query;
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const onboardingGoals = await OnBoardingQuestionnaire.findById("685d30845412243e81b295a2");
//     if (!onboardingGoals) return res.status(404).json({ error: "Onboarding goals not found" });

//     const selectedGoalIds = user.questionnaireAnswers.get("685d30845412243e81b295a2") || [];
//     console.log("selectedGoalIds", selectedGoalIds);

//     let selectedGoals = onboardingGoals.questions
//       .filter((q) => selectedGoalIds.includes(q._id.toString()))
//       .map((q) => q.text);

//     // Fallback to all goals if no match
//     if (!selectedGoals.length) {
//       selectedGoals = onboardingGoals.questions.map(q => q.text);
//     }

//     console.log("selectedGoals", selectedGoals);

//     const result = await Promise.all(
//       selectedGoals.map(async (goalText) => {
//         const query = { isDeleted: false, tags: goalText };
//         if (pillar) query.pillar = pillar;
//         if (category) query.category = category;
//         if (type) query.type = type;

//         const resources = await MindfulResource.find(query)
//           .sort({ createdAt: -1 })
//           .limit(2);

//         return { goal: goalText, resources };
//       })
//     );

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error("Error fetching bundle resources:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const bundleResources = async (req, res) => {
  const { pillar, category, type } = req.query;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const onboardingGoals = await OnBoardingQuestionnaire.findById("685d30845412243e81b295a2");
    if (!onboardingGoals) return res.status(404).json({ error: "Onboarding goals not found" });

    const selectedGoalIds = user.questionnaireAnswers.get("685d30845412243e81b295a2") || [];

    let selectedGoals = onboardingGoals.questions
      .filter((q) => selectedGoalIds.includes(q._id.toString()))
      .map((q) => q.text);

    // Fallback to all goals if none matched
    if (!selectedGoals.length) {
      selectedGoals = onboardingGoals.questions.map((q) => q.text);
    }

    // Limit to max 3 goals
    selectedGoals = selectedGoals.slice(0, 3);

    const result = await Promise.all(
      selectedGoals.map(async (goalText) => {
        const query = { isDeleted: false, tags: goalText };
        if (pillar) query.pillar = pillar;
        if (category) query.category = category;
        if (type) query.type = type;

        // First, try to find up to 4 matching resources
        let resources = await MindfulResource.find(query).populate("instructor")
          .sort({ createdAt: -1 })
          .limit(4);

        // If less than 4, fetch random resources to fill the gap
        if (resources.length < 4) {
          const remaining = 4 - resources.length;

          const additional = await MindfulResource.aggregate([
            { $match: { isDeleted: false, _id: { $nin: resources.map(r => r._id) } } },
            { $sample: { size: remaining } },
          ]);

          resources = [...resources, ...additional];
        }

        return { goal: goalText, resources };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bundle resources:", error);
    res.status(500).json({ error: error.message });
  }
};





export const RandomOneAudioOneVideoResource = async (req, res) => {
  const {id} = req.params;
  try {
    
    const audioResources = await MindfulResource.find({ type: "audio", isDeleted: false }).populate("instructor");
    const randomAudio = audioResources[Math.floor(Math.random() * audioResources.length)];

    
    const videoResources = await MindfulResource.find({ type: "video", isDeleted: false }).populate("instructor");
    const randomVideo = videoResources[Math.floor(Math.random() * videoResources.length)];


    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); 
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });     

    // Find habit logs for the current week
    const habitLogs = await HabitLog.find({
      userId: id,
      date: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });


    const tradingTrend = await TradingForm.find({ userId: id }).sort({ createdAt: -1 }).limit(1);

    const tradingTrendLogs = tradingTrend.map((log) => {
      let trendDirection = '';
      if (log.exitPrice > log.entryPrice) {
        trendDirection = 'upward';
      } else if (log.exitPrice < log.entryPrice) {
        trendDirection = 'downward';
      } else {
        trendDirection = 'neutral';
      }
      return {
        tradeDate: log.tradeDate,
        trendDirection, // Only show upward or downward
      };
    });


    const quote= await DailyQuote.find({}).sort({ createdAt: -1 }).limit(1);



    res.status(200).json({
      audio: randomAudio || null,
      video: randomVideo || null,
      quotation: quote[0].quote || "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      logs: habitLogs,
      tradingTrend: tradingTrendLogs
    });
  } catch (error) {
    console.error("Error fetching random resources:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getDailyThought = async (req, res) => {
  try {
    const dailyThoughtResources = await DailyThought.find({}).populate("instructor");

    

    if (dailyThoughtResources.length === 0) {
      return res.status(404).json({ message: "No daily thought resources found." });
    }


    console.log(dailyThoughtResources)


    res.status(200).json(dailyThoughtResources[dailyThoughtResources.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
