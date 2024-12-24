// Discount cho người dùng

const addNewPromotion = async(req:any, res:any)=>{
    const body = req.body;

    try {
        console.log(body);

        res.status(200).json({
            message:'dada',
        })
    } catch (error:any) {
        res.status(404).json({
            message:error.message
        })
    }
};

export {addNewPromotion};