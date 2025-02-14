import BillModel from "../models/BillModel";
import CustomerModel from "../models/CustomModel";
import { handleSendMail } from "../utils/handleSendmail";

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
        })

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

export { addBill }