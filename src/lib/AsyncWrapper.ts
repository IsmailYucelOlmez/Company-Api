/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Request, Response } from "express";
import ResponseClass from "./Response";
import { CustomErrorType } from "./Error";

export const asyncWrapper = (fn: Function) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            const errorResponse = ResponseClass.errorResponse(err as CustomErrorType, /*req.user.language*/);
            res.status(errorResponse.code).json(errorResponse);
        }
    };
};
