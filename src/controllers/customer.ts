import { hash } from "crypto";
import CustomerModel from "../models/CustomModel";
import { generatorRandomText } from "../utils/generatorRandomText";
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken";

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

        const newCustomer:any = new CustomerModel(body);
        await newCustomer.save();

        const accesstoken  = await getAccesstoken({_id:newCustomer._id, email: newCustomer.email, rule: 1})

        delete newCustomer._doc.password;
        res.status(200).json({
            message: 'Created account successfully status 200',
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

export { create };