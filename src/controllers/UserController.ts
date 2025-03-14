import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import { CustomErrorType } from "../lib/Error";
import userService from "../services/userService";

const getUsers=async(req:Request,res:Response)=>{

    try {

        const users=userService.getAllUsers();

        return res.json(ResponseClass.successResponse(users));
        
    } catch (err) {
        let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
        res.status(errorResponse.code).json(errorResponse);
    }
}

export default {getUsers}