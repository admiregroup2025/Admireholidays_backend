import express from 'express';
import getAllImageGallery from '../../controller/imageGalleryController.js';
const router = express.Router();

router.get('/', getAllImageGallery);
// router.get('/international', getInternationalItinerary);

export default router;
