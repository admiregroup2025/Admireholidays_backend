import imageGalleryModel from '../../models/imageGallery.model.js';
import { formatCountryName } from '../../utils.js';

// posting image on image Gallery
// adjust path if needed

export const postImageGallery = async (req, res) => {
  try {
    const { destination_id } = req.body;

    if (!destination_id) {
      return res.status(400).json({ msg: 'Destination ID is required', success: false });
    }

    const filePaths = req.files?.map((file) => file.path) || [];

    const existingGallery = await imageGalleryModel.findOne({ destination_id });

    if (existingGallery) {
      existingGallery.image.push(...filePaths);
      await existingGallery.save();
      return res.status(200).json({
        msg: 'Images uploaded successfully and gallery updated',
        success: true,
      });
    }

    const newImageGallery = new imageGalleryModel({
      destination_id,
      image: filePaths,
    });

    await newImageGallery.save();
    return res.status(201).json({
      msg: 'Image gallery created and images uploaded successfully',
      success: true,
    });
  } catch (error) {
    console.error(`Image Gallery Error: ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Getting image using name on place

export const getImageForPlace = async (req, res) => {
  const { destination_id } = req.params;
  try {
    if (!destination_id) {
      return res.status(400).json({ msg: 'destination name is rqeuired', success: false });
    }
    const imageGalleryData = await imageGalleryModel
      .findOne({
        destination_id,
      })
      .populate('destination_id');
    // console.log(imageGalleryData);
    if (!imageGalleryData) {
      return res
        .status(404)
        .json({ msg: 'The image for the given destination not found', success: false });
    }
    return res.status(200).json({
      msg: 'Image for the destination found successfully',
      success: true,
      imageGalleryData,
    });
  } catch (error) {
    console.log(`Post payment method Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Getting All the Image of Gallery
// export const getAllImage = async (req, res) => {
//   try {
//     const imageData = await imageGalleryModel.find().sort({ createdAt: -1 });
//     if (!imageData || imageData.length === 0) {
//       return res.status(404).json({ msg: 'Image Gallery is Empty', success: false });
//     }
//     return res
//       .status(200)
//       .json({ msg: 'Image Gallery SuccessFully Fetched', success: true, imageData });
//   } catch (error) {
//     console.log(`Get Image Gallery error -> ${error}`);
//     return res.status(500).json({ msg: 'Server Error', success: false });
//   }
// };

// Delete image from gallery
export const deleteImageFromGallery = async (req, res) => {
  const { destination_id, imageId } = req.body;
  console.log(destination_id,  image_urls);
  console.log()

  try {
    if (!destination_id || !imageId) {
      return res.status(400).json({ msg: 'Destination ID and Image ID are required', success: false });
    }

    const imageGallery = await imageGalleryModel.findOne({ destination_id });

    if (!imageGallery) {
      return res.status(404).json({ msg: 'Image gallery not found', success: false });
    }

    imageGallery.image = imageGallery.image.filter((img) => img !== imageId);
    await imageGallery.save();

    return res.status(200).json({
      msg: 'Image deleted successfully from the gallery',
      success: true,
      imageGallery,
    });
  } catch (error) {
    console.error(`Delete Image Error: ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
