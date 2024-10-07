import mongoose, { Schema } from "mongoose"


const schema = new Schema({
    title: {
        type: String,
        required: true,
    },

    // (Slug): là một chuỗi ký tự dùng để định danh một sản phẩm trong URL, thường được tạo từ tiêu đề của sản phẩm.
    // Ví dụ: Nếu tiêu đề của sản phẩm là "Chiếc áo thun trắng", slug có thể là "chiec-ao-thun-trang"
    slug: String,
    description: String,

    //Categories là một mảng các chuỗi, mỗi chuỗi đại diện cho một danh mục mà sản phẩm thuộc về. Trường này không bắt buộc, có thể chứa nhiều danh mục cho mỗi sản phẩm.
    //Ví dụ: "Áo", "Thời trang", "Nam"
    categories: [String],

    // Supplier đại diện cho nhà cung cấp của sản phẩm. Đây là thông tin quan trọng để biết nguồn gốc sản phẩm.
    // Ví dụ: Công ty ABC
    supplier:{
        require: true,
        type: String,
    },

    // Content là một chuỗi ký tự mô tả nội dung hoặc chi tiết sản phẩm
    // Ví dụ: Nội dung có thể là: "Áo thun trắng, chất liệu cotton mềm mại"
    content: String,

    // ExpiryDate là trường dùng để lưu trữ ngày hết hạn của sản phẩm, nếu có
    // Ví dụ: Bạn có thể lưu ngày hết hạn là 2024-10-31.
    expiryDate:{
        type:Date,
    },

    images:{
        type:[String],
    },

    createdAt:{
        type:Date,
        default:Date.now,

    },

    updatedAt:{
        type:Date,
        default: Date.now,
    },

    isDeleted:{
        type:Boolean,
        default: false,
    }
})

const ProductModel = mongoose.model('products', schema);

export default ProductModel;