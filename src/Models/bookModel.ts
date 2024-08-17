import moment from "moment";
import mongoose from "mongoose";
export interface IBook{
    _id?: string;
    title: string;
    author: string;
    authorImg:string;
    hero: string;
    description: string;
    prompts: string[];
    paragraphs: string[];
    images: string[];
    coverImg: string;
    likes: number;
    likedBy: string[];
    createdAt: string;
}

const BookeSchema=new mongoose.Schema<IBook>({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    authorImg:{
        type:String,
        required:true
    },
    hero:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    prompts:{
        type:[String],
        required:true
    },
    paragraphs:{
        type:[String],
        required:true
    },
    images:{
        type:[String],
        default:[]
    },
    coverImg:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    likedBy:{
        type:[String],
        default:[]
    },
    createdAt: {
        type: String,
        default: moment().format("MMMM Do YYYY, h:mm:ss a"),
    },
})

export default mongoose.model<IBook>("Booke",BookeSchema); 