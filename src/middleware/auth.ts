/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from "../models/User";
import ResponseClass from "../lib/Response";
import { HTTP_CODES } from "../config/enum";
import {DEFAULT_LANG, JWT} from "../config";
import CustomError from "../lib/Error";
import Role from "../models/Role";


module.exports = function () {
    const strategy = new Strategy({
        secretOrKey: JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload:any, done:any) => {
        try {

            const user = await User.findOne({ _id: payload.id });

            if (user) {
                             
                done(null, {
                    id: user._id,
                    role: user.roleId,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    language: user.language,
                    exp: parseInt((Date.now() / 1000).toString()) + JWT.EXPIRE_TIME
                });

            } else {
                done(new Error("User not found"), null);
            }

        } catch (err) {
            done(err, null);
        }

    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false })
        },
        checkRoles: (expectedPermission:string) => {
            return async (req:Request, res:Response, next: NextFunction) => {
                
                if(!expectedPermission) {
                    const response = ResponseClass.errorResponse(new CustomError({ code: HTTP_CODES.UNAUTHORIZED, message: "Role not found", description: "Role not found" }), req.user?.language || DEFAULT_LANG);
                    return res.status(response.code).json(response);
                }
                
                const role = await Role.findOne({ _id: req.user?.role }).populate("permissions"); 
                const permissionNames = role?.permissions.map((permission:any) => permission.name);

                if (!permissionNames ) {
                    const response = ResponseClass.errorResponse(new CustomError({ code: HTTP_CODES.UNAUTHORIZED, message: "Role not found", description: "Role not found" }), req.user?.language || DEFAULT_LANG);
                    return res.status(response.code).json(response);
                }             

                if (permissionNames && permissionNames.includes(expectedPermission)) {
                    const response = ResponseClass.errorResponse(new CustomError({ code: HTTP_CODES.UNAUTHORIZED, message: "Role not found", description: "Role not found" }), req.user?.language || DEFAULT_LANG);
                    return res.status(response.code).json(response);
                }
           
                return next(); 

            }
        }
    }
}