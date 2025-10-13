import itineraryModel from '../../models/itinerary.model.js';

export const createItinerary = async (req, res) => {
  try {
    // Utility to safely parse JSON
    const parseJSON = (data) => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    };

    const {
      title,
      itinerary_visibility,
      itinerary_type,
      cancellation_policy,
      classification,
      days_information,
      destination_detail,
      destination_images,
      destination_thumbnails,
      duration,
      exclusion,
      hotel_as_per_category,
      inclusion,
      itinerary_theme,
      payment_mode,
      pricing,
      selected_destination_id,
      terms_and_conditions,
    } = req.body;

    const parsedClassification = parseJSON(classification);
    const parsedDaysInformation = parseJSON(days_information);
    const parsedDestinationDetail = parseJSON(destination_detail);
    const parsedDestinationImages = parseJSON(destination_images);
    const parsedDestinationThumbnails = parseJSON(destination_thumbnails);
    const parsedItineraryTheme = parseJSON(itinerary_theme);
    const parsedPricing = parseJSON(pricing);

    // Validate pricing format
    let finalPricing;
    if (typeof parsedPricing === 'string') {
      if (parsedPricing !== 'As per the destination') {
        return res.status(400).json({
          success: false,
          message: "Invalid pricing format. Must be 'As per the destination' or pricing object.",
        });
      }
      finalPricing = parsedPricing;
    } else if (
      typeof parsedPricing === 'object' &&
      parsedPricing !== null &&
      typeof parsedPricing.standard_price === 'number' &&
      typeof parsedPricing.discounted_price === 'number'
    ) {
      finalPricing = parsedPricing;
    } else {
      return res.status(400).json({
        success: false,
        message:
          'Invalid pricing object. Must contain standard_price and discounted_price as numbers.',
      });
    }

    const videoPath = req.file?.path || null;
    console.log('Uploaded Video:', req.file);

    const newItinerary = new itineraryModel({
      title,
      itinerary_visibility,
      itinerary_type,
      cancellation_policy,
      classification: parsedClassification,
      days_information: parsedDaysInformation,
      destination_detail: parsedDestinationDetail,
      destination_images: parsedDestinationImages.map((image) => image?.url || image),
      destination_thumbnails: parsedDestinationThumbnails.map((image) => image?.url || image),
      destination_video: videoPath,
      duration,
      exclusion,
      hotel_as_per_category,
      inclusion,
      itinerary_theme: parsedItineraryTheme,
      payment_mode,
      pricing: finalPricing,
      selected_destination: selected_destination_id,
      terms_and_conditions,
    });

    const savedItinerary = await newItinerary.save();

    return res.status(201).json({
      success: true,
      message: 'Itinerary created successfully.',
      data: savedItinerary,
    });
  } catch (error) {
    console.error('Create Itinerary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create itinerary.',
      error: error.message,
    });
  }
};

export const getAllItinerary = async (req, res) => {
  try {
    const itineraries = await itineraryModel
      .find({})
      // .populate('selected_destination')
      // .sort({ createdAt: -1 }); //find the itineraries according to the latest created date
    console.log('Fetched Itineraries:', itineraries);
    return res.status(200).json({
      success: true,
      data: itineraries,
    });
  } catch (error) {
    console.error('Get All Itineraries Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch itineraries.',
      error: error.message,
    });
  }
};




export const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryModel.findById(id).populate('selected_destination');

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

export const deleteItinerary = async (req, res) => {
  console.log('Delete Itinerary Request:', req.params);
  try {
    const { id } = req.params;
    const deletedItinerary = await itineraryModel.findByIdAndDelete(id);

    if (!deletedItinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Itinerary deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Itinerary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary.',
      error: error.message,
    });
  }
};

// Updating the itinerary

export const updateItinerary = async (req, res) => {
  try {
    const parseJSON = (data) => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    };

    const {
      title,
      itinerary_visibility,
      itinerary_type,
      cancellation_policy,
      classification,
      days_information,
      destination_detail,
      destination_images,
      destination_thumbnails,
      duration,
      exclusion,
      hotel_as_per_category,
      inclusion,
      itinerary_theme,
      payment_mode,
      pricing,
      selected_destination_id,
      terms_and_conditions,
    } = req.body;

    // --- Parse inputs the same way as creation ---
    const parsedClassification = parseJSON(classification);
    const parsedDaysInformation = parseJSON(days_information);
    const parsedDestinationDetail = parseJSON(destination_detail);
    const parsedDestinationImages = parseJSON(destination_images);
    const parsedDestinationThumbnails = parseJSON(destination_thumbnails);
    const parsedItineraryTheme = parseJSON(itinerary_theme);
    const parsedPricing = parseJSON(pricing);

    // --- Validate pricing ---
    let finalPricing;
    if (typeof parsedPricing === 'string') {
      if (parsedPricing !== 'As per the destination') {
        return res.status(400).json({
          success: false,
          message: "Invalid pricing format. Must be 'As per the destination' or pricing object.",
        });
      }
      finalPricing = parsedPricing;
    } else if (
      typeof parsedPricing === 'object' &&
      parsedPricing !== null &&
      typeof parsedPricing.standard_price === 'number' &&
      typeof parsedPricing.discounted_price === 'number'
    ) {
      finalPricing = parsedPricing;
    } else {
      return res.status(400).json({
        success: false,
        message:
          'Invalid pricing object. Must contain standard_price and discounted_price as numbers.',
      });
    }

    // --- Handle video update ---
    const videoPath = req.file?.path || undefined; // only update if new file exists

    const updateFields = {
      title,
      itinerary_visibility,
      itinerary_type,
      cancellation_policy,
      classification: parsedClassification,
      days_information: parsedDaysInformation,
      destination_detail: parsedDestinationDetail,
      destination_images: Array.isArray(parsedDestinationImages)
        ? parsedDestinationImages.map((image) => image?.url || image)
        : [],
      destination_thumbnails: Array.isArray(parsedDestinationThumbnails)
        ? parsedDestinationThumbnails.map((image) => image?.url || image)
        : [],
      duration,
      exclusion,
      hotel_as_per_category,
      inclusion,
      itinerary_theme: parsedItineraryTheme,
      payment_mode,
      pricing: finalPricing,
      selected_destination: selected_destination_id,
      terms_and_conditions,
    };

    if (videoPath) {
      updateFields.destination_video = videoPath;
    }

    const updatedItinerary = await itineraryModel.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    if (!updatedItinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Itinerary updated successfully.',
      data: updatedItinerary,
    });
  } catch (error) {
    console.error('Update Itinerary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update itinerary.',
      error: error.message,
    });
  }
};
