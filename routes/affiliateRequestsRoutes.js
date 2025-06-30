import express from "express"
import { createAffiliateRequest, getAffiliateRequests, updateStatus } from "../controllers/affiliateRequestsController.js"


const affiliateRequestRouter = express.Router()


affiliateRequestRouter.post('/', createAffiliateRequest)

affiliateRequestRouter.get('/get', getAffiliateRequests)

affiliateRequestRouter.patch('/update/:id', updateStatus)

export default affiliateRequestRouter