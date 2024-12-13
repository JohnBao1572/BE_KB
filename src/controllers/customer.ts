import { hash } from "crypto";
import CustomerModel from "../models/CustomModel";
import { generatorRandomText } from "../utils/generatorRandomText";
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken";
import { handleSendMail } from "../utils/handleSendmail";


const getVerifyCode = async (req: any, res: any) => {
    const body = req.body;

    const { email } = req.body;
    console.log(email);

    try {
        // Không cần phải viết email:body.email do đã định nghĩa = tên biến {email} rồi
        const verify = await CustomerModel.findOne({ email });

        if (verify) {
            throw new Error('Email had already');
        }

        // Tạo dãy 6 số bất kỳ
        const code = generatorRandomText(6);
        console.log(code);

        // Gửi mã số đã tạo tới người dùng 
        const result = await handleSendMail({
            from: '"Maddison Foo Koch 👻" <jonnguyen1572@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<h1>Mã xác minh ${code}</h1>`, // html body
        });

        console.log(result);
        console.log(code);
        res.status(200).json({
            message: 'VerifyCode sended',
            data: [],
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
}

const create = async (req: any, res: any) => {
    const body = req.body;

    try {
        const customer = await CustomerModel.findOne({ email: body.email });

        if (customer) {
            throw new Error("Email had already");
        }

        const salt = await bcrypt.genSalt(10);

        const hashpassword = await bcrypt.hash(generatorRandomText(6), salt);

        body.password = hashpassword;

        const newCustomer: any = new CustomerModel(body);
        await newCustomer.save();

        const accesstoken = await getAccesstoken({ _id: newCustomer._id, email: newCustomer.email, rule: 1 })

        delete newCustomer._doc.password;
        res.status(200).json({
            message: 'Created account successfully!!',
            data: {
                ...newCustomer._doc,
                accesstoken,

            },
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

export { create, getVerifyCode };