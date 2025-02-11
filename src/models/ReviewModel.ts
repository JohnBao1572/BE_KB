import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        comment:{
            type:String,
            required: true,
        },

        star:{
            type: Number,
            required: true,
        },

        createdBy:{
            type: String,
            required: true,
        },

        parentId:{
            type: String,
            required: true,
        },

        images:[String],

        like:{
            type:[String],
            default: [],
        },

        dislike:{
            type: [String],
            default:[],
        },

        isDeleted:{
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
)

const ReviewModel = mongoose.model('reviews',schema);
export default ReviewModel;