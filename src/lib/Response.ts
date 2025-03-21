import { CustomErrorType } from "./Error";

const Enum = require("../config/enum");
const config = require("../config");
const CustomError = require("./Error");
//const i18n = new (require("./i18n"))(config.DEFAULT_LANG);

class Response {
    constructor() { }

    static successResponse(data:unknown, code = 200) {
        return {
            code,
            data
        }
    }

    static errorResponse(error:CustomErrorType/*, lang*/) {
        console.error(error);
        if (CustomError.includes(error) != -1) {
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }
        } else if (error.message.includes("E11000")) {
            return {
                code: Enum.HTTP_CODES.CONFLICT,
                error: {
                    //message: i18n.translate("COMMON.ALREADY_EXIST", lang),
                    message:"already exist",
                    //description: i18n.translate("COMMON.ALREADY_EXIST", lang)
                }
            }
        }

        return {
            code: Enum.HTTP_CODES.INT_SERVER_ERROR,
            error: {
                //message: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
                message: error.message,
                description: error.message
            }
        }
    }

}

export default Response;