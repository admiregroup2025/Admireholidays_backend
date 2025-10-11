import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    required: true,
  },
});
const heroSectionVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    video_url: {
      type: [videoSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const heroSectionVideoModel = mongoose.model('Hero-Section', heroSectionVideoSchema);

export default heroSectionVideoModel;
