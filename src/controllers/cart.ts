import AddressModel from "../models/AddressModel";
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
            data: cartItems,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const addNewAddress = async (req: any, res: any) => {
    const body = req.body;

    const { isDefault } = body;

    const uid = req.uid;
    try {
        const item = new AddressModel(body);
        await item.save();

        // Nếu không cập nhật trạng thái isDefault của địa chỉ cũ,  người dùng có thể có nhiều địa chỉ mặc định cùng lúc, điều này có thể gây ra lỗi logic trong hệ thống.
        if (isDefault) {
            const defaultAddress = await AddressModel.findOne({
                $and: [{ createdBy: uid }, { isDefault: true }],
            });

            if (defaultAddress) {
                await AddressModel.findByIdAndUpdate(defaultAddress._id, { isDefault: false, });
            }
        }
        else {
            res.status(200).json({
                message: 'Add new address IF success',
                data: item,
            })
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const updateNewAddress = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        await AddressModel.findByIdAndUpdate(id, body);
        const item = await AddressModel.findById(id);

        res.status(200).json({
            message: 'update address IF success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getAddressCus = async (req: any, res: any) => {
    // Lấy id từ người dùng để lấy địa chỉ người dùng đó đã upgrade địa chỉ (Không lấy địa chỉ acc người khác)
    const id = req.uid;
    try {
        const item = await AddressModel.find({ createdBy: id });
        res.status(200).json({
            message: 'Get Address Cus Added',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const deleteAddressCus = async (req:any, res:any) =>{
    const {id} = req.query;
    try {
        const item = await AddressModel.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Delete Address Cus success',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message:error.message,
        })
    }
}

export { addCartProduct, getCartItems, removeCartItem, clearCardByUser, updateProductInCart, addNewAddress, updateNewAddress, getAddressCus, deleteAddressCus }