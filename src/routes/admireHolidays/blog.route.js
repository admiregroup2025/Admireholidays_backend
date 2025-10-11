import express from 'express';

import { getBlog, getBlogById } from '../../controller/blog.controller.js';

const blogRoute = express.Router();
blogRoute.get('/blog', getBlog);
blogRoute.get('/blog/:id', getBlogById);// Getting blog by ID
export default blogRoute;
