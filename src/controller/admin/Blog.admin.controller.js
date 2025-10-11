import blogModel from '../../models/blog.model.js';
import { formatCountryName } from '../../utils.js';

export const postBlog = async (req, res) => {
  const { title, content, visibility } = req.body;
  // console.log(title,content,visibility);
  try {
    if (!title || !content || !visibility) {
      return res.status(400).json({ msg: 'All the fileds are required', success: false });
    }
    const newBlog = new blogModel({
      title,
      content,
      visibility: formatCountryName(visibility),
      cover_image: req.file.path,
    });
    await newBlog.save();
    return res.status(200).json({ msg: 'Blog created successfully', success: true });
  } catch (error) {
    console.log(`Create blog error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blogData = await blogModel.find();
    //   console.log(blogData)
    if (!blogData || blogData.length === 0) {
      return res
        .status(409)
        .json({ msg: 'Either there is no Data or there few error', success: false });
    }
    return res.status(200).json({ msg: 'Successfully Fetched', success: true, blogData });
  } catch (error) {
    console.log(`Get Blog Error ${error}`);
    return res.status({ msg: 'Server Error', success: false });
  }
};



export const updateBlog = async (req, res) => {
  // console.log('Content-Type:', req.headers['content-type']);
  // console.log(req.body)
  const { title, content, visibility } = req.body;
  const { blogId } = req.params;
  // console.log(title, content, visibility, blogId);
  try {
    const blogData = await blogModel.findById(blogId);
    if (!blogData) {
      return res.status(404).json({ msg: 'Blog not find', success: false });
    }

    if (title) blogData.title = title;
    if (content) blogData.content = content;
    if (visibility) blogData.visibility = formatCountryName(visibility);
    if(req.file.path){
      blogData.cover_image=req.file.path;
    }

    // 3. Save updated blog
    await blogData.save();

    return res
      .status(200)
      .json({ msg: 'Blog updated successfully', success: true, data: blogData });
  } catch (error) {
    console.log(`Update Blog Error -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const deleteBlog=async(req,res)=>{
  const {blogId}=req.params;
  console.log(blogId);
  try{
    if(!blogId){
   return res.status(400).json({msg:"All the fields are required", success:false});
   }
    const isSuccess=await blogModel.findByIdAndDelete(blogId);
    if(!isSuccess){
      return res.status(401).josn({msg:"The selcted blog wont be delted try after somtimes", success:false});
    }
    return res.status(200).json({msg:"Blog is deleted SuccessFully", success:true});
  }
  catch(error){
    console.log(`Delete Blog Error ${error}`);
    return res.status(500).json({msg:"Server Error", success:false});
  }
}


export const getSingleBlog=async(req,res)=>{
   const {blogId}=req.params;
  try{
    if(!blogId){
      return res.status(400).json({msg:"All the fileds are required", success:false});
    }
    const blogData=await blogModel.findById(blogId);
    if(!blogData){
      return res.status(404).json({msg:"The Selected Blog won't exists", success:false});
    }
    return res.status(200).json({msg:"Successfullt fetched", success:true, blogData});
  }
  catch(error){
    console.log(`Get Single Blog ${error}`);
    return res.status(500).json({msg:"Server Error", success:false})
  }
}