import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    date:{
        type: String,
        required: true,
        // Thêm unique: true vào date → Đảm bảo không có 2 báo cáo cùng ngày.
        unique: true,
    },

    month:{
        type: String,
        required: true,
    },

    revenue:{
        type:Number,
        required: true,
    },

    profit:{
        type: Number,
        required: true,
    },

    totalOrders:{
        type: Number,
        required: true,
    }
}, {timestamps: true})

const ReportModel = mongoose.model('reports', schema);
export default ReportModel;