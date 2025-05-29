import express from 'express'
import { createFaq, deleteFaq, getFaqs, updateFaq } from '../controllers/faqController.js'

const faqRouter = express.Router()

faqRouter.post('/', createFaq);

faqRouter.get('/', getFaqs);

faqRouter.delete('/:id', deleteFaq);

faqRouter.put('/:id', updateFaq)

export default faqRouter