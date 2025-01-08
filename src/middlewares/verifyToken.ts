// Nhập thư viện jsonwebtoken để làm việc với JSON Web Tokens.
import jwt from 'jsonwebtoken';

// Định nghĩa hàm verifyToken với tham số req, res và next
// Hàm middleware để xác thực token trước khi xử lí những yêu cầu típ theo của Client
export const verifyToken = (req: any, res: any, next: any) => {

	//Lấy thông tin token từ header Authorization của yêu cầu.
	const headers = req.headers.authorization;

	// Nếu header tồn tại, tách token từ header (được phân tách bằng dấu cách) và gán cho biến accesstoken
	// Nếu không cóheader, gán cho biến accesstoken là chuỗi rỗng
	// VD: Chuỗi là 'Bearer token123' sau khi phân tách =>  Thành mảng gồm 2 phần tử: ['Bearer', 'token123']
	// Sau khi chuỗi headers được tách thành mảng, [1] sẽ truy cập phần tử thứ hai của mảng, tức là giá trị token (trong ví dụ trên là 'token123')
	const accesstoken = headers ? headers.split(' ')[1] : '';

	try {
		// Kiểm tra nếu không có token thì ném lỗi
		if (!accesstoken) {
			throw new Error('Không có quyền');
		}

		// Xác thực token với SECRET_KEY từ biến môi trường
		const verfy: any = jwt.verify(
			accesstoken,
			process.env.SECRET_KEY as string
		);
		// console.log(verfy)

		// Kiểm tra nếu token không hợp lệ thì ném lỗi
		if (!verfy) {
			throw new Error('Invalid token');
		}

		// Gán id người dùng vào đối tượng req để có thể sử dụng ở các middleware hoặc route khác
		req.uid = verfy._id;

		// Gọi hàm next để chuyển đến middleware hoặc route tiếp theo
		next();
	} catch (error: any) {
		res.status(401).json({ error: error.message });
	}
};