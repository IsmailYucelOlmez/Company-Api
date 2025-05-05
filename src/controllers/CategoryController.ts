/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prefer-const */
import { Request, Response } from "express";
import ResponseClass from '../lib/Response'
import categoryService from "../services/categoryService";
import CustomError from "../lib/Error";
import { HTTP_CODES } from "../config/enum";
import { DEFAULT_LANG } from "../config";
const i18n = new (require("../lib/i18n"))(DEFAULT_LANG);
const logger = require('./logger');


const getCategories=async(req:Request,res:Response)=>{

    const categories = await categoryService.getAll();

    if(!categories || categories.length === 0) throw new CustomError({code:HTTP_CODES.NOT_FOUND,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["categories"])});
        
    logger.info(`Categories fetched: ${categories.length}`);

    return res.json(ResponseClass.successResponse(categories));
}

const getCategoryById=async(req:Request,res:Response)=>{

    const categoryId=req.body.id;

    if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["id"])});

    const category=await categoryService.getById(categoryId);

    if(!category) throw new CustomError({code:HTTP_CODES.NOT_FOUND,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["category"])});

    logger.info(`Category Updated: ${categoryId}`);

    return res.json(ResponseClass.successResponse(category))

}

const createCategory=async(req:Request,res:Response)=>{

    const body=req.body;


    if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["name"])});

    const result=await categoryService.create(body);

    logger.info(`Category Created: ${result}`);

    return res.json(ResponseClass.successResponse({ result:result, success: true }));
}

const updateCategory=async(req:Request,res:Response)=>{
    let updates:typeof req.body
    updates={}
    const body=req.body;

    const categoryId=req.body.id;

    if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["id"])});

    if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["name"])});

    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    
    if(req.user) updates.createdby=req.user.id

    const result =await categoryService.update(categoryId,updates)

    logger.info(`Category Updated: ${categoryId}`);

    res.json(ResponseClass.successResponse({result:result, success:true}))
}

const deleteCategory=async(req:Request,res:Response)=>{

    const categoryId=req.body.id;

    if(!categoryId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["id"])});


    const result=await categoryService.delete(categoryId);

    logger.info(`Category Deleted: ${categoryId}`);

    return res.json(ResponseClass.successResponse({result:result, success:true}))

}

export default {getCategories,getCategoryById,createCategory,updateCategory,deleteCategory}