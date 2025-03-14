

export type CustomErrorType = {
    code: number,
    message: string,
    description: string
}

class CustomError extends Error {
    code:number;
    message:string;
    description:string;


    constructor({code, message, description}: CustomErrorType) {
        super(`{"code": "${code}", "message": "${message}", "description":"${description}"}`);
        this.code = code;
        this.message = message;
        this.description = description;
    }
}

export default CustomError;