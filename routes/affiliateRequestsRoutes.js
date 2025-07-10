import express from "express"
import { createAffiliateRequest, getAffiliateRequest, getAffiliateRequests, updateStatus } from "../controllers/affiliateRequestsController.js"


const affiliateRequestRouter = express.Router()


affiliateRequestRouter.post('/', createAffiliateRequest)

affiliateRequestRouter.get('/:id',   getAffiliateRequest)

affiliateRequestRouter.get('/records/all', getAffiliateRequests)

affiliateRequestRouter.patch('/update/:id', updateStatus)

export default affiliateRequestRouter