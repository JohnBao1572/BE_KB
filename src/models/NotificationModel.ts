import mongoose, { Schema } from "mongoose";


const schema = new Schema({
    title: String,

    body: String,

    id: String,

    url: String,

    isRead: {type: Boolean, default: false},

    fromId:{type:String, required: true},

    toId: {type:String, required: true},

    from: String,

    to: String,
}, {timestamps: true});

const NotificationModel = mongoose.model('notifications',schema);
export default NotificationModel;