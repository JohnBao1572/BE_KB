import { title } from "process";
import SupplierModel from "../models/SupplierModel";
import { supplierForm } from "../forms/supplier";


const getSuppliers = async(req:any, res:any)=>{
    // Lấy thông tin về kích thước trang (pageSize) và số trang (page) từ query parameters trong yêu cầu
    const {pageSize, page} = req.query;

    try{
        const skip = (page - 1) * pageSize;

        const items = await SupplierModel.find({isDeleted:false}).skip(skip).limit(pageSize);

        // Đếm tổng số nhà cung cấp trong cơ sở dữ liệu
        const total = await SupplierModel.countDocuments();

        res.status(200).json({
            message: 'Products',
            data:{
                total,
                items,
            },
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

const getExportData = async(req:any, res:any)=>{
    const body = req.body;

    // Lấy các tham số start và end từ query parameters trong yêu cầu
    const{start, end} = req.query;

    // Khai báo một đối tượng filter để lưu trữ điều kiện lọc
    const filter: any = {};

    // Kiểm tra nếu cả start và end đều tồn tại
    if(start && end){
        filter.createdAt = {

             // ($lte): less than or equal to (nhỏ hơn hoặc bằng)
            $lte: end,

            // ($gte): greater than or equal to (lớn hơn hoặc bằng)
            $gte: start,
        };
    }
    

    try{

        // Tìm tất cả các nhà cung cấp trong cơ sở dữ liệu thỏa mãn điều kiện lọc
        const items = await SupplierModel.find(filter);

        // Khai báo một mảng để lưu trữ dữ liệu đã lọc
        const data: any = [];
        if(items.length>0){

            // Duyệt qua từng item trong danh sách nhà cung cấp đã tìm thấy
            items.forEach((item:any) => {

                // Khai báo một đối tượng value để lưu trữ thông tin của mỗi item
                const value:any ={};

                // Duyệt qua từng key trong body (các thuộc tính muốn xuất)
                body.forEach((key:string) =>{

                    // Thêm thông tin của key vào đối tượng value. Nếu không tìm thấy, mặc định là chuỗi rỗng.
                    value[`${key}`] = `${item._doc[`${key}`] ?? ''}`;
                });

                // Thêm đối tượng value vào mảng data
                data.push(value);
            })
        };

        res.status(200).json({
            message: 'Product',
            data: data,
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

const addNew = async (req:any, res:any)=>{
    const body = req.body;
    try{
        const newSupplier = new SupplierModel(body);
        newSupplier.save();

        res.status(200).json({
            message: 'Add new supplier success',
            data: newSupplier,
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

const update = async (req:any, res:any)=>{
    const body = req.body;
    const {id} = req.query;
    try{
        await SupplierModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'Update supplier success',
            data: [],
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

const removeSupplier= async (req:any, res:any)=>{
    const {id} = req.query;
    try{
        await SupplierModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Supplier removed success',
            data: [],
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

const getForm = async(req:any, res:any)=>{
    try{
        const form = {
            title: 'Supplier',
            layout: 'horizontal',
            labelCol: 6,
            wrapperCol: 18,
            formItems: supplierForm,
        };

        res.status(200).json({
            message: '',
            data: form,
        });
    } catch(error:any){
        res.status(404).json({
            message: error.message,
        });
    }
};

export {getExportData, getForm, removeSupplier, update, addNew, getSuppliers};