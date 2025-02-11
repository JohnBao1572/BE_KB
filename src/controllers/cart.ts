import CartModel from "../models/CartModel";

const addCartProduct = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;
    console.log(body, id);
    try {
        if (id) {
            const items = await CartModel.findByIdAndUpdate(id, body);
            res.status(200).json({
                message: 'Add Product',
                data: [items],
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

const updateProductInCart = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        // const items = await CartModel.findByIdAndUpdate(id, body);
        
        // Thêm new: true là do mặc định biến mới tạo trên sẽ trả về dữ liệu trước khi cập nhật.
        // Thêm new: true vào sẽ trả về dữ liệu sau khi cập nhật.
        const items = await CartModel.findByIdAndUpdate(id, body, { new: true }); // Thêm { new: true }

        if (!items) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        res.status(200).json({
            message: 'Update product in cart success',
            data: items,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getCartItems = async (req: any, res: any) => {
    const uid = req.uid;
    try {
        const items = await CartModel.find({ createdBy: uid })
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

const removeCartItem = async (req: any, res: any) => {
    const { id } = req.query;
    try {
        const items = await CartModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Delete cart item success',
            data: items,
        })

    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const clearCardByUser = async (req: any, res: any) => {
    const uid = req.uid;
    try {
        const cartItems = await CartModel.find({ createdBy: uid });

        cartItems.forEach(async (item) => await CartModel.findByIdAndDelete(item._id));

        res.status(200).json({
            message: 'Clear order cart success',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}



export { addCartProduct, getCartItems, removeCartItem, clearCardByUser, updateProductInCart }