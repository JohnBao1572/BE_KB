// Discount cho người dùng

import PromotionModel from "../models/PromotionModel";

const addNewPromotion = async (req: any, res: any) => {
    const body = req.body;

    if (new Date(body.endAt) <= new Date(body.startAt)) {
        return res.status(400).json({
            error: "Endtime must highter than Starttime.",
        });
    }
    console.log(body); // Kiểm tra dữ liệu nhận từ client
    try {
        const item = new PromotionModel(body);
        await item.save();
        res.status(200).json({
            message: 'Add new promotion successfully',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message:error.message || 'Lỗi server khi thêm khuyến mãi'
        })
    }
};

const getPromotions = async(req:any, res: any) =>{
    const body = req.body;

    try {
        const items = await PromotionModel.find();

        res.status(200).json({
            message: 'Get promotions successfully',
            data: items,
        })
    } catch (error:any) {
        res.status(404).json({
            message:error.message
        })
    }
}

export { addNewPromotion, getPromotions };