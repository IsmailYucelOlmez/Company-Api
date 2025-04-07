/* eslint-disable prefer-const */
import { Request,Response } from "express";
import ResponseClass from '../lib/Response'
import { HTTP_CODES } from "../config/enum";
import RoleService from "../services/roleService";
import roleService from "../services/roleService";

const getRoles=async(req:Request,res:Response)=>{
        
    const roles=await RoleService.getAll();

    return res.json(ResponseClass.successResponse(roles));        
}

const getRoleById=async(req:Request,res:Response)=>{

    const roleId=req.params.id as string

    //if(!roleId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message:i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language) ,description:i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]) });
    
    const role=await RoleService.getById(roleId)

    return res.json(ResponseClass.successResponse(role));
}

const createRole=async(req:Request,res:Response)=>{

    const role=req.body;

    //if(!role.role_name) throw new CustomError({code:HTTP_CODES.NOT_FOUND,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), description:i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["role_name"])});
     
    //if (!role.permissions || !Array.isArray(role.permissions) || role.permissions.length == 0) {
    //    throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message:i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_TYPE", req.user.language, ["permissions", "Array"])});
    //}
    
    const result=await RoleService.create(role)

    return res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({data:result, success:true}, HTTP_CODES.CREATED));
}

const updateRole=async(req:Request,res:Response)=>{
    let updates:typeof body
    const body=req.body;

    //if (!body._id) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description:i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"])});

    updates = {};

    if (body.role_name) updates.role_name = body.role_name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) updates.permissions=body.permissions

    const result=await RoleService.update(body._id,updates)

    return res.json(ResponseClass.successResponse({ data:result, success: true }));
}

const deleteRole=async(req:Request,res:Response)=>{

    const body=req.body

    //if (!body._id) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description:i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"])});

    await roleService.delete(body._id );

    return res.json(ResponseClass.successResponse({ success: true }));
    
}

export default {getRoles,getRoleById,createRole,updateRole,deleteRole}