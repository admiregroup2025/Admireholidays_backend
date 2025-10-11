import heroSectionVideoModel from '../../models/heroSection.model.js';
import { formatCountryName } from '../../utils.js';

// Creating new Hero Section video
export const heroSection = async (req, res) => {
  // console.log(req)
  // console.log(req.file.path);
  try {
    const { title, visibility } = req.body;

    console.log(title, visibility);


    
    

    if (!title) {
      return res.status(400).json({ msg: 'Title Field Required', success: false });
    }
    const titleAlreadyExists = await heroSectionVideoModel.findOne({
      title: formatCountryName(title),
    });
    if (titleAlreadyExists) {
      titleAlreadyExists.video_url = [
        ...titleAlreadyExists.video_url,
        {
          url: req.file.path,
          visibility: formatCountryName(visibility),
        },
      ];
      await titleAlreadyExists.save();
      return res.status(200).json({ msg: 'Hero video saved', success: true, titleAlreadyExists });
    }
    const newHeroVideo = new heroSectionVideoModel({
      title: formatCountryName(title),
      video_url: [
        {
          url: req.file.path,
          visibility: formatCountryName(visibility),
        },
      ],
    });
    await newHeroVideo.save();
    return res.status(200).json({ msg: 'Hero video saved', success: true, newHeroVideo });
  } catch (error) {
    console.log(`Admin Hero Section -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Right Now it is geeting all the Hero video from the DataBase but in future if needed we optimize it

export const getAllHeroVideo = async (req, res) => {
  const { page } = req.params;
  try {
    const heroVideoData = await heroSectionVideoModel.find({ title: formatCountryName(page) });
    if (!heroVideoData || heroVideoData.length === 0) {
      return res.status(404).json({ msg: 'No Data available', success: false });
    }
    // console.log(heroVideoData)
    return res.status(200).json({ msg: 'Success Fatched', success: true, heroVideoData });
  } catch (error) {
    console.log(`Get All the Hero video error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Update Hero Section Video

export const updateHeroVideo = async (req, res) => {
  const { title } = req.body;
  const { videoId } = req.params;

  try {
    const heroDoc = await heroSectionVideoModel.findOne({ title });

    if (!heroDoc) {
      return res.status(404).json({ msg: "The Data doesn't exist", success: false });
    }

    const videoItem = heroDoc.video_url.find((data) => data._id.toString() === videoId);

    if (!videoItem) {
      return res.status(404).json({ msg: 'Video not found', success: false });
    }

    // ✅ Toggle visibility
    videoItem.visibility = videoItem.visibility === 'Public' ? 'Private' : 'Public';

    await heroDoc.save();

    return res.status(200).json({ msg: 'Visibility toggled successfully', success: true });
  } catch (error) {
    console.log(`Update Hero Video Error -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Delete hero video 
export const deleteHeroVideo = async (req, res) => {
  // console.log(req.body)
  const { title } = req.query;
  const { videoId } = req.params;
  console.log(videoId);
  console.log(title);
  
  try {
    if (!videoId || !title) {
      return res
        .status(400)
        .json({ msg: 'Video needs to be selected for deletion', success: false });
    }

    // Find the document with given title
    const heroDoc = await heroSectionVideoModel.findOne({ title: formatCountryName(title) });

    if (!heroDoc) {
      return res.status(404).json({ msg: 'Hero section not found', success: false });
    }

    // Check if video exists
    const videoExists = heroDoc.video_url.some((video) => video._id.toString() === videoId);
    if (!videoExists) {
      return res.status(404).json({ msg: 'Video not found', success: false });
    }

    // Filter out the video
    heroDoc.video_url = heroDoc.video_url.filter((video) => video._id.toString() !== videoId);

    // Save the updated document
    await heroDoc.save();

    return res.status(200).json({ msg: 'Video deleted successfully', success: true });
  } catch (error) {
    console.log(`Delete Hero Video Error: ${error}`);
    return res.status(500).json({ msg: 'Server error', success: false });
  }
};

