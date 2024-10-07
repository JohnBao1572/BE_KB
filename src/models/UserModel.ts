import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({

    // Tên người dùng
    name: {
        type: String,
        required: true,
    },

    // Địa chỉ email người dùng
    email:{
        type: String,
        required: true,
    },

    // Mật khẩu người dùng
    password:{
        type:String,
        required: true,
    },

     // URL ảnh của người dùng
    photoUrl: String,

    // Quyền của người dùng
    rule:{
        type:Number,
        default: 1,
    },

    // Ngày tạo tài khoản
    createAt:{
        type:Date,
        default: Date.now(),
    },

     // Ngày cập nhật tài khoản
    updateAt:{
        type:Date,
        default: Date.now(),
    },
});

const UserModel = mongoose.model('users',UserSchema);
export default UserModel;