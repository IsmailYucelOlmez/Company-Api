/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prefer-const */
import { Request, Response } from "express";
import ResponseClass from '../lib/Response'
import internappService from "../services/internAppService";
import { HTTP_CODES } from "../config/enum";
import { DEFAULT_LANG } from "../config";
const i18n = new (require("../lib/i18n"))(DEFAULT_LANG);


const getInternApps=async(req:Request,res:Response)=>{

    let internapps = await internappService.getAll();

    return res.json(ResponseClass.successResponse(internapps));
}

const getInternAppById=async(req:Request,res:Response)=>{

    const internappId=req.body.id;

    //if(!internappId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});

    const internapp=await internappService.getById(internappId);

    return res.json(ResponseClass.successResponse(internapp))

}

const createInternApp=async(req:Request,res:Response)=>{

    const body=req.body;


    //if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["name"])});

    const result=await internappService.create(body);

    return res.json(ResponseClass.successResponse({result:result, success: true }));
}

const updateInternApp=async(req:Request,res:Response)=>{
    let updates:typeof req.body
    updates={}
    const body=req.body;

    const internappId=req.body.id;

    //if(!internappId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});

    //if (!body.name) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["name"])});

    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    //if(req.user) updates.createdby=req.user.id

    const result =await internappService.update(internappId,updates)

    res.json(ResponseClass.successResponse({result:result, success:true}))
}

const deleteInternApp=async(req:Request,res:Response)=>{

    const internappId=req.body.id;

    //if(!internappId) throw new CustomError({code:HTTP_CODES.BAD_REQUEST,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),description: i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["id"])});


    const result=await internappService.delete(internappId);

    return res.json(ResponseClass.successResponse({result:result, success:true}))

}

const getCountByUniversity = async (req: Request, res: Response) => {
    const results = await internappService.countByUniversity();
    return res.json(ResponseClass.successResponse(results));
};

const getCountByDuration = async (req: Request, res: Response) => {
    const results = await internappService.countByDuration();
    return res.json(ResponseClass.successResponse(results));
};

const getCountByCategory = async (req: Request, res: Response) => {
    const results = await internappService.countByCategory();
    return res.json(ResponseClass.successResponse(results));
};

const getCountByMonth = async (req: Request, res: Response) => {
    const results = await internappService.countByMonth();
    return res.json(ResponseClass.successResponse(results));
};

export default { getInternApps, getInternAppById, createInternApp, updateInternApp, deleteInternApp, getCountByUniversity, getCountByDuration, getCountByCategory, getCountByMonth};
