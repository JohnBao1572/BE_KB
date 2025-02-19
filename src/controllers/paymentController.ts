import { title } from "process";
import BillModel from "../models/BillModel";
import CustomerModel from "../models/CustomModel";
import { handleSendMail } from "../utils/handleSendmail";
import NotificationModel from "../models/NotificationModel";
import mongoose from "mongoose";
import PromotionModel from "../models/PromotionModel";
import SubProductModel from "../models/SubProductModel";

const addBill = async (req: any, res: any) => {
    const body = req.body;
    const uid = req.uid;

    try {
        // console.log(body);

        // Validate số lượng code khi khách hàng đã dùng mã code thì mã code đó sẽ giảm 1
        if (body.discountCode) {
            const promotion = await PromotionModel.findOne({ code: body.discountCode });

            if (promotion) {
                await promotion.decrementAvailable();
            }
        }

        body.customer_id = uid;
        const customer: any = await CustomerModel.findById(uid);
        const newBill = new BillModel(body);
        await newBill.save();

        const productsDetails = newBill.products.map((product: any) => {
            return `
                <p>
                Title: ${product.title}
                <br>
                <p>Image:</p>
                <img src="${product.image}" alt="${product.title}" width="100">
                <br>
                Count: ${product.count}
                </p>
            `;
        }).join('');

        await handleSendMail({
            from: 'Me',
            to: 'jonnguyen1572@gmail.com',
            // from: 'Me',
            // to: CustomerModel.findById(email: email._id),

            html: `
            <h1>Đơn hàng mới đã được đặt</h1>
            <p>
            Mã đơn hàng: ${newBill._id}
            <br>
            </p>
             ${productsDetails}
             <br>
            Tổng tiền: ${newBill.total}`,
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

const getBillForAdmin = async (req: any, res: any) => {
    const { id } = req.query;

    try {
        const item = await BillModel.find(id)

        res.status(200).json({
            message: 'Get bill for admin success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getBillCustomer = async (req: any, res: any) => {
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
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const customerDeleteBill = async (req: any, res: any) => {
    const { id } = req.query;

    try {
        await BillModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Delete bill success',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
};

const updateOrderForCustom = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        if (body.paymentStatus === 1) {
            body.status = 2;

            // Validate qty hiện có của sản phẩm, sau khi addBill thì qty - count của addBill
            const bill = await BillModel.findById(id);
            if(bill){
                for(const product of bill.products){
                    await SubProductModel.findByIdAndUpdate(product.subProductId, {
                        $inc: {qty: -product.count}
                    })
                }
            }
        }

        const item = await BillModel.findByIdAndUpdate(id, body, { new: true })

        if (!item) {
            throw new Error('Not found order from Cus');
        }

        res.status(200).json({
            message: 'Update order success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { addBill, getBillForAdmin, getBillCustomer, customerDeleteBill, updateOrderForCustom }