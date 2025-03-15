import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import CustomError, { CustomErrorType } from "../lib/Error";
import userService from "../services/userService";
import { HTTP_CODES } from "../config/enum";
import roleService from "../services/roleService";

const getRoles=(req:Request,res:Response)=>{
        
    const roles=roleService.getAll();

    return res.json(ResponseClass.successResponse(roles));        
}

const getUserById=(req:Request,res:Response)=>{

    try {

        const userId=req.body.id

        //if(!userId) throw new CustomError(HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));
        
        const user=userService.getUserById(userId)

        return res.json(ResponseClass.successResponse(user));
        
    } catch (err) {
        let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
        res.status(errorResponse.code).json(errorResponse);
    }
    
}

const createUser=(req:Request,res:Response)=>{

    try {

        const user=req.body;

        const result=userService.postUser(user,user.id)

        res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({success:true}, HTTP_CODES.CREATED));
        
    } catch (err) {
        let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
        res.status(errorResponse.code).json(errorResponse);
    }
}

const updateUser=(req:Request,res:Response)=>{

    try {
        
    } catch (err) {
        let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
        res.status(errorResponse.code).json(errorResponse);
    }
}

const deleteUser=(req:Request,res:Response)=>{

    try {
        
    } catch (err) {
        let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
        res.status(errorResponse.code).json(errorResponse);
    }
}

export default {getRoles}