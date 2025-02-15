import NotificationModel from "../models/NotificationModel"

const getAllNotiFromCustomer = async (req: any, res: any) => {
    try {
        const item = await NotificationModel.find({ toId: 'Admin' });

        res.status(200).json({
            message: 'Get all notificaiton',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const updateNoti = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;
    try {
        const updateItem = await NotificationModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'Update new noti orders success',
            data: updateItem,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { getAllNotiFromCustomer, updateNoti };