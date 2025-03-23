import { Request, Response } from "express";
import ResponseClass from '../lib/Response'
import categoryService from "../services/categoryService";
import CustomError from "../lib/Error";
import { HTTP_CODES } from "../config/enum";
import { DEFAULT_LANG } from "../config";
const i18n = new (require("../lib/i18n"))(DEFAULT_LANG);


const getCategories=async(req:Request,res:Response)=>{

    let categories = await categoryService.getAll();

    return res.json(ResponseClass.successResponse(categories));
}

const getCategoryById=async(req:Request,res:Response)=>{

    const categoryId=req.body.id;

    //if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});

    const category=await categoryService.getById(categoryId);

    return res.json(ResponseClass.successResponse(category))

}

const createCategory=async(req:Request,res:Response)=>{

    const body=req.body;


    //if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["name"])});

    const result=await categoryService.create(body);

    return res.json(ResponseClass.successResponse({ success: true }));
}

const updateCategory=async(req:Request,res:Response)=>{
    let updates:typeof req.body
    updates={}
    const body=req.body;

    const categoryId=req.body.id;

    //if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});

    //if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["name"])});

    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    //if(req.user) updates.createdby=req.user.id

    const result =await categoryService.update(categoryId,updates)

    res.json(ResponseClass.successResponse({success:true}))
}

const deleteCategory=async(req:Request,res:Response)=>{

    const categoryId=req.body.id;

    //if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});


    const result=await categoryService.delete(categoryId);

    return res.json(ResponseClass.successResponse({success:true}))

}

export default {getCategories,getCategoryById,createCategory,updateCategory,deleteCategory}