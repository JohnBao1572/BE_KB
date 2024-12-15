import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    firstName: String,
    lastName: String,

    email: {
        required: true,
        type: String,
    },

    password: {
        required: true,
        type: String,
    },

    isDeleted: {
        type: Boolean,
        default: true,
    },

    isVerify: {
        type: Boolean,
        default: false,
    },

    verifyCode: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const CustomerModel = mongoose.model('customer', schema);
export default CustomerModel;