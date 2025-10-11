/*import express from 'express';
import { validate } from '../middleware/Validate.js';
import {
  planYourJourney,
  contact,
  subscribe,
  suggestionComplain,
} from '../controller/leads.controller.js';

//import { validate } from '../middleware/validator.js';
import {
  contactValidator,
  planYourJourneyValidator,
  subscribeValidator,
  suggestionComplainValidator,
} from '../validate/leads.validate.js';

const router = express.Router();

router.post('/planYourJourney', planYourJourneyValidator, validate, planYourJourney);
router.post('/contact', contactValidator, validate, contact);
router.post('/subscribe', subscribeValidator, validate, subscribe);
router.post('/suggestionComplain', suggestionComplainValidator, validate, suggestionComplain);

export default router;
