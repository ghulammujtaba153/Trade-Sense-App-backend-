import Favourite from "../models/favouriteSchema.js";

export const createFavourite= async(req, res)=>{
    const {userId, itemId, itemType} = req.body;
    console.log(userId, itemId, itemType)

    try {
        const check = await Favourite.findOne({userId, itemId});
        if(check){
            return res.status(400).json({error: "Already Favourited"});
        }
        const favourite = await Favourite.create({userId, itemId, itemType});
        res.status(201).json(favourite);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const getFavourite = async(req, res)=>{
    const {id} = req.params;
    try {
        const favourite = await Favourite.find({userId: id}).populate('itemId');
        res.status(200).json(favourite);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const deleteFavourite = async(req, res)=>{
    const {id} = req.params;
    try {
        const favourite = await Favourite.findByIdAndDelete(id);
        res.status(200).json(favourite);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
