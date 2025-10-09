import Livestream from "../models/livestreamSchema.js";

export const createLivestream = async (req, res) => {
  try {
    console.log(req.body);
    const stream = await Livestream.create(req.body);
    res.status(201).json({ success: true, data: stream });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateLivestream = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Livestream.findByIdAndUpdate(id, req.body, { new: true });
    if (!stream) return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, data: stream });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteLivestream = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Livestream.findByIdAndDelete(id);
    if (!stream) return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllLivestreams = async (req, res) => {
  try {
    const streams = await Livestream.find().sort({ startdatetime: -1 }).populate('user');
    res.status(200).json({ success: true, livestreams: streams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCurrentLivestreams = async (req, res) => {
  try {
    const now = new Date();

    // Find the latest stream whose endDateTime is in the future
    const stream = await Livestream.findOne({
      endDateTime: { $gte: now }
    })
      .sort({ startDateTime: -1 })
      .populate('user');

    // If no stream found, return null
    if (!stream) return res.status(200).json({ success: true, data: null });

    // Just send the latest stream
    return res.status(200).json({ success: true, data: stream });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
