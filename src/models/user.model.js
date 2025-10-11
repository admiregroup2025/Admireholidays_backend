import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: Number,
    required: true,
  },
  otp: {
    type: String,
  },
  otp_expiry: {
    type: Date,
  },
});

const userModel = mongoose.model('UserModel', userSchema);

export default userModel;
