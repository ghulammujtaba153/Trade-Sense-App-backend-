import Subscription from "../models/subscriptionSchema.js";
import User from "../models/userSchema.js";


export const createSubscription = async(req, res) => {
    try {
        const subscription = await Subscription.create(req.body);
        const user = await User.findById(req.body.userId);
        user.isPremium= true;
        user.save();

        console.log("user", user);
        
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


export const cancelSubscription = async (req, res) => {
  try {
    const { event } = req.body;

    // 1. Check if the webhook type is CANCELLATION
    // if (!event || (event.type !== 'CANCELLATION' && event.type !== 'TEST')) {
    //   return res.status(400).json({ error: 'Invalid event type' });
    // }

    // 2. Find the subscription record by app_user_id
    const subscription = await Subscription.findOne({ appUserId: event.app_user_id });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }


    const updatedUser = await User.findByIdAndUpdate(
      subscription.userId,
      { isPremium: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Subscription cancelled successfully',
      user: updatedUser,
      cancelReason: event.cancel_reason || 'UNKNOWN'
    });

  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    res.status(500).json({ error: error.message });
  }
};



export const updateSubscription = async(req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}