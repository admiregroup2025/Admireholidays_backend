import express from 'express';

import {getAllItinerary} from "../../controller/itineraryController.js"
const router = express.Router();


router.get("/",getAllItinerary)

export default router;
