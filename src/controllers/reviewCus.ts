import ReviewModel from "../models/ReviewModel";

const addNewRe = async (req: any, res: any) => {
    const body = req.body;

    try {
        const item = new ReviewModel(body);
        await item.save();

        res.status(200).json({
            message: 'Add new review product success',
            data: item,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Function này dành cho Cus
const getAll = async (req: any, res: any) => {
    // Giới hạn số lượng đánh giá trả về. Nếu không có, sẽ mặc định là 5.
    const { id, limit } = req.query;

    try {
        // Nếu limit không được cung cấp (undefined), thì nó sẽ mặc định lấy tối đa 5 review.
        const items = await ReviewModel.find({ parentId: id }).limit(limit ?? 5);

        res.status(200).json({
            message: 'Get all review product',
            data: items,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Function này dành cho User
const getData = async (req: any, res: any) => {
    const { id } = req.query;

    try {
        const items = await ReviewModel.find({ parentId: id });

        if (items.length === 0) {
            return res.status(200).json({
                message: 'No reviews found',
                data: {
                    count: 0,
                    total: 0
                }
            });
        }

        res.status(200).json({
            message: 'Get all review product from Cus',
            data: {
                // reduce() là một phương thức của mảng trong JavaScript, giúp gộp các phần tử để tính tổng, hiệu, tích, thương, ...

                // Cho a là cộng dồn, b là phần tử số sao hiện tại (Nó sẽ cộng số sao người dùng đã đánh giá)
                // Rồi chia cho tổng số phần tử đã đánh giá để lấy số sao trung bình
                count: items.reduce((a, b) => a + b.star, 0) / items.length,
                total: items.length,
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: 'Can not get data',
        })
    }
}

const updateRe = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        const item = await ReviewModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'Update review success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { addNewRe, getAll, getData, updateRe};