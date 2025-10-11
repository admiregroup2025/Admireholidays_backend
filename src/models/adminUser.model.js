import mongoose from 'mongoose';

const itineraryAdminUserScheam = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default:'user'
  },
},{timestamps:true});

const itineraryAdminUserModel = mongoose.model('itineraryAdminUser', itineraryAdminUserScheam);

export default itineraryAdminUserModel;
