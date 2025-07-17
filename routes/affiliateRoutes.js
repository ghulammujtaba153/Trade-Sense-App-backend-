import express from "express"
import { createAffiliate, getAffiliates, getAffiliatesRecords } from "../controllers/affiliateController.js";


const affiliateRouter = express.Router()

affiliateRouter.post("/data", createAffiliate);
affiliateRouter.get("/:id", getAffiliates);
affiliateRouter.get("/records/:id", getAffiliatesRecords)

export default affiliateRouter