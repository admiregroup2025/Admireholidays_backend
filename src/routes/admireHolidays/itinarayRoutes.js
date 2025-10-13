import express from 'express';

import {
  getAllItinerary,
  getInternationalItinerary,
} from '../../controller/itineraryController.js';
const router = express.Router();

router.get('/', getAllItinerary);
router.get('/international', getInternationalItinerary);

export default router;
