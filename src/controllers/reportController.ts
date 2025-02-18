import { count } from "console";
import BillModel from "../models/BillModel";
import ReportModel from "../models/ReportModel";

const existUpdateBillToReport = async (req: any, res: any) => {
    const { date } = req.body

    try {
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const month = date.substring(0, 7); // Lấy YYYY-MM từ date

        // Lấy tất cả đơn hàng trong ngày đó
        const bills = await BillModel.find({
            createdAt: {
                $gte: new Date(`${date}T00:00:00.000Z`),
                $lt: new Date(`${date}T23:59:59.999Z`),
            },
            // paymentStatus: { $ne: 1 } viết tắt của "not equal" (không bằng).
            paymentStatus: 1, // Chỉ tính các đơn đã thanh toán
        });

        if (!bills.length) {
            return res.status(404).json({ message: 'No orders found for this date' });
        }

        const totalOrders = bills.length;
        const totalRevenue = bills.reduce((acc, bill) => acc + bill.total, 0);
        const totalProfit = totalRevenue * 0.7; // Giả định lợi nhuận là 20% doanh thu

        // Kiểm tra nếu báo cáo đã tồn tại thì cập nhật
        const existingReport = await ReportModel.findOne({ date });

        if (existingReport) {
            existingReport.revenue = totalRevenue;
            existingReport.profit = totalProfit;
            existingReport.totalOrders = totalOrders;
            await existingReport.save();
            return res.status(200).json({ message: 'Daily report updated successfully', data: existingReport });
        }

        // Nếu chưa có báo cáo, tạo mới
        const newReport = new ReportModel({
            date,
            month,
            revenue: totalRevenue,
            profit: totalProfit,
            totalOrders,
        });

        await newReport.save();

        res.status(201).json({ message: 'Daily report generated successfully', data: newReport });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Hàm report theo ngày
const getDailyReport = async (req: any, res: any) => {
    const { date } = req.query;

    try {
        if (!date) {
            throw new Error('Not found id bill by date');
        }

        const item = await ReportModel.find({ date });
        if (!item) {
            throw new Error('Not found bill by cus in that day')
        }

        res.status(200).json({
            message: 'Get report bill daily success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Hàm report tháng
const getMonthlyReport = async (req: any, res: any) => {
    const { month } = req.query;

    try {
        if (!month) {
            throw new Error('Not have order in that month');
        }

        const item = await ReportModel.find({ month })

        res.status(200).json({
            message: 'Get report month success',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Hàm get tổng bill
const getTotalBill = async(req:any, res:any) =>{
    try {
        const bill = await BillModel.find({paymentStatus: 1})
        const totalToReport = bill.reduce((a,b) => a + b.total, 0);
        const totalProfit = totalToReport * 0.7

        res.status(200).json({
            message: 'Get total to report success',
            data: {totalToReport, totalProfit},
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

// Hàm get thông tin sản phẩm top 5 sản phẩm được mua nhìu nhất
const get5ProductBought = async(req:any, res:any) =>{
    try {
        const bill = await BillModel.find({paymentStatus: 1});
        const productBestSeller : {[key: string]:any} = {};

        bill.forEach(bill => {
            bill.products.forEach((products: any) => {
                if(!productBestSeller[products.productId]){
                    productBestSeller[products.productId] = {...products, count: 0}
                }
                productBestSeller[products.productId].count += products.count;
            })
        })

        const topSelling = Object.values(productBestSeller).sort((a:any, b:any) => b.count - a.count).slice(0,5);

        res.status(200).json({
            message: 'Get product best sell',
            data: topSelling,
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { getDailyReport, getMonthlyReport, existUpdateBillToReport, getTotalBill,get5ProductBought }
 

// const getDailyReport = async (req: any, res: any) => {
//     const { date } = req.query;

//     try {
//         if (!date) {
//             throw new Error('Not found id bill by date');
//         }

//         // Lấy tất cả đơn hàng trong ngày đó với paymentStatus = 1
//         const bills = await BillModel.find({
//             createdAt: {
//                 $gte: new Date(`${date}T00:00:00.000Z`),
//                 $lt: new Date(`${date}T23:59:59.999Z`),
//             },
//             paymentStatus: 1,
//         });

//         if (!bills.length) {
//             return res.status(404).json({ message: 'No orders found for this date' });
//         }

//         const totalOrders = bills.length;
//         const totalRevenue = bills.reduce((acc, bill) => acc + bill.total, 0);
//         const totalProfit = totalRevenue * 0.2; // Giả định lợi nhuận là 20% doanh thu

//         // Kiểm tra nếu báo cáo đã tồn tại thì cập nhật
//         const existingReport = await ReportModel.findOne({ date });

//         if (existingReport) {
//             existingReport.revenue = totalRevenue;
//             existingReport.profit = totalProfit;
//             existingReport.totalOrders = totalOrders;
//             await existingReport.save();
//             return res.status(200).json({ message: 'Daily report updated successfully', data: existingReport });
//         }

//         // Nếu chưa có báo cáo, tạo mới
//         const newReport = new ReportModel({
//             date,
//             month: date.substring(0, 7), // Lấy YYYY-MM từ date
//             revenue: totalRevenue,
//             profit: totalProfit,
//             totalOrders,
//         });

//         await newReport.save();

//         res.status(201).json({ message: 'Daily report generated successfully', data: newReport });
//     } catch (error: any) {
//         res.status(404).json({
//             message: error.message,
//         })
//     }
// }

// const getMonthlyReport = async (req: any, res: any) => {
//     const { month } = req.query;

//     try {
//         if (!month) {
//             throw new Error('Not have order in that month');
//         }

//         // Lấy tất cả đơn hàng trong tháng đó với paymentStatus = 1
//         const bills = await BillModel.find({
//             createdAt: {
//                 $gte: new Date(`${month}-01T00:00:00.000Z`),
//                 $lt: new Date(`${month}-31T23:59:59.999Z`),
//             },
//             paymentStatus: 1,
//         });

//         if (!bills.length) {
//             return res.status(404).json({ message: 'No orders found for this month' });
//         }

//         const totalOrders = bills.length;
//         const totalRevenue = bills.reduce((acc, bill) => acc + bill.total, 0);
//         const totalProfit = totalRevenue * 0.2; // Giả định lợi nhuận là 20% doanh thu

//         // Kiểm tra nếu báo cáo đã tồn tại thì cập nhật
//         const existingReport = await ReportModel.findOne({ month });

//         if (existingReport) {
//             existingReport.revenue = totalRevenue;
//             existingReport.profit = totalProfit;
//             existingReport.totalOrders = totalOrders;
//             await existingReport.save();
//             return res.status(200).json({ message: 'Monthly report updated successfully', data: existingReport });
//         }

//         // Nếu chưa có báo cáo, tạo mới
//         const newReport = new ReportModel({
//             month,
//             revenue: totalRevenue,
//             profit: totalProfit,
//             totalOrders,
//         });

//         await newReport.save();

//         res.status(201).json({ message: 'Monthly report generated successfully', data: newReport });
//     } catch (error: any) {
//         res.status(404).json({
//             message: error.message,
//         })
//     }
// }

// export { getDailyReport, getMonthlyReport }