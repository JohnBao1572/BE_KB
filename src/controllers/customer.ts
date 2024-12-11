const create = async (req:any, res:any)=>{
    try {
        res.status(200).json({
            message: 'tadada',
            data: [],
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message:error
        })
    }
}

export {create};