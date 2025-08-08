import Subscription from "../models/subscriptionSchema.js";


export const createSubscription = async(req, res) => {
    try {
        const subscription = await Subscription.create(req.body);
        const user = await User.findById(req.body.userId);
        user.isPremiun= true;
        user.save();
        
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const getSubscriptions = async(req, res) => {
    const { id } = req.params;
    try {
        const subscriptions = await Subscription.find({ userId : id });
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const updateSubscription = async(req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}