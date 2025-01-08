import CartModel from "../models/CartModel";

const addCartProduct = async (req: any, res: any) => {
    const {id} = req.query;
    const body = req.body;
    console.log(body,id);
    try {
        if (id) {
            await CartModel.findByIdAndUpdate(id, body);
            res.status(200).json({
                message: 'Add Product',
                data: [],
            })
        } else {
            const item = new CartModel(body);
            await item.save();
            res.status(200).json({
                message: 'Add Product',
                data: item,
            })
        }


    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getCartItems = async (req: any, res: any) => {
    const uid = req.uid;
    try {
        const items = await CartModel.find({createdBy: uid})
        res.status(200).json({
            message: 'Get cart item success',
            data: items,
        })

    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { addCartProduct, getCartItems }