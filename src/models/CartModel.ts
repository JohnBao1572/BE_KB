import mongoose, { Schema } from "mongoose";


const schema = new Schema({
    createdBy:{
        type: String,
        required: true,
    },

    count:{
        type: Number,
    },

    subProductId:{
        type: String,
        required: true,
    },

    size: String,

    color: String,

    price: Number,

    qty: Number,

    productId: String,
});

const CartModel = mongoose.model('carts', schema);
export default CartModel;