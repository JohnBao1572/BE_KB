import ListItemModel from "../models/ListItem";


const addWishItem = async(req:any, res:any) =>{
    const {id} = req.query;
    const body = req.body;

    try {
        if(id){
            const items = await ListItemModel.findByIdAndUpdate(id, body);

            res.status(200).json({
                message: 'update like wish item success',
                data: items,
            })
        } else{
            const item = new ListItemModel(body)
            await item.save();

            res.status(200).json({
                message: 'Add wish list success',
                data: item,
            })
        }
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getWishItem = async(req:any, res:any) =>{
    const uid = req.uid;

    try {
        const item = await ListItemModel.find({createdBy: uid});
        
        res.status(200).json({
            message: 'Get wish item success',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message:error.message,
        })
    }
}

const updateWishItem = async(req:any, res:any) =>{
    const {id} = req.query;
    const body = req.body;

    try {
        const items = await ListItemModel.findByIdAndUpdate(id, body, {new: true});

        if(!items){
            throw new Error('Not found id item');
        }

        res.status(200).json({
            message: 'update wish item success',
            data: items
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeWishItem = async(req:any, res:any) =>{
    const {id} = req.query;

    try {
        const item = await ListItemModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Delete wish item success',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export {addWishItem, getWishItem, updateWishItem, removeWishItem}