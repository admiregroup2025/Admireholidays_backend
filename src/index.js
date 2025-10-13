import express from 'express';
import cors from 'cors';
import { ENV } from './config/ENV.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middleware/errorHandler.js';
import leadsRoute from './routes/admireHolidays/leads.route.js';
import destinationRoute from './routes/admireHolidays/destination.route.js';
import blogRoute from './routes/admireHolidays/blog.route.js';
import testimonialRoute from './routes/admireHolidays/testimonial.route.js';
import userRouter from './routes/admireHolidays/user.route.js';
import adminRoute from './routes/adminRoutes/admin.route.js';
import customerGalleryRoute from './routes/admireHolidays/customerGallery.route.js';
import heroSectionRoute from './routes/admireHolidays/heroSection.route.js';
import heroroutes from './routes/adminRoutes/heroroutes.js';
import { corsOptions } from './config/corsoptions.js';
import itinaray from './routes/admireHolidays/itinarayRoutes.js';
import getImageGallery from './routes/admireHolidays/imageGalleryRoutes.js';
import { get } from 'mongoose';
const app = express();
app.use(cookieParser());
// app.use(express.json());

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ status: 'API is working', version: '1.0' });
});

// Middleware to log requests
app.use('/api/v1/', leadsRoute);
app.use('/api/v1/destination', destinationRoute);
app.use('/api/v1', blogRoute);
app.use('/api/v1/', testimonialRoute);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/', customerGalleryRoute);
app.use('/api/v1', heroSectionRoute);
app.use('/admin', adminRoute);
app.use('/admin/hero', heroroutes);
app.use('/getpackage', itinaray);
app.use('/image', getImageGallery);

// Temp
app.get('/temp', (req, res) => {
  res.json({ message: 'Temporary endpoint for testing' });
});

// Global error handler
app.use(globalErrorHandler);

app.listen(ENV.PORT, () => {
  console.log('Server is start ✅');
});
