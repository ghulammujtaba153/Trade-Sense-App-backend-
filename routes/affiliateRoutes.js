import express from "express"
import { createAffiliate, getAffiliates } from "../controllers/affiliateController.js";


const affiliateRouter = express.Router()

affiliateRouter.post("/", createAffiliate);
affiliateRouter.get("/:id", getAffiliates);

export default affiliateRouter