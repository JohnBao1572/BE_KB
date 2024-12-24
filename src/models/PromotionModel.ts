import mongoose, { Schema } from "mongoose";
import { type } from "os";

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    code: {
        type: String,
        required: true,
    },

    value:{
        type:Number,
        required:true,
    },

    // Số lượng khuyến mãi khả dụng
    numOfAvailable:{
        type:Number,
        default: 100,
    },

    type:{
        type:String,
        default:'discount',
    },

    startAt: {
        type: Date,
        require: true,
    },

    endAt: Date,

    imageURL: String,
    // timestamp là thời gian tạo thời gian kết thúc
}, { timestamps: true });

const PromotionModel = mongoose.model('Promotion', schema);