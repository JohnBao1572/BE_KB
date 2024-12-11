import mongoose, { Schema } from "mongoose";

const schema  = new Schema({
    firstName: String,
    lastName: String,
    email:{
        required: true,
        type: String,
    },
    password:{
        required: true,
        type:String,
    },

});

const CustomerModel = mongoose.model('customer',schema);
export default CustomerModel;