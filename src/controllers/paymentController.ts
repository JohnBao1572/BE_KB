import { title } from "process";
import BillModel from "../models/BillModel";
import CustomerModel from "../models/CustomModel";
import { handleSendMail } from "../utils/handleSendmail";
import { url } from "inspector";
import NotificationModel from "../models/NotificationModel";
import { resolveSoa } from "dns";
import mongoose from "mongoose";

const addBill = async (req: any, res: any) => {
    const body = req.body;
    const uid = req.uid;

    try {
        // console.log(body);

        body.customer_id = uid;
        const customer: any = await CustomerModel.findById(uid);
        const newBill = new BillModel(body);
        await newBill.save();

        await handleSendMail({
            from: 'Me',
            to: 'jonnguyen1572@gmail.com',
            html: `
            <h1>Đơn hàng mới đã được đặt</h1>
            <p>
            Mã đơn hàng: ${newBill._id}
            <br>
            Tổng tiền: ${newBill.total}
            </p>`,
            subject: 'Đơn hàng mới do khách vừa order',
        });

        const dataNoti = {
            title: 'New bill',
            body: 'Customer ordered new bill',
            from: customer._doc.lastName,
            to: 'Admin',
            fromId: uid,
            toId: 'Admin',
            id: newBill._id,
            url: `http://localhost:3000/orders?id=${newBill._id}`,
        };

        const newNoti = new NotificationModel(dataNoti);
        await newNoti.save();
        console.log(newNoti);

        res.status(200).json({
            message: 'Add new bill success',
            data: newBill,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getBillForAdmin = async(req:any, res:any) =>{
    const {id} = req.query;

    try {
        const item =  await BillModel.find(id)

        res.status(200).json({
            message: 'Get bill for admin success',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getBillCustomer = async(req:any, res:any) =>{
    const uid = req.uid;

    try {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({ message: "ID not valid" });
        }

        // Lọc tất cả đơn hàng có với id khách hàng `customer_id` đúng với `uid`
        const item = await BillModel.find({ customer_id: uid });

        if (item.length === 0) {
            return res.status(404).json({ message: "Not found customer bill" });
        }
        res.status(200).json({
            message: 'Get customer bill success',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const customerDeleteBill = async (req: any, res: any) => {
    const { id } = req.query; // ID bill nhận từ request
    console.log("Received Bill ID:", id);

    if (!id) {
        return res.status(400).json({ message: 'Bill ID is required' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid Bill ID format:", id);
            return res.status(400).json({ message: 'Invalid Bill ID' });
        }

        const item = await BillModel.findById(id);

        if (!item) {
            console.log("Bill not found for ID:", id);
            return res.status(404).json({ message: 'Bill not found' });
        }

        console.log("Bill found:", item);
        
        await BillModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Bill deleted successfully' });

    } catch (error: any) {
        console.error("Error deleting bill:", error);
        res.status(500).json({ message: error.message });
    }
};

export { addBill,getBillForAdmin, getBillCustomer, customerDeleteBill }