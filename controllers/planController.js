import Plan from "../models/planSchema.js";

export const createPlan = async (req, res) => {
    try {
        const { 
            name, 
            price, 
            description, 
            category, 
            subCategory, 
            couponCode, 
            discountPercentage 
        } = req.body;

        // Basic validation
        if (!name || !price || !description || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // For category "coupon", require couponCode and discountPercentage
        if (category === 'coupon') {
            if (!couponCode || discountPercentage == null) {
                return res.status(400).json({ error: 'Coupon code and discount percentage are required for coupons' });
            }
        } else {
            if (!subCategory) {
                return res.status(400).json({ error: 'Sub category is required for membership/plans' });
            }
        }

        // Create the plan
        const plan = await Plan.create({
            name,
            price,
            description,
            category,
            subCategory: category !== 'coupon' ? subCategory : null,
            couponCode: category === 'coupon' ? couponCode : null,
            discountPercentage: category === 'coupon' ? discountPercentage : null,
            isActive: true // Optional, defaults to true
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('Create Plan Error:', error);
        res.status(500).json({ error: error.message });
    }
};


export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updatePlan = async (req, res) => {
    try {
        const { 
            name, 
            price, 
            description, 
            category, 
            subCategory, 
            couponCode, 
            discountPercentage,
            isActive
        } = req.body;

        // Basic validation
        if (!name || !price || !description || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find existing plan
        const existingPlan = await Plan.findById(req.params.id);
        if (!existingPlan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Prepare update object
        let updateData = {
            name,
            price,
            description,
            category,
            isActive: typeof isActive === 'boolean' ? isActive : existingPlan.isActive // keep existing if not sent
        };

        if (category === 'coupon') {
            if (!couponCode || discountPercentage == null) {
                return res.status(400).json({ error: 'Coupon code and discount percentage are required for coupons' });
            }
            updateData.couponCode = couponCode;
            updateData.discountPercentage = discountPercentage;
            updateData.subCategory = null; // clear subCategory for coupon
        } else {
            if (!subCategory) {
                return res.status(400).json({ error: 'Sub category is required for membership/plans' });
            }
            updateData.subCategory = subCategory;
            updateData.couponCode = null; // clear coupon fields
            updateData.discountPercentage = null;
        }

        // Update the plan
        const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.status(200).json(updatedPlan);
    } catch (error) {
        console.error('Update Plan Error:', error);
        res.status(500).json({ error: error.message });
    }
};


export const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}