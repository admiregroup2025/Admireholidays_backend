import customerGalleryModel from '../../models/customerGallery.model.js';

export const postCustomerGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'At least one image is required', success: false });
    }

    const imagesPath = req.files.map((file) => ({ url: file.path }));

    // Check if gallery already exists
    let gallery = await customerGalleryModel.findOne();

    if (!gallery) {
      // Create new gallery with images
      const newGallery = new customerGalleryModel({
        image: imagesPath,
      });
      await newGallery.save();
      return res.status(201).json({ msg: 'Images uploaded successfully', success: true });
    }

    // Push new images into existing gallery
    gallery.image.push(...imagesPath);
    await gallery.save();

    return res
      .status(200)
      .json({ msg: 'Images added to existing gallery successfully', success: true });
  } catch (error) {
    console.error(`customerGallery -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const getAllCustomerGalleryImages = async (req, res) => {
  try {
    const gallery = await customerGalleryModel.findOne();

    if (!gallery || gallery.image.length === 0) {
      return res.status(404).json({
        msg: 'No images found in customer gallery',
        success: false,
      });
    }

    // Sort images by createdAt descending (latest first)
    const sortedImages = gallery.image.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      msg: 'Images fetched successfully',
      success: true,
      images: sortedImages,
    });
  } catch (error) {
    console.error(`Error fetching customer gallery images: ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Delete The customer Gallery image

export const deleteCustomerGalleryImage = async (req, res) => {
  const { imageIds } = req.body;

  try {
    if (!imageIds || imageIds.length === 0) {
      return res.status(400).json({
        msg: 'At least one image must be selected',
        success: false,
      });
    } 

    // Get the single gallery document
    const gallery = await customerGalleryModel.findOne();
    if (!gallery) {
      return res.status(404).json({
        msg: 'No Customer Gallery Image Available',
        success: false,
      });
    }

    const oldLength = gallery.image.length;

    // Filter out the images whose _id is in imageIds
    gallery.image = gallery.image.filter((img) => !imageIds.includes(img._id.toString()));

    const newLength = gallery.image.length;

    if (newLength === oldLength) {
      return res.status(404).json({
        msg: 'The selected images do not exist',
        success: false,
      });
    }

    await gallery.save();

    return res.status(200).json({
      msg: 'The selected images have been deleted',
      success: true,
      deletedCount: oldLength - newLength,
    });
  } catch (error) {
    console.log(`Delete the customer gallery image error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
