import mongoose from 'mongoose';

const imageScehma = new mongoose.Schema(
  {
    url: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const customerGallerySchema = new mongoose.Schema({
  image: {
    type: [imageScehma],
    required: true,
  },
});

const customerGalleryModel = mongoose.model('customerGallery', customerGallerySchema);
export default customerGalleryModel;
