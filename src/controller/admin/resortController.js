import { body } from "express-validator"
import Resort from "../../models/resort.model.js"

import cloudinary from "../../config/cloudinary.js";



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


export const getResortById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Resort.findById({_id:id})

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error('Get Itinerary By ID Error:', error);
    return res.status(500).json({
      success: false,
      msg: 'Failed to fetch itinerary.',
      error: error.message,
    });
  }
};



// export const createResort = async (req, res) => {
//   try {
//     console.log("REQ FILES:", req.files);
//     console.log("REQ BODY:", req.body);

//     const {
//       title,
//       description,
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
//       visibility,
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

//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }

//     if (!req.files || req.files.length === 0) {
//       console.error("No files found in req.files");
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     // Map file.path (or fallback) to get image URLs
//     const uploadedImages = req.files.map(file => {
//       // fallback in case path not present
//       if (file.path) return file.path;
//       if (file.url) return file.url;
//       if (file.secure_url) return file.secure_url;
//       console.warn("No URL field in file:", file);
//       return null;
//     }).filter(url => url !== null);

//     if (uploadedImages.length === 0) {
//       console.error("Could not extract any image URLs from req.files");
//       return res.status(500).json({ message: "Image URL extraction failed" });
//     }

//     const parseArrayField = (field) => {
//       if (Array.isArray(field)) return field;
//       if (typeof field === "string") {
//         // maybe comma-separated or single item
//         // If comma separated:
//         try {
//           // if user sends JSON string like '["A","B"]'
//           const parsed = JSON.parse(field);
//           if (Array.isArray(parsed)) return parsed;
//         } catch (_) {
//           // fallback single string
//         }
//         return [field];
//       }
//       return [];
//     };

//     const resortObj = new Resort({
//       title,
//       description,
//       images: uploadedImages,
//       price_per_night,
//       is_active,
//       address,
//       city,
//       state,
//       country,
//       average_rating,
//       review_count,
//       number_of_ratings,
//       amenities: parseArrayField(amenities),
//       tags: parseArrayField(tags),
//       visibility,
//       discount,
//       check_in_time,
//       check_out_time,
//       availability_status,
//       activities: parseArrayField(activities),
//       policies,
//       contact_email,
//       contact_phone,
//       is_featured,
//     });

//     const saved = await resortObj.save();
//     return res.status(201).json({
//       message: 'Resort created successfully',
//       resort: saved,
//     });
//   } catch (error) {
//     console.error("Error creating resort:", error);
//     return res.status(500).json({
//       message: 'Server error',
//       error: error.message,
//       stack: error.stack,
//     });
//   }
// };



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


export const updateResort = async (req, res) => {
  try {
    const { id } = req.params; // get id from URL param

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

    // Find the resort by id
    const resort = await Resort.findOne({ _id: id });
    if (!resort) {
      return res.status(404).json({ message: "Resort not found" });
    }

    // Check if title already exists on a different resort
    const duplicate = await Resort.findOne({ title, _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ message: "Title already exists" });
    }

    // Update images if new files uploaded
    if (req.files && req.files.length > 0) {
      // Assuming you're storing the image URL in 'path' or use 'filename' accordingly
      resort.images = req.files.map((file) => file.path);
    }

    // Update other fields
    resort.title = title;
    resort.description = description;
    resort.price_per_night = price_per_night;
    resort.is_active = is_active;
    resort.address = address;
    resort.city = city;
    resort.state = state;
    resort.country = country;
    resort.average_rating = average_rating;
    resort.review_count = review_count;
    resort.number_of_ratings = number_of_ratings;
    resort.amenities = amenities;
    resort.tags = tags;
    resort.visibility = visibility;
    resort.discount = discount;
    resort.check_in_time = check_in_time;
    resort.check_out_time = check_out_time;
    resort.availability_status = availability_status;
    resort.activities = activities;
    resort.policies = policies;
    resort.contact_email = contact_email;
    resort.contact_phone = contact_phone;
    resort.is_featured = is_featured;

    await resort.save();

    return res.status(200).json({ message: "Resort updated successfully" });
  } catch (error) {
    console.error("Error updating resort:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




export const deleteResort = async(req,res)=>{
  try {
    const {id} = req.params;
    const del = await Resort.findOne({_id:id})
    return res.status(200).json({message:"Deleted Succesfully"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Server Error"})
  }
}