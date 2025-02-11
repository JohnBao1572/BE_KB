import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        name: String,

        phoneNumber: String,

        address:{
            type:String,
            required: true,
        },

        createdBy:{
            type:String,
            required: true,
        },

        isDeleted:{
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
)

const AddressModel = mongoose.model('address', schema);
export default AddressModel;