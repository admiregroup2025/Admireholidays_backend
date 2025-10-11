import heroSectionVideoModel from '../models/heroSection.model.js'
import { formatCountryName } from '../utils.js';

export const getHeroSectionVideo=async(req,res)=>{
  const {title}=req.params;
  try{
    if(!title){
        return res.status(400).json({msg:"Tilte Required", success:false});
    }
    const heroSectionData=await heroSectionVideoModel.findOne({title:formatCountryName(title)});
    if(!heroSectionData){
        return res.status(409).json({msg:"Video wont find for the specific title", success:false});
    }
    const publicUrl=heroSectionData.video_url.filter((video)=>video.visibility === 'Public').map((video)=>video.url);
    return res.status(200).json({msg:"Successfully fetched", success:true, publicUrl});
  }
  catch(error){
     console.error("Error in getHeroSectionVideo:", error);
     return res.status(500).json({msg:"Internal Server Error", success:false});
  }
}

export const getAllVideo=async(req,res)=>{
  try {
    const allVideo = await heroSectionVideoModel.find({});
    return res.status(200).json({msg:"Successfully fetched all videos", success:true, data:allVideo});
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"Internal Server Error", success:false});
  }
}
