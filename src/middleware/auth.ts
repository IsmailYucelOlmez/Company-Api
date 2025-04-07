import { NextFunction, Request, Response } from "express";

const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
import User from "../models/User";
const UserRoles = require("../db/models/UserRoles");
const RolePrivileges = require("../db/models/RolePrivileges");
import ResponseClass from "../lib/Response";
import { HTTP_CODES } from "../config/enum";

const config = require("../config");

const privs = require("../config/role_privileges");
const CustomError = require("./Error");

module.exports = function () {
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload:any, done:any) => {
        try {

            let user = await User.findOne({ _id: payload.id });

            if (user) {

                let userRoles = await UserRoles.find({ user_id: payload.id });

                let rolePrivileges = await RolePrivileges.find({ role_id: { $in: userRoles.map(ur => ur.role_id) } });

                let privileges = rolePrivileges.map(rp => privs.privileges.find(x => x.key == rp.permission))

                done(null, {
                    id: user._id,
                    roles: privileges,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    language: user.language,
                    exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME
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
        checkRoles: (...expectedRoles:string[]) => {
            return (req:Request, res:Response, next: NextFunction) => {

                let i = 0;
                let privileges = req.user.roles.filter(x => x).map(x => x.key);

                while (i < expectedRoles.length && !privileges.includes(expectedRoles[i])) i++;

                if (i >= expectedRoles.length) {
                    let response = ResponseClass.errorResponse(new CustomError(HTTP_CODES.UNAUTHORIZED, "Need Permission", "Need Permission"), req.user.language);
                    return res.status(response.code).json(response);
                }

                return next(); 

            }
        }
    }
}