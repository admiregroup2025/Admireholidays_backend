import cityModel from '../../models/city.model.js';
import mongoose from 'mongoose';
import { formatCountryName } from '../../utils.js';

export const createCity = async (req, res) => {
  const { city_name, city_category, visibility, id } = req.body;
  console.log(typeof city_category);

  try {
    // 1. Validate required fields
    console.log(city_name, city_category, visibility, id);
    if (!city_name || !city_category || !visibility || !id) {
      return res.status(400).json({ msg: 'All fields are required', success: false });
    }

    // 2. Check if city already exists
    const formattedName = formatCountryName(city_name);
    const cityExists = await cityModel.findOne({ city_name: formattedName });
    if (cityExists) {
      return res.status(409).json({ msg: 'City already exists', success: false });
    }

    // 3. Normalize city_category input
    let citiCategoryData = [];
    if (Array.isArray(city_category)) {
      citiCategoryData = city_category;
    } else if (typeof city_category === 'string') {
      try {
        const parsed = JSON.parse(city_category);
        citiCategoryData = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        citiCategoryData = [city_category];
      }
    }

    // 4. Create new city
    const imagepath = req.files.map((file) => file.path);
    console.log(imagepath);
    const newCity = new cityModel({
      city_name: formattedName,
      city_category: citiCategoryData,
      visibility: formatCountryName(visibility),
      city_image: imagepath,
      state: id,
    });

    await newCity.save();

    return res.status(201).json({ msg: 'City created successfully', success: true, data: newCity });
  } catch (error) {
    console.error('createCity ->', error);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const getStateCity = async (req, res) => {
  const { destinationId } = req.params;
  // console.log(destinationId);
  try {
    const objectId = new mongoose.Types.ObjectId(destinationId);
    const citiesData = await cityModel.find({ state: objectId });
    console.log(citiesData);
    if (!citiesData || citiesData.length == 0) {
      return res.status(409).json({ msg: 'No cities Availabe', success: false });
    }
    return res.status(200).json({ msg: 'successfully fetched', success: true, citiesData });
  } catch (error) {
    console.log(`Get cities Error -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const getCity = async (req, res) => {
  const { cityId } = req.params;
  console.log(cityId);
  try {
    if (!cityId) {
      return res.status(400).json({ msg: 'city needs to be selected', success: false });
    }
    const cityData = await cityModel.findById(cityId);
    if (!cityData) {
      return res.status(400).json({ msg: 'There is no city exists', success: false });
    }
    return res.status(200).json({ msg: 'Successfully cities fetched', success: true, cityData });
  } catch (error) {
    console.log(`Get City Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const UpdateCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { city_name, city_category, visibility, id } = req.body;

    const existingCity = await cityModel.findById(cityId);
    if (!existingCity) {
      return res.status(404).json({ msg: 'City not found', success: false });
    }

    const formattedName = formatCountryName(city_name);
    let citiCategoryData = [];
    if (typeof city_category === 'string') {
      try {
        const parsed = JSON.parse(city_category); // ✅ This will parse it to array
        citiCategoryData = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        citiCategoryData = [city_category];
      }
    }

    const imagepath = req.files.map((file) => file.path);

    const updatedCity = await cityModel.findByIdAndUpdate(
      cityId,
      {
        city_name: formattedName,
        city_category: citiCategoryData,
        visibility: formatCountryName(visibility),
        city_image: [...existingCity.city_image, ...imagepath],
        state: id,
      },
      { new: true }
    );

    if (!updatedCity) {
      return res.status(404).json({ msg: 'City not found', success: false });
    }

    return res
      .status(200)
      .json({ msg: 'City updated successfully', success: true, data: updatedCity });
  } catch (error) {
    console.log(`Update City Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const DeleteCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!cityId) {
      return res.status(400).json({ msg: 'City ID is required', success: false });
    }

    const deletedCity = await cityModel.findByIdAndDelete(cityId);

    if (!deletedCity) {
      return res.status(404).json({ msg: 'City not found', success: false });
    }

    return res
      .status(200)
      .json({ msg: 'City deleted successfully', success: true, data: deletedCity });
  } catch (error) {
    console.log(`Delete City Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
