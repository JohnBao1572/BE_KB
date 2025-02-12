import BillModel from "../models/BillModel";
import CustomerModel from "../models/CustomModel";

const addBill = async (req: any, res: any) => {
    const body = req.body;
    const uid = req.uid;

    try {
        body.customer_id = uid;
        const customer: any = await CustomerModel.findById(uid);
        const newBill = new BillModel(body);
        await newBill.save();

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