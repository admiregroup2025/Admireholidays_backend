import AdminUserModel from '../../models/adminUser.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils.js';
// temp

// export const post=async (req,res)=>{
//   const {username, password}=req.body;
//   // const salt=bcrypt.salt(15)
//    const hashedPassword=await bcrypt.hash(password,10)
//   const newAdmin=new itineraryAdminUserModel({
//     username,password:hashedPassword,
//     role:'admin'
//   })
//   await newAdmin.save();
//   return res.status(200).json({msg:"Admin created", success:true})
// }

// For Admin User Login
export const AdminUserVerify = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    if (!username || !password) {
      return res.status(400).json({ msg: 'username or password required', success: false });
    }
    const isUserExists = await AdminUserModel.findOne({ username });
    if (!isUserExists) {
      return res.status(400).json({ msg: 'User does not exists', success: false });
    }
    // console.log(isUserExists.password);
    const matchedPaswword = await bcrypt.compare(password, isUserExists.password);
    // console.log(matchedPaswword);
    if (!matchedPaswword) {
      return res.status(401).json({ msg: 'Incorrect Password', success: false });
    }
    const token = generateToken(isUserExists._id, isUserExists.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // only true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: 'Login Successfull ',
      success: true,
      username: isUserExists.username,
      role: isUserExists.role,
      token,
    });
  } catch (error) {
    console.error(`itinerary Admin User -> ${error}`);
    return res.status(500).json({ msg: 'Server Pannel', success: false });
  }
};

// For Admin User Change Password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'All fields are required', success: false });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: 'New password and confirm password do not match', success: false });
  }

  try {
    const loggedInuser = await AdminUserModel.findById(req.userId);

    if (!loggedInuser) {
      return res.status(404).json({ msg: 'User not found', success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, loggedInuser.password);

    if (!isPasswordCorrect) {
      return res.status(409).json({ msg: 'Please enter correct old password', success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInuser.password = hashedPassword;
    await loggedInuser.save();

    return res.status(200).json({ msg: 'Password changed successfully', success: true });
  } catch (error) {
    console.log(`Change Password Error -> ${error}`);
    return res.status(500).json({ msg: 'Server error', success: false });
  }
};

// For Admin User creation
export const AdminUserCreate = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: 'All fields are required', success: false });
    }
    const isUserExist = await AdminUserModel.findOne({ username });
    if (isUserExist) {
      return res.status(309).json({ msg: 'User Already Exist', success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AdminUserModel({
      username,
      password: hashedPassword,
      role: 'user',
    });
    await newUser.save();
    return res.status(200).json({ msg: 'user created successfull', success: true });
  } catch (error) {
    console.error(`itinerary Admin user create -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
//  get all the existing user in dashboard

export const userExistedInAdmin = async (req, res) => {
  try {
    const adminUser = await AdminUserModel.find({ _id: { $ne: req.userId } });
    if (!adminUser) {
      return res.status(401).json({ msg: 'no othre user Exists', success: false });
    }

    return res.status(200).json({ msg: 'User fetched successfully', success: true, adminUser });
  } catch (error) {
    console.log(`Side Bar user for admin ${error}`);
    return res.status(500).json({ msg: 'Server error', success: false });
  }
};

// create /me controlller
export const getMe = async (req, res) => {
  try {
    const { userId, userRole } = req;

    return res.status(200).json({
      success: true,
      userId,
      role: userRole,
      msg: 'User authenticated',
    });
  } catch (err) {
    console.error('/me error:', err);
    return res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({ msg: 'Logout successful', success: true });
  } catch (error) {
    console.log(`Logout Error -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Delete admin user *Done only by Admin*

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);
  try {
    const userData = await AdminUserModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ msg: 'User Which u wanted to delete does not exists', success: false });
    }
    if (userData.role === 'admin') {
      return res.status(403).json({ msg: 'You cannnot delete Admin itself', success: false });
    }
    await AdminUserModel.findOneAndDelete({ _id: userId });
    return res.status(200).json({ msg: 'User Deleted Successfully', success: true });
  } catch (error) {
    console.log(`Delete User -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
