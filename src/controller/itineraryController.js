import itinerary from '../models/itinerary.model.js';

export const getAllItinerary = async (req, res) => {
  try {
    const data = await itinerary.find({});
    if (!data) {
      return res.status(404).json({ message: 'No Itinerary Found' });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getInternationalItinerary = async (req, res) => {
  try {
    const data = await itinerary.find({ domestic_or_international: 'international' });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No International Itinerary Found' });
    }

    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
