import mongoose from "mongoose";


const deleteRequestSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);


export default DeleteRequest