import express from 'express';
import { createFavourite, deleteFavourite, getFavourite } from '../controllers/favouriteController.js';


const favouriteRouter = express.Router();

favouriteRouter.post('/', createFavourite);
favouriteRouter.get('/:id', getFavourite);
favouriteRouter.delete('/:id', deleteFavourite);

export default favouriteRouter
