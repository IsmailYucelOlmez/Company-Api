import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import CustomError from "../lib/Error";
import userService from "../services/userService";
import {DEFAULT_LANG} from '../config'
import { HTTP_CODES, PASS_LENGTH, } from './../config/enum';
import bcrypt from 'bcrypt';
import I18n from "../lib/i18n";
const i18n = new I18n(DEFAULT_LANG);

const getUsers=async(req:Request,res:Response)=>{

    const users=await userService.getAll();

    return res.json(ResponseClass.successResponse(users));  
}

const getUserById=async(req:Request,res:Response)=>{

    const userId=req.body.id

    if(!userId) throw new CustomError({ code:HTTP_CODES.BAD_REQUEST, message:i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language , ["_id"])});
        
    const user=await userService.getById(userId)

    return res.json(ResponseClass.successResponse(user)); 
}

const createUser=async(req:Request,res:Response)=>{

    const body=req.body;

    if (!body.email) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["email"])});

    if (is.not.email(body.email)) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("USERS.EMAIL_FORMAT_ERROR", req.user?.language)});

    if (!body.password) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["password"])});

    if (body.password.length < PASS_LENGTH) {
      throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("USERS.PASSWORD_LENGTH_ERROR", req.user?.language, [PASS_LENGTH.toString()])});
    }

    if (!body.role || body.role == '') {
      throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language), description:i18n.translate("COMMON.FIELD_MUST_BE_TYPE", req.user?.language, ["roles", "Array"])});
    }

    const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
    body.password = hashedPassword;
    const result=await userService.create(body)

    res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({success:true, result:result}, HTTP_CODES.CREATED));
}

const updateUser=async(req:Request,res:Response)=>{
    const updates: Partial<typeof req.body> = {};
    const body = req.body;

    if (!body._id) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["_id"])});

    if (body.password && body.password.length > PASS_LENGTH) {
      updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
    }

    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if (body.first_name) updates.first_name = body.first_name;
    if (body.last_name) updates.last_name = body.last_name;
    if (body.phone_number) updates.phone_number = body.phone_number;

    if (body._id == req.user?.id) {
       throw new CustomError({code:HTTP_CODES.FORBIDDEN,message: i18n.translate("COMMON.NEED_PERMISSIONS", req.user?.language),description: i18n.translate("COMMON.NEED_PERMISSIONS", req.user?.language)})
    }

    await userService.update(body._id ,updates)

    return res.json(ResponseClass.successResponse({ success: true }));
    
}

const deleteUser=async(req:Request,res:Response)=>{

    const body = req.body;

    if (!body._id) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["_id"])});

    await userService.delete(body._id);

    res.json(ResponseClass.successResponse({ success: true }));
    
}

export default {getUsers,getUserById,createUser,updateUser,deleteUser}