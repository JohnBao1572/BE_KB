import { hash } from "crypto";
import CustomerModel from "../models/CustomModel";
import { generatorRandomText } from "../utils/generatorRandomText";
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken";
import { handleSendMail } from "../utils/handleSendmail";


const getVerifyCode = async (req: any, res: any) => {
    const { id } = req.query;
    const { code } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Missing id in query parameters' });
    }

    console.log(id, code)
    try {

        // Không cần phải viết email:body.email do đã định nghĩa = tên biến {email} rồi
        const customer: any = await CustomerModel.findById(id);

        if (!customer) {
            throw new Error('User is not found');
        }

        const verifyCode = customer._doc.verifyCode;
        console.log(verifyCode);

        if (code != verifyCode) {
            throw new Error('Invalid code');
        }

        await CustomerModel.findByIdAndUpdate(id, {
            isVerify: true,

            // Sau khi update mã xác nhận người dùng thì (verify) = rỗng
            verifyCode: '',
            isDeleted: false,
        })

        const accesstoken = getAccesstoken({ _id: customer._id, email: customer._doc.email, rule: 1 });

        delete customer._doc.password
        delete customer._doc.verifyCode

        res.status(200).json({
            message: 'VerifyCode successfully',
            data: {
                ...customer._doc,
                accesstoken,
            },
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const resendCode = async (req: any, res: any) => {
    const { id, email } = req.query;

    try {
        const code = generatorRandomText(6).trim();

        await handleSendMail({
            from: 'Support user', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<h1>Mã xác minh ${code}</h1>`, // html body
        });
        console.log(code);

        await CustomerModel.findByIdAndUpdate(id, { verifyCode: code });

        res.status(200).json({
            message: 'Resend new code successfully',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        });
    }
}

const create = async (req: any, res: any) => {
    const body = req.body;

    try {
        const customer = await CustomerModel.findOne({ email: body.email });
        if (customer) {
            throw new Error("Email had already");
        }

        // Tạo dãy 6 số bất kỳ
        const code = generatorRandomText(6).trim();
        console.log(code);

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(body.password, salt);

        body.password = hashpassword;

        const newCustomer: any = new CustomerModel({ ...body, verifyCode: code });
        await newCustomer.save();

        // const accesstoken = getAccesstoken({ _id: newCustomer._id, email: newCustomer._doc.email, rule: 1 });

        delete newCustomer._doc.password;
        // delete newCustomer._doc.verifyCode;
        newCustomer._doc.verifyCode = newCustomer._doc.verifyCode.trim(); // Loại bỏ khoảng trắng


        // Gửi mã số đã tạo tới người dùng 
        const result = await handleSendMail({
            from: 'Support user', // sender address
            to: body.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<h1>Mã xác minh ${code}</h1>`, // html body
        });

        res.status(200).json({
            message: 'Created account successfully!!',
            data: newCustomer,
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

const login = async (req: any, res: any) => {
    const body = req.body;

    const {email, password} = body;
    try {
        const customer:any = await CustomerModel.findOne({email});
        if(!customer){
            throw new Error('Email not found');
        }

        const isMatchPassword = await bcrypt.compare(password, customer.password);
        if(!isMatchPassword){
            throw new Error('Password is incorrect');
        }

        const item = {...customer._doc};
        delete item.password;
        // delete item.verifyCode;

        const accesstoken = await getAccesstoken({_id: customer._id, email});
        console.log("Generated accesstoken:", accesstoken);
        item.accesstoken = accesstoken;

        console.log(item);

        res.status(200).json({
            message: 'Login Successfully',
            data: item,
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export { create, getVerifyCode, resendCode, login };