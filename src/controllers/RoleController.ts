import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import CustomError, { CustomErrorType } from "../lib/Error";
import { HTTP_CODES } from "../config/enum";
import RoleService from "../services/roleService";

const getRoles=async(req:Request,res:Response)=>{
        
    const roles=await RoleService.getAll();

    return res.json(ResponseClass.successResponse(roles));        
}

const getRoleById=async(req:Request,res:Response)=>{

    const roleId=req.params.id as string

    if(!roleId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message:"Validation Error" ,description:"Must be filled" });
    //i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language)
    //i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"])
    const role=await RoleService.getById(roleId)

    return res.json(ResponseClass.successResponse(role));
}

const createRole=async(req:Request,res:Response)=>{

    const role=req.body;

    if(!role.role_name) throw new CustomError({code:HTTP_CODES.NOT_FOUND,message:"Role Name is Required", description:"Add Role Name"});
     

    const result=await RoleService.create(role)

    return res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({success:true}, HTTP_CODES.CREATED));
}

const updateRole=async(req:Request,res:Response)=>{

    
}

const deleteRole=async(req:Request,res:Response)=>{

    
}

export default {getRoles,getRoleById,createRole,updateRole,deleteRole}