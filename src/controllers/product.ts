import { skip } from "node:test";
import CategoryModel from "../models/CategortModel";
import ProductModel from "../models/ProductModel";
import SubProductModel from "../models/SubProductModel";

//Đây là một interface TypeScript được sử dụng để định nghĩa một kiểu dữ liệu cho một đối tượng có hai thuộc tính: label và value.
// Khi bạn làm việc với các yêu cầu liên quan đến danh sách chọn (dropdown).
interface SelectModel {
    label: string;
    value: string;
}

// Lấy dữ liệu từ yêu cầu (req)
const addCategory = async (req: any, res: any) => {
    const body = req.body;

    // Phân destructure các thuộc tính từ body
    const { parentId, title, description, slug } = body;

    try {

        // Tìm danh mục đã tồn tại với parentId và slug giống nhau
        const category = await CategoryModel.find({

            // Sử dụng toán tử ($and) để kết hợp nhiều điều kiện tìm kiếm
            // Đảm bảo rằng bao nhiu điều kiện nêu ra đều phải thỏa mãn tất cả
            $and: [

                // Điều kiện 1: parentId phải bằng giá trị parentId trong body

                // Nó kiểm tra xem thuộc tính parentId trong tài liệu có bằng với giá trị parentId được truyền vào không

                // ($eq): Là một toán tử so sánh, có nghĩa là "bằng".
                { parentId: { $eq: parentId } },

                // Điều kiện 2: slug phải bằng giá trị slug trong body 

                // Nó kiểm tra xem thuộc tính slug trong tài liệu có bằng với giá trị slug được truyền vào không.
                { slug: { $eq: slug } }
            ],
        });

        // Nếu danh mục đã tồn tại, ném ra lỗi
        if (category.length > 0) {
            throw new Error('Category is existing!!');
        }

        // Tạo một danh mục mới
        const newCate = new CategoryModel(body);

        // Lưu danh mục mới vào cơ sở dữ liệu
        await newCate.save();
        res.status(200).json({
            message: 'Products',
            data: newCate,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const getCategories = async (req: any, res: any) => {

    // Lấy số trang và kích thước trang từ yêu cầu
    // (page) là số trang hiện tại
    // (pageSize) Là số lượng bản ghi muốn hiển thị trên mỗi trang
    const { page, pageSize } = req.query;

    try {

        // Tính toán số bản ghi cần bỏ qua dựa trên số trang
        // Ví dụ: Nếu đang ở trang (2), số lượng (10) bản ghi 
        // Ví dụ công thức trên: ((2 - 1) * 10 = 10)
        const skip = (page - 1) * pageSize;

        // Tìm tất cả danh mục không bị xóa
        const categories = await CategoryModel.find({

            // ($or) để tìm các danh mục mà isDeleted bằng false hoặc null
            $or: [

                // { isDeleted: false }: nghĩa là chúng không bị xóa
                { isDeleted: false },

                // { isDeleted: null }: nghĩa là chúng không có trạng thái xóa nào được xác định.
                { isDeleted: null }
            ],
        })

            // Bỏ qua các bản ghi đã chỉ định
            // Số lượng bản ghi bỏ qua được xác định bởi biến skip đã tính toán trước đó.
            .skip(skip)

            // Giới hạn số lượng bản ghi trả về
            // Giá trị được cung cấp sẽ quyết định số lượng bản ghi tối đa nhận được từ truy vấn
            .limit(pageSize);

        res.status(200).json({
            message: 'Products',
            data: categories,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
};

const getCategoryDetail = async (req: any, res: any) => {

    // Lấy ID từ yêu cầu
    const { id } = req.query;

    try {

        // Tìm danh mục theo ID
        const item = await CategoryModel.findById(id);

        // Trả về phản hồi thành công với dữ liệu của danh mục
        res.status(200).json({
            message: 'Products',
            data: item,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

// Hàm để tìm và xóa danh mục trong sản phẩm
const findAndRemoveCategoryInProducts = async (id: string) => {
    // const item = await CategoryModel.findById(id);

    // Tìm tất cả danh mục con của danh mục với ID được chỉ định
    const items = await CategoryModel.find({ parentId: id });

    // Nếu có danh mục con, đệ quy xóa các danh mục con này
    if (items.length > 0) {
        items.forEach(
            async (item: any) => await findAndRemoveCategoryInProducts(item._id)
        );
    }

    // Xóa danh mục khỏi sản phẩm
    await handleRemoveCategoryInProducts(id);
};

// Hàm xử lý xóa danh mục và cập nhật sản phẩm
const handleRemoveCategoryInProducts = async (id: string) => {

    // Xóa danh mục theo ID đã cho.
    // (findByIdAndDelete(id)): Đây là method tìm một tài liệu theo ID và xóa nó
    // Nếu danh mục với ID tương ứng tồn tại, nó sẽ bị xóa khỏi cơ sở dữ liệu.
    await CategoryModel.findByIdAndDelete(id);

    // Tìm tất cả sản phẩm có danh mục này
    const products = await ProductModel.find({
        categories:

            // ($all): Để tìm các tài liệu mà một trường là mảng và chứa tất cả các giá trị được chỉ định.
            { $all: id }
    });

    // Nếu có sản phẩm, cập nhật lại danh mục của sản phẩm
    if (products && products.length > 0) {

        // Duyệt qua từng sản phẩm trong danh sách sản phẩm
        products.forEach(async (item: any) => {

            // Lấy danh sách các danh mục của sản phẩm
            const cats = item._doc.categories;

            // Tìm vị trí của danh mục cần xóa
            // (element) là mang nghĩa ý nghĩa tổng quát (rõ ràng về ngữ cảnh) trong 1 mảng, đại diện cho phần tử hiện tại trong mảng đang được xử lý.

            // Một tham số trong hàm callback của phương thức findIndex()

            // item: dùng để chỉ 1 phần tử cụ thể nhưng không rõ ràng về ngữ cảnh
            // Tại sao không dùng item thay thế cho element: Nếu bạn có nhiều loại danh sách (ví dụ: sản phẩm, danh mục), sử dụng item có thể tạo ra sự mơ hồ.
            const index = cats.findIndex((element: string) => element === id);

            // Kiểm tra xem danh mục cần xóa có trong danh sách danh mục của sản phẩm hay không
            // Nếu tìm thấy, xóa danh mục khỏi danh sách
            // index !== -1: Nếu chỉ số không phải là -1, điều này có nghĩa là danh mục đã được tìm thấy trong danh sách.
            // (-1) là không có tìm thấy
            if (index !== -1) {

                // Xóa danh mục khỏi mảng cats
                // Phương thức này xóa 1 phần tử tại vị trí index trong mảng cats.
                cats.splice(index, 1);
            }

            // Cập nhật sản phẩm với danh mục mới
            await ProductModel.findByIdAndUpdate(item._id, {
                categories: cats,
            });
        });
    }
};

// Hàm để xóa danh mục
const deleteCategories = async (req: any, res: any) => {

    // Lấy ID và trạng thái xóa từ yêu cầu
    const { id, isDeleted } = req.body;

    try {
        // Tìm và xóa danh mục trong sản phẩm
        await findAndRemoveCategoryInProducts(id);

        // Nếu isDeleted là true, xóa danh mục
        if (isDeleted) {
            await CategoryModel.findByIdAndDelete(id);
        }

        // Ngược lại, cập nhật trạng thái isDeleted thành false
        else {
            await CategoryModel.findByIdAndUpdate(id, {
                isDeleted: false,
            });
        }

        await res.status(200).json({
            message: 'Category deleted',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
};

const updateCategory = async (req: any, res: any) => {

    // Lấy ID từ yêu cầu
    const { id } = req.body;

    // Lấy dữ liệu mới từ yêu cầu
    const body = req.body;

    try {

        // Cập nhật danh mục theo ID
        await CategoryModel.findByIdAndUpdate(id, body);

        // Tìm danh mục đã cập nhật để lấy dữ liệu mới
        const item = await CategoryModel.findById(id);

        res.status(200).json({
            message: 'Category update successfully',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
};


// Product
const addProduct = async (req: any, res: any) => {
    const body = req.body;

    try {
        const newProduct = new ProductModel(body);

        await newProduct.save();
        res.status(200).json({
            message: 'Products',
            data: newProduct,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const getProducts = async (req: any, res: any) => {

    // Lấy các tham số page, pageSize, và title từ yêu cầu (request body)
    const { page, pageSize, title } = req.body;

    // await checkDeletedProduct();

    //Filter có nghĩa là lọc dữ liệu dựa trên một hoặc nhiều điều kiện mà bạn chỉ định: find(),update(),..
    // Khởi tạo đối tượng filter để chứa điều kiện tìm kiếm sản phẩm
    // Khởi tạo đối tượng filter để lưu trữ điều kiện tìm kiếm, mặc định chỉ lấy các sản phẩm chưa bị xóa (isDeleted = false).
    const filter: any = {};
    filter.isDeleted = false;

    if (title) {

        // (slug): là một chuỗi ký tự thân thiện với URL
        // VD: [Title]: "Điện Thoại iPhone 13 Pro Max" => [Slug]: "dien-thoai-iphone-13-pro-max"
        // sử dụng biểu thức chính quy ($regex) để tìm kiếm các sản phẩm có slug khớp với từ khóa.
        filter.slug = { $regex: title };
    }

    try {

        // Tính toán số lượng sản phẩm cần bỏ qua (skip) dựa trên số trang và kích thước mỗi trang
        const skip = (page - 1) * pageSize;

        // Tìm danh sách các sản phẩm dựa trên điều kiện filter, bỏ qua một số sản phẩm và giới hạn số lượng mỗi trang
        const products = await ProductModel.find(filter).skip(skip).limit(pageSize);

        // Tìm tổng số sản phẩm chưa bị xóa để phục vụ cho việc phân trang
        const total = await ProductModel.find({
            isDeleted: false,
        });

        // Tạo một mảng rỗng để chứa các sản phẩm và sản phẩm con (subItems)
        // (subItems) đại diện cho các sản phẩm con của một sản phẩm chính (product), tức là những đối tượng phụ thuộc hoặc liên kết với sản phẩm đó.
        const items: any = [];

        // Nếu tìm thấy sản phẩm (products.length > 0)
        if (products.length > 0) {
            products.forEach(async (item: any) => {

                // Tìm các sản phẩm con (subItems) của mỗi sản phẩm dựa trên productId và điều kiện chưa bị xóa
                const children = await SubProductModel.find({
                    productId: item._id,
                    isDeleted: false,
                });

                // Thêm sản phẩm cùng với danh sách sản phẩm con vào mảng items
                items.push({

                    // Sao chép toàn bộ dữ liệu của sản phẩm
                    ...item._doc,

                    // Thêm sản phẩm cùng với danh sách sản phẩm con vào mảng items
                    subItems: children,
                });

                // Nếu đã xử lý hết các sản phẩm, trả về kết quả cho client
                item.length === products.length && res.status(200)({
                    message: 'Products',
                    data: { items, totalItems: total.length }
                })
            })
        } else {
            res.status(200).json({
                message: 'Products',
                data: [],
            })
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const getProductDetail = async (req: any, res: any) => {
    const { id } = req.query;
    try {
        const item = await ProductModel.findById(id);
        const subProducts = await SubProductModel.find({
            productId: id,
            isDeleted: false,
        });

        res.status(200).json({
            message: 'Products',
            data: {
                product: item,
                subProducts,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const removeSubProduct = async (req: any, res: any) => {
    const { id, isSoftDelete } = req.query;

    try {
        if (isSoftDelete) {
            await SubProductModel.findByIdAndUpdate(id, {
                isDeleted: true,
            });
        } else {
            await SubProductModel.findByIdAndDelete(id);
        }

        res.status(200).json({
            message: 'Remove sucess',
        });
    }
    catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const updateSubProduct = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        await SubProductModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'update success',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const addSubProduct = async (req: any, res: any) => {
    const body = req.body;

    try {
        const subProduct = new SubProductModel(body);

        await subProduct.save();

        res.status(200).json({
            message: 'add subProduct success',
            data: subProduct,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const handleRemoveSubProduct = async (items: any[]) => {
    items.forEach(async (item) => {

        // (findByIdAndUpdate) cho phép bạn cập nhật một trường trong bản ghi mà không xóa hoàn toàn nó khỏi cơ sở dữ liệu. Khi bạn gọi (findByIdAndUpdate) và cập nhật trường isDeleted thành true, bạn chỉ đơn giản là đánh dấu bản ghi là "đã xóa
        // Cập nhật trạng thái isDeleted của sản phẩm con thành true
        await SubProductModel.findByIdAndUpdate(item._id, {
            isDeleted: true,
        });
    });
};

const removeProduct = async (req: any, res: any) => {

    // Lấy id của sản phẩm từ query của request
    const { id } = req.query;

    try {

        // Tìm tất cả sản phẩm con (sub-items) liên quan đến sản phẩm chính theo productId
        const subItems = await SubProductModel.find({ productId: id });

        // Kiểm tra nếu có sản phẩm con tồn tại
        if (subItems.length > 0) {

            // Nếu có, gọi hàm handleRemoveSubProduct để xóa mềm các sản phẩm con
            await handleRemoveSubProduct(subItems);
        }

        // Cập nhật trạng thái isDeleted của sản phẩm chính thành true
        await ProductModel.findByIdAndUpdate(id, {
            isDeleted: true,
        });

        res.status(200).json({
            message: 'Remove Product success',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const updateProduct = async (req: any, res: any) => {
    const { id } = req.query;
    const body = req.body;

    try {
        await ProductModel.findByIdAndUpdate(id, body);

        res.status(200).json({
            message: 'update product success',

        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const getFilterValues = async (req: any, res: any) => {
    try {

        // Tìm tất cả sản phẩm con (sub-products) trong cơ sở dữ liệu
        const datas = await SubProductModel.find();

        // Khởi tạo các mảng để lưu trữ các giá trị lọc
        const colors: string[] = [];
        const sizes: SelectModel[] = [];
        const prices: number[] = [];

        // Kiểm tra xem có dữ liệu nào được tìm thấy hay không
        if (datas.length > 0) {

            // Duyệt qua từng sản phẩm con (sub-product)
            datas.forEach((item) => {

                // Nếu item.color tồn tại và chưa có trong mảng colors, thêm vào mảng
                item.color && !colors.includes(item.color) && colors.push(item.color);

                // Nếu item.size tồn tại, thêm vào mảng sizes với định dạng { label, value }
                item.size && !sizes.push({
                    label: item.size,
                    value: item.size,
                });

                // Thêm giá của sản phẩm vào mảng prices
                prices.push(item.price)
            });
        }

        res.status(200).json({
            message: 'fafa',
            data: {
                colors,
                sizes,
                prices,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const filterProducts = async (req: any, res: any) => {
    const body = req.body;

    const { colors, size, price, categories } = body;
    let filter: any = {};

    if (colors && colors.length > 0) {
        filter.colors = { $all: colors };
    }

    if (size) {
        filter.size = { $eq: size };
    }

    if (price && price.length > 0) {
        filter['$and'] = [
            {
                price: { $lte: price[1] },
            },

            {
                price: {
                    $gte: price[0],
                },
            },
        ];
    }

    try {
        const subProduct = await SubProductModel.find(filter);

        if (categories) {

        } else { }

        const productIds: string[] = [];
        const products: any = [];
        if (subProduct.length > 0) {
            subProduct.forEach((item) =>
                !productIds.includes(item.productId) && productIds.push(item.productId)
            );

            productIds.forEach(async (id) => {
                const product: any = await ProductModel.findById(id);

                const children = subProduct.filter(
                    (element) => element.productId === id
                );

                const items = { ...product._doc, subItems: children };

                products.push(items);

                if (products.length === productIds.length) {
                    res.status(200).json({
                        data: {
                            items: products,
                            totalItems: products.length,
                        },
                    });
                }
            });
        } else {
            res.status(200).json({ data: [] });
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export {
    updateCategory, deleteCategories, getCategories, addCategory, getCategoryDetail,

    getProducts, addProduct, updateProduct, removeProduct, getProductDetail,

    addSubProduct, removeSubProduct, updateSubProduct, getFilterValues, filterProducts,
}