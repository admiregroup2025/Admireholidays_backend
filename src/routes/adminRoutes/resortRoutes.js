import express from 'express';

import { createResort, deleteResort, getAll, getResortById , updateResort } from '../../controller/admin/resortController.js';
import upload from "../../middleware/upload.js"
const Route = express.Router();



Route.post('/resort', upload.array('images',10), createResort);
Route.get("/all",getAll)
Route.get("/get/:id",getResortById)

Route.patch("/update/:id", upload.array("images"), updateResort);
Route.delete("/delete/:id", deleteResort)

export default Route;
