import ResourceCount from "../models/resourceCountSchema.js";


export const createResourceCount = async (req, res) => {
    try {
        const { userId, resourceId } = req.body;


        const existingResourceCount = await ResourceCount.findOne({ userId, resourceId });

        if (existingResourceCount) {
            existingResourceCount.count += 1;
            await existingResourceCount.save();
            return res.status(200).json({
                message: "Resource count updated successfully",
                resourceCount: existingResourceCount
            });
        } else {
            const newResourceCount = new ResourceCount({
                userId,
                resourceId,
                count: 1
            });

            await newResourceCount.save();

            return res.status(201).json({
                message: "Resource count created successful",
                resourceCount: newResourceCount
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Error creating resource count",
            error: error.message
        });
    }
}