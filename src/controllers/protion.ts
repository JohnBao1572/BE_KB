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

const checkDiscountCode = async(req:any, res:any)=>{
    const {code} = req.query;

    try {
        const item: any = await PromotionModel.findOne({code});

        if(!item){
            throw new Error('Invalid code')
        }

        if(item.numOfAvalable <= 0){
            throw new Error('Code is unvaible');
        }

        const now = Date.now();

        if(new Date(item.startAt).getTime() > now){
            throw new Error('Code is not start time');
        }

        if(item.endAt && new Date(item.endAt).getTime() < now){
            throw new Error('Code is ended')
        }

        res.status(200).json({
            message: 'Promotions value',
            data: {
                value: item._doc.value,
                type: item._doc.type,
            }
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

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

export { addNewPromotion, getPromotions, updatePromotion, deletePromotion, checkDiscountCode };