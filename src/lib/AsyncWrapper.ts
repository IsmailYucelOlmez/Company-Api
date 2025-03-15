import { Request, Response } from "express";
import ResponseClass from "./Response";
import { CustomErrorType } from "./Error";

export const asyncWrapper = (fn: Function) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            let errorResponse = ResponseClass.errorResponse(err as CustomErrorType);
            res.status(errorResponse.code).json(errorResponse);
        }
    };
};
