import express from 'express';

import { createResort, getAll } from '../../controller/admin/resortController.js';
import upload from "../../middleware/upload.js"
const Route = express.Router();



Route.post('/resort', upload.single('image'), createResort);
Route.get("/all",getAll)
export default Route;
