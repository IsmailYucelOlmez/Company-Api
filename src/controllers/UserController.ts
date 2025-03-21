import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import CustomError, { CustomErrorType } from "../lib/Error";
import userService from "../services/userService";
import { HTTP_CODES } from "../config/enum";

const getUsers=async(req:Request,res:Response)=>{

    const users=await userService.getAll();

    return res.json(ResponseClass.successResponse(users));  
}

const getUserById=async(req:Request,res:Response)=>{

    const userId=req.body.id

    //if(!userId) throw new CustomError(HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));
        
    const user=await userService.getById(userId)

    return res.json(ResponseClass.successResponse(user)); 
}

const createUser=async(req:Request,res:Response)=>{

    const user=req.body;

    const result=await userService.create(user)

    console.log(result)

    res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({success:true}, HTTP_CODES.CREATED));
}

const updateUser=async(req:Request,res:Response)=>{

    
}

const deleteUser=async(req:Request,res:Response)=>{

    
}

export default {getUsers,getUserById,createUser,updateUser,deleteUser}