import express from 'express';
import cors from 'cors';
import { ENV } from './config/ENV.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import testRoute from './routes/Test.route.js';

import { globalErrorHandler } from './middleware/errorHandler.js';

// routes imports
import leadsRoute from './routes/leads.route.js';
import itinerariesRoute from './routes/destination.route.js';
import blogRoute from './routes/blog.route.js';
import testimonialRoute from './routes/testimonial.route.js';
import userRouter from './routes/user.route.js';
import adminRoute from './routes/adminUser.route.js';

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOption = {
  origin: [
    'http://www.admireholidays.com',
    'https://www.admireholidays.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOption));

connectDB();

// Middleware to log requests
app.use('/api/v1/', leadsRoute);
app.use('/api/v1/destination', itinerariesRoute);
app.use('/api/v1/blog', blogRoute);
app.use('/api/v1/', testimonialRoute);
app.use('/api/v1/user', userRouter);
app.use('/admin',adminRoute)

// Global error handler
app.use(globalErrorHandler);

app.listen(ENV.PORT, () => {
  console.log('Server is start ✅');
});
