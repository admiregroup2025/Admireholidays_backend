import customerGalleryModel from '../models/customerGallery.model.js';

export const getCustomerGallery = async (req, res) => {
  try {
    const customerGalleryData = await customerGalleryModel.find();
    if (!customerGalleryData) {
      return res
        .status(409)
        .json({ msg: 'customerGalleery is Empty or try again later', success: false });
    }
    // console.log(customerGalleryData);
    return res
      .status(200)
      .json({ msg: 'Customer Gallery Fetched Succesfully', success: true, customerGalleryData });
  } catch (error) {
    console.log(`Get customer gallery ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
