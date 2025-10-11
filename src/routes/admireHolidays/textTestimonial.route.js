import express from 'express';
import uploadMedia from '../../middleware/mediaUploads.js';

const textTestimonialRouter = express.Router();

textTestimonialRouter.post(
  '/subit-text-testimonial',
  uploadMedia.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'trip_image', maxCount: 5 },
  ]),
  createTextTestimonial
);

export default textTestimonialRouter;