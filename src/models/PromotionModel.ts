import mongoose, { Schema } from "mongoose";
import { type } from "os";

interface IPromotion extends Document {
    title: string;
    description?: string;
    code: string;
    value: number;
    numOfAvailable: number;
    type: string;
    startAt: Date;
    productIds?: string[];
    endAt?: Date;
    imageURL?: string;
    isDeleted: boolean;
    decrementAvailable: () => Promise<void>;
}

const schema = new Schema<IPromotion>({
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

    productIds:{
        type: [String],
    },

    endAt: Date,

    imageURL: String,

    isDeleted:{
        type: Boolean,
        default: false,
    },
    // timestamp là thời gian tạo thời gian kết thúc
}, { timestamps: true });

// Phương thức giảm số lượng mã giảm giá
schema.methods.decrementAvailable = async function(){
    if(this.numOfAvailable > 0){
        this.numOfAvailable -= 1;
        await this.save()
    }
}

const PromotionModel = mongoose.model('Promotion', schema);

export default PromotionModel;