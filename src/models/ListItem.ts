import { count } from "console";
import mongoose, { Schema } from "mongoose";


const schema = new Schema({
    createdBy: {
        type: String,
        required: true,
    },

    count:{
        type: Number,
    },

    subProductId: {
        type: String,
        required: true,
    },

    image: String,

    size: String,

    color: String,

    qty: Number,

    price: Number,

    productId: String,

    title: String,
});

const ListItemModel = mongoose.model('listItem', schema);
export default ListItemModel