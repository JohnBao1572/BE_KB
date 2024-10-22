import { error } from "console";
import UserModel from "../models/UserModel";
import bcrypt from 'bcrypt';
import { getAccesstoken } from "../utils/getAccesstoken";
import dotenv from 'dotenv';
import { generatorRandomText } from "../utils/generatorRandomText";

dotenv.config();

const register = async (req: any, res: any) => {

    // Lấy dữ liệu từ body của yêu cầu
    const body = req.body;

    // Phân tách email, name và password từ body
    const { email, name, password } = body;
    try {

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const user = await UserModel.findOne({ email });

        if (user) {

            // Ném lỗi nếu tài khoản đã tồn tại
            throw new Error(`Tài khoản đã tồn tại`);
        }

        // Tạo muối cho mã hóa mật khẩu
        //genSalt: Đây là một phương thức của thư viện bcrypt. Nó được sử dụng để tạo ra một "muối" (salt).
        // Độ dài từ 10 đến 12 là mức an toàn mà các doanh nghiệp hay dùng
        const salt = await bcrypt.genSalt(10);

        // Mã hóa mật khẩu
        //// Mã hóa mật khẩu với salt
        const hashpassword = await bcrypt.hash(password, salt);

        // Gán mật khẩu đã mã hóa vào thuộc tính password của đối tượng body
        // Cập nhật mật khẩu đã mã hóa vào body
        body.password = hashpassword;

        // Tạo mới một đối tượng người dùng từ mô hình
        // (any): được sử dụng để chỉ định rằng biến có thể chứa bất kỳ kiểu dữ liệu nào, tức là không có kiểm tra kiểu dữ liệu nào sẽ được thực hiện. Dưới đây là một số giải thích về việc sử dụng any trong dòng mã const newUser: any = new UserModel(body);, cùng với những điều gì sẽ xảy ra nếu bạn không sử dụng kiểu any
        // Tại sao: Khi bạn định nghĩa newUser là kiểu any, bạn có thể gán cho nó bất kỳ kiểu dữ liệu nào mà không gặp phải lỗi kiểu.
        const newUser: any = new UserModel(body);

        // Lưu người dùng mới vào cơ sở dữ liệu
        await newUser.save();

        // Xóa mật khẩu khỏi đối tượng để không lộ ra bên ngoài
        // (_doc): Là một thuộc tính đặc biệt của tài liệu (document) được trả về từ các truy vấn
        // Ví dụ, nếu bạn lấy một tài liệu người dùng từ cơ sở dữ liệu, tất cả các trường như name, email, và password sẽ nằm trong newUser._doc.
        // Tại sao phải dùng delete newUser._doc.password: (*) Như sau khi đăng ký hoặc đăng nhập), bạn thường không muốn gửi mật khẩu của người dùng cho client. Bằng cách xóa trường password từ _doc, bạn đảm bảo rằng thông tin nhạy cảm này không bị rò rỉ qua API.
        delete newUser._doc.password

        res.status(200).json({
            message: 'Register',
            data: {

                // Thêm dữ liệu người dùng vào phản hồi
                // (...): spread operator và rest parameter
                // + Spread operator cho phép bạn "spread" (mở rộng) các thuộc tính của một đối tượng hoặc các phần tử của một mảng.
                // ++ VD: 
                // const obj1 = { a: 1, b: 2 };
                // const obj2 = { ...obj1, c: 3 }; // obj2 sẽ có { a: 1, b: 2, c: 3 }
                ...newUser._doc,

                // Tạo token truy cập cho người dùng
                _id: newUser._id,
                token: await getAccesstoken({
                    _id: newUser._id,
                    email: newUser.email,
                    rule: 1,
                }),
            },
        });
    } catch (Error: any) {
        res.status(404).json({
            message: Error.message,

        });
    }
};

const loginwithGoogle = async (req: any, res: any) => {

    // Lấy dữ liệu từ body của yêu cầu
    const body = req.body;

    // Phân tách email và name từ body
    const { email, name } = body;
    try {

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const user: any = await UserModel.findOne({ email });

        if (user) {

            // Cập nhật thông tin người dùng nếu đã tồn tại
            await UserModel.findByIdAndUpdate(user._id, body);

            // Lấy thông tin người dùng mới
            const newUser: any = await UserModel.findById(user._id);

            // Xóa mật khẩu khỏi đối tượng để không lộ ra bên ngoài
            delete newUser._doc.password;

            res.status(200).json({
                message: 'Login google successfully',
                data: {

                    // Thêm dữ liệu người dùng vào phản hồi
                    ...newUser._doc,

                    // Tạo token truy cập cho người dùng
                    token: await getAccesstoken({
                        _id: newUser._id,
                        email: newUser.email,
                        rule: newUser.rule ?? 1,
                    }),
                },
            });
        } else {

            // Nếu người dùng không tồn tại, tạo mới tài khoản

            // Tạo muối cho mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);

            // Mã hóa mật khẩu ngẫu nhiên khi người dùng đăng nhập với GG
            const hashpassword = await bcrypt.hash(generatorRandomText(6), salt);

            // Cập nhật mật khẩu đã mã hóa vào body
            body.password = hashpassword;

            // Tạo mới một đối tượng người dùng từ mô hình
            const newUser: any = new UserModel(body);

            // Lưu người dùng mới vào cơ sở dữ liệu
            await newUser.save();

            // Xóa mật khẩu khỏi đối tượng để không lộ ra bên ngoài
            delete newUser._doc.password;

            res.status(200).json({
                message: 'Register',
                data: {

                    // Thêm dữ liệu người dùng vào phản hồi
                    ...newUser._doc,

                    // Tạo token truy cập cho người dùng
                    token: await getAccesstoken({
                        _id: newUser._id,
                        email: newUser.email,
                        rule: 1,
                    }),
                },
            });
        }
    }
    catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const login = async (req: any, res: any) => {

    // Lấy dữ liệu từ body của yêu cầu
    const body = req.body;

    // Phân tách email và password từ body
    const { email, password } = body
    try {

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const user: any = await UserModel.findOne({ email });

        if (!user) {

            // Ném lỗi nếu tài khoản không tồn tại
            throw new Error('Tài khoản không tồn tại');
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu trong cơ sở dữ liệu
        const isMathPassword = await bcrypt.compare(password, user.password);

        if (!isMathPassword) {

            // Ném lỗi nếu mật khẩu không khớp
            throw new Error('Đăng nhập thất bại, vui lòng kiểm tra lại Email hoặc mật khẩu');
        }

        // Xóa mật khẩu khỏi đối tượng để không lộ ra bên ngoài
        delete user._doc.password;

        res.status(200).json({
            message: 'Login thành công',
            data: {

                // Thêm dữ liệu người dùng vào phản hồi
                ...user._doc,

                // Tạo token truy cập cho người dùng
                token: await getAccesstoken({
                    _id: user._id,
                    email: user.email,
                    rule: user.rule ?? 1,
                }),
            },
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
};

const refreshToken = async (req: any, res: any) => {

    // Lấy id từ query parameters
    const { id } = req.query;

    try {

        // Tìm người dùng theo id
        const user = await UserModel.findById(id);
        if (!user) {

            // Ném lỗi nếu không tìm thấy người dùng
            throw new Error('User not found');
        }

        // Tạo token truy cập cho người dùng
        const token = await getAccesstoken({
            _id: user._id,
            email: user.email,
            rule: user.rule,
        });

        res.status(200).json({
            message: 'fafa',
            data: token,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export { register, login, loginwithGoogle, refreshToken };

