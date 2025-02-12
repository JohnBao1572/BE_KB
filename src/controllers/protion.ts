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
            message: error.message || 'Lỗi server khi thêm khuyến mãi'
        })
    }
};

const getPromotions = async (req: any, res: any) => {
    const body = req.body;
    const {limit} = req.query;

    try {
        // const parsedLimit = parseInt(limit, 10) || 0; // Chuyển thành số nguyên
        // const items = await PromotionModel.find();
        const items = await PromotionModel.find({isDeleted: false}).limit(limit);
        // const items = await PromotionModel.find({ isDeleted: false }).limit(parsedLimit);


        res.status(200).json({
            message: 'Get promotions successfully',
            data: items,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
};

const updatePromotion = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        await PromotionModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'Updated promotions successfully',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
};

const deletePromotion = async (req: any, res: any) => {
    const { id } = req.query;

    try {
        await PromotionModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Deleted Promotions successfully',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export { addNewPromotion, getPromotions, updatePromotion, deletePromotion };