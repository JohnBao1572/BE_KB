import dotenv from 'dotenv';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';


//Điều này cho phép bạn sử dụng các giá trị từ file .env như là SECRET_KEY trong mã của bạn mà không cần hard-code nó vào trong code.
dotenv.config();

//(payload) Là đối tượng chứa thông tin người dùng (ví dụ: _id, email, password). JWT sẽ mã hóa thông tin này.
export const getAccesstoken = async (payload: {
    _id:Types.ObjectId;
    email:string;
    rule:number;
}) =>{
    const token = jwt.sign(payload, process.env.SECRET_KEY as string);
    return token;
}