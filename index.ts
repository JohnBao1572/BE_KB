import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { error } from 'console';
import Userrouter from './src/routers/user';
import cors from 'cors'
import productRouter from './src/routers/productRouter';
import supplierRouter from './src/routers/supplier';

import { verifyToken } from './src/middlewares/verifyToken';

dotenv.config();

const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGODB_URL || `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.64jr2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const secretKey = process.env.SECRET_KEY;  // Lấy giá trị SECRET_KEY từ biến môi trường

console.log('Secret Key: (Đây là bí mật nên không bật mí)', secretKey);  // In ra secret key

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', Userrouter);
app.use(verifyToken);
app.use('/product', productRouter);
app.use('/supplier', supplierRouter);

app.use(verifyToken);

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log("Connect successfully");
    } catch (error) {
        console.log("Cannot connect");
    }
}

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server is running at http://localhost:${PORT}');
        });
    })
    .catch((error) => {
        console.log(error);
    });


