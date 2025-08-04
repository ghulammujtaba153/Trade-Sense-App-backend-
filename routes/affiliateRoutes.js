import express from "express"
import { createAffiliate, getAffiliates, getAffiliatesRecords, getAffiliateUsers, revokeAffiliate } from "../controllers/affiliateController.js";


const affiliateRouter = express.Router()

affiliateRouter.post("/data", createAffiliate);
affiliateRouter.get("/:id", getAffiliates);
affiliateRouter.get("/records/:id", getAffiliatesRecords)
affiliateRouter.get("/users/records", getAffiliateUsers)
affiliateRouter.post("/users/revoke/:id", revokeAffiliate)

export default affiliateRouter