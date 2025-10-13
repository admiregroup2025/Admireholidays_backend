import itineraryModel from '../models/itinerary.model.js';
import imageGalleryModel from '../models/imageGallery.model.js';
import { formatCountryName } from '../utils.js';
import DestinationInternationAndDomesticModel from '../models/destinationInternationAndDomestic.model.js';
import mongoose from 'mongoose';

export const getImageGalleryByType = async (req, res) => {
  const { type } = req.params;

  try {
    const normalizedType = formatCountryName(type); // e.g., 'Domestic' or 'International'

    const result = await imageGalleryModel.aggregate([
      {
        $lookup: {
          from: 'destinationinternationanddomestics', // collection name (in lowercase and plural)
          localField: 'destination_id',
          foreignField: '_id',
          as: 'destinationData',
        },
      },
      {
        $unwind: {
          path: '$destinationData',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'destinationData.domestic_or_international': {
            $regex: `^${normalizedType}$`,
            $options: 'i',
          }, // Match the type
        },
      },
      {
        $project: {
          _id: 1,
          destination_id: 1,
          image: 1,
          destination_name: '$destinationData.destination_name',
          destination_tye: '$destinationData.domestic_or_international',
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(401).json({ success: false, message: 'No data available' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getImageGalleryByType:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getSingleItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryModel.findById(id).populate('selected_destination');
    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }
    return res.status(200).json({ success: true, data: itinerary });
  } catch (error) {
    console.error('Error in getSingleItineraryById:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Exclusive Itinerary
export const getExclusiveAndWeekendItinerary = async (req, res) => {
  try {
    const [exclusiveItineraryData, weekendItineraryDetails] = await Promise.all([
      itineraryModel
        .find({ classification: { $regex: /^exclusive$/i } })
        .populate('selected_destination'),
      itineraryModel
        .find({ classification: { $regex: /^weekend$/i } })
        .populate('selected_destination'),
    ]);
    return res
      .status(200)
      .json({ success: true, data: { exclusiveItineraryData, weekendItineraryDetails } });
  } catch (error) {
    console.log('Error in getExclusiveItinerary:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Trending Detsination
export const getTrendingDestination = async (req, res) => {
  try {
    const trendingDestination = await DestinationInternationAndDomesticModel.find({
      destination_type: { $all: [/^trending$/i, /^home$/i] },
    })
      .sort({ createdAt: -1 })
      .limit(20);
    if (!trendingDestination) {
      return res.status(404).json({ success: false, message: 'No trending destination found' });
    }
    return res.status(200).json({ success: true, data: trendingDestination });
  } catch (error) {
    console.error('Error in getTrendingDestination:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
export const getAllTrendingDestination = async (req, res) => {
  // console.log('run1');
  try {
    // console.log('run2');
    const data = await DestinationInternationAndDomesticModel.find({});
    if (!data) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
};

// getting International Holidays packages
export const getInternationalHolidaysPackages = async (req, res) => {
  try {
    const internationalHolidaysPackage = await itineraryModel.find().populate({
      path: 'selected_destination',
      match: { domestic_or_international: { $regex: /^international$/i } },
    });
    if (!internationalHolidaysPackage || internationalHolidaysPackage.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No International Holidays packages found' });
    }
    const filteredItineraries = internationalHolidaysPackage.filter(
      (itinerary) => itinerary.selected_destination !== null
    );
    console.log(filteredItineraries);
    console.log(filteredItineraries);
    return res.status(200).json({ success: true, data: filteredItineraries });
  } catch (error) {
    console.error('Error in getInternationalHolidaysPackages:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// International and Domestic Destination for Home page
export const domesticAndInternationForHome = async (req, res) => {
  try {
    const [Domestic, International] = await Promise.all([
      DestinationInternationAndDomesticModel.find({
        domestic_or_international: { $regex: /^domestic$/i },
      })
        .sort({ createdAt: -1 })
        .limit(10),
      DestinationInternationAndDomesticModel.find({
        domestic_or_international: { $regex: /^international$/i },
      })
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    if (!Domestic || Domestic.length == 0) {
      return res.status(404).json({ message: 'The Domestic data are not present', success: false });
    }
    if (!International || International.length == 0) {
      return res
        .status(404)
        .json({ message: 'The International data are not present', success: false });
    }

    return res
      .status(200)
      .json({ message: 'Successfully fetched', success: true, data: { Domestic, International } });
  } catch (error) {
    console.error(`Error in geting Domestic and International:, ${error}`);
    return res.status(500).json({ message: 'Server Error', success: false });
  }
};

// Get only Domestic Destination
export const getOnlyDomesticDestinationOrInternational = async (req, res) => {
  const { type } = req.params;
  try {
    const destinations = await DestinationInternationAndDomesticModel.find({
      domestic_or_international: { $regex: new RegExp(`^${type}$`, 'i') },
    })
      .sort({ createdAt: -1 })
      .limit(20);

    if (!destinations || destinations.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${type} destinations found`,
      });
    }

    return res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    console.error('Error in getOnlyDomesticDestinationOrInternational:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Itinerary by Destination ID
export const getItineraryByDestinationId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Destination ID:', id);
    const itineraries = await itineraryModel.find({
      selected_destination: new mongoose.Types.ObjectId(id),
    });
    if (!itineraries || itineraries.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No itineraries found for this destination' });
    }
    return res.status(200).json({ success: true, data: itineraries });
  } catch (error) {
    console.error('Error in getItineraryByDestinationId:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// export const testing = async (req, res) => {
//   try {
//     console.log("running")
//     // Find all itineraries where domestic_or_international = "international"
//     const internationalHolidaysPackage = await itineraryModel.find({
//       domestic_or_international: 'international',
//     });
//     console.log(internationalHolidaysPackage)
//     if (internationalHolidaysPackage.length === 0) {
//       console.log('here');
//       return res.status(404).json({
//         success: false,
//         message: 'No International Holidays packages found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: internationalHolidaysPackage,
//     });
//   } catch (error) {
//     console.error('Error in testing controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//     });
//   }
// };


export const testing = async (req, res) => {
  try {
    console.log("Running /testing");

    // ✅ Log all data for debugging
    const allDocs = await itineraryModel.find({});
    console.log("ALL DOCUMENTS:", allDocs);

    // ✅ Exact query (case-sensitive)
    const result = await itineraryModel.find({
      domestic_or_international: "international", // ← matches your data exactly
    });

    console.log("Query Result:", result);

    if (result.length === 0) {
      console.log("No international itineraries found");
      return res.status(404).json({
        success: false,
        message: "No International Holidays packages found",
      });
    }

    // ✅ Success
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in /testing:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
