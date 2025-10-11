import VideoTestimonialModel from '../../models/testimonialVideos.model.js';
import { formatCountryName } from '../../utils.js';

export const testimonialVideo = async (req, res) => {
  const { title, visibility, location } = req.body;
  // console.log(title, ' ', visibility);
  try {
    if (!title || !visibility || !location) {
      return res.status(400).json({ msg: 'All the fileds are required', success: false });
    }

    const newTestimonial = new VideoTestimonialModel({
      video_url: req.file.path,
      title,
      visibility:formatCountryName(visibility),
      location,
    });
    await newTestimonial.save();
    return res.status(200).json({ msg: 'new testimonial saved', success: true, newTestimonial });
  } catch (error) {
    console.log(`Testimonial video-> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
