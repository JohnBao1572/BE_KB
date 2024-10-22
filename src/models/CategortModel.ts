import mongoose, { Schema } from "mongoose";


const schema = new Schema({
    title: {
        type: String,
        required: true,
    },

    parentId: String,
    slug: {
        type: String,
    },

    description: String,
    createAt: {
        type: Date,
        default: Date.now,
    },

    updateAt: {
        type: Date,
        default: Date.now,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const CategoryModel = mongoose.model('categories', schema);
export default CategoryModel;