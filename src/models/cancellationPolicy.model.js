import mongoose from 'mongoose';

const cancellationSchema=new mongoose.Schema({
    cancellation_policy:{
        type:String,
        default:""
    }
},{timestamps:true})

const cancellationModel=mongoose.model('cancellation-policy',cancellationSchema);
export default cancellationModel