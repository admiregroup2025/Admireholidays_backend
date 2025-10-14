import { body } from "express-validator"
import Resort from "../../models/resort.model.js"

import cloudinary from "../../config/cloudinary.js";

// export const createResort = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       // images,
//       price_per_night,
//       is_active,
//       address,
//       city,
//       state,
//       country,
//       average_rating,
//       review_count,
//       number_of_ratings,
//       amenities,
//       tags,
//       visibility, // ✅ fixed typo from "visibiltiy"
//       discount,
//       check_in_time,
//       check_out_time,
//       availability_status,
//       activities,
//       policies,
//       contact_email,
//       contact_phone,
//       is_featured,
//     } = req.body;

//     console.log(req.body);

//     if (
//       !title ||
//       !description ||
//       // !images ||
//       !price_per_night ||
//       !is_active ||
//       !address ||
//       !city ||
//       !state ||
//       !country ||
//       !average_rating ||
//       !review_count ||
//       !number_of_ratings ||
//       !amenities ||
//       !tags ||
//       !visibility || // ✅ fixed typo
//       !discount ||
//       !check_in_time ||
//       !check_out_time ||
//       !availability_status ||
//       !activities ||
//       !policies ||
//       !contact_email ||
//       !contact_phone ||
//       !is_featured
//     ) {
//       return res.status(404).json({ message: "all feidls are not filed" });
//     }
//     //  const result = await cloudinary.uploader.upload(req.file.path, {
//     //   folder: "resort",
//     // });

//       const imageUrl = req.file.path || req.file.secure_url || req.file.url;

//     const resortObj = new Resort({
//       title,
//       description,
//       images: imageUrl,
//       images,
//       price_per_night,
//       is_active,
//       address,
//       city,
//       state,
//       country,
//       average_rating,
//       review_count,
//       number_of_ratings,
//       amenities,
//       tags,
//       visibility, // ✅ fixed typo
//       discount,
//       check_in_time,
//       check_out_time,
//       availability_status,
//       activities,
//       policies,
//       contact_email,
//       contact_phone,
//       is_featured,
//     });

//     await resortObj.save(); // ✅ fix: save the instance, not the model

//     console.log(resortObj);
//     return res.status(200).json({ resortObj });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "server error" });
//   }
// };


export const createResort = async (req, res) => {
  try {
    const {
      title,
      description,
      price_per_night,
      is_active,
      address,
      city,
      state,
      country,
      average_rating,
      review_count,
      number_of_ratings,
      amenities,
      tags,
      visibility,
      discount,
      check_in_time,
      check_out_time,
      availability_status,
      activities,
      policies,
      contact_email,
      contact_phone,
      is_featured,
    } = req.body;

    // Handle image upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload all files to Cloudinary and get their URLs
    const uploadedImages = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "resort",
      });
      uploadedImages.push(result.secure_url);
    }

    const resortObj = new Resort({
      title,
      description,
      images: uploadedImages, // <- Now an array of URLs
      price_per_night,
      is_active,
      address,
      city,
      state,
      country,
      average_rating,
      review_count,
      number_of_ratings,
      amenities,
      tags,
      visibility,
      discount,
      check_in_time,
      check_out_time,
      availability_status,
      activities,
      policies,
      contact_email,
      contact_phone,
      is_featured,
    });

    await resortObj.save();

    return res.status(201).json({ message: "Resort created", resortObj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getAll = async(req , res)=>{
    try {
        const data = await Resort.find()
        if(!data?.length){
            return res.status(400).json({message:"No data found"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}