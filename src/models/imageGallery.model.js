import mongoose from 'mongoose';

const imageGalleryScheam = new mongoose.Schema(
  {
    destination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DestinationInternationAndDomestic',
      unique: true,
      required: true,
    },
    image: [String],
  },
  { timestamps: true }
);

const imageGalleryModel = mongoose.model('imageGallery', imageGalleryScheam);
export default imageGalleryModel;
