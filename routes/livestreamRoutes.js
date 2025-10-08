import express from "express";
import {
  createLivestream,
  updateLivestream,
  deleteLivestream,
  getAllLivestreams,
  getCurrentLivestreams
} from "../controllers/livestreamController.js";

const router = express.Router();

router.post("/create", createLivestream);
router.put("/update/:id", updateLivestream);
router.delete("/delete/:id", deleteLivestream);
router.get("/all", getAllLivestreams);
router.get("/current-streams", getCurrentLivestreams);

export default router;
