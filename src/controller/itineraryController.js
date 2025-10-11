import itinerary from "../models/itinerary.model.js"

export const getAllItinerary = async (req, res) => {
    try {
        const data = await itinerary.find({})
        if(!data) {
            return res.status(404).json({message:"No Itinerary Found"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}