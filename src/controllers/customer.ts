import { hash } from "crypto";
import CustomerModel from "../models/CustomModel";
import { generatorRandomText } from "../utils/generatorRandomText";
import bcrypt from 'bcrypt'

const create = async (req:any, res:any)=>{
    const body = req.body;

    try {
        const customer = await CustomerModel.findOne({email: body.email});

        if(customer){
            throw new Error("Email had already");
        }

        const salt = await bcrypt.genSalt(10);

        const hashpassword = await bcrypt.hash( generatorRandomText(6), salt);

        body.password = hashpassword; 

        res.status(200).json({
            message: 'dada',
            data: [],
        })
    } catch (error:any) {
        console.log(error);
        res.status(404).json({
            message:error
        })
    }
}

export {create};