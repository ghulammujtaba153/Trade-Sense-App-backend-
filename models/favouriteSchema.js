
import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    itemType: {
      type: String,
      enum: ['MindfulResource', 'CourseModule'],
      required: true,
    },
    status:{
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);


favouriteSchema.index({ userId: 1, itemId: 1 });

const Favourite = mongoose.model('Favourite', favouriteSchema);

export default Favourite;
