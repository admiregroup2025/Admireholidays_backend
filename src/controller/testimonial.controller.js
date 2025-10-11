import testimonialModel from '../models/testimonialVideos.model.js';

export const testimonal = async (req, res) => {
  try {
    const testimonalData = await testimonialModel.find({visibility:'Public'});
    if (!testimonalData || testimonalData.length === 0) {
      return res.status(400).json({ msg: 'No testimonials found', success: false });
    }
    if (testimonalData) {
      // console.log(testimonalData)
      return res
        .status(200)
        .json({ msg: 'Testimonials fetched successfully', success: true, testimonalData });
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};
