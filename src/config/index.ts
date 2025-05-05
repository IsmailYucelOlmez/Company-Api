import dotenv from 'dotenv';
dotenv.config();

export const PORT= process.env.PORT || "3000"
export const LOG_LEVEL= process.env.LOG_LEVEL || "debug"
export const CONNECTION_STRING= process.env.CONNECTION_STRING || ""
export const JWT= {
        SECRET: process.env.JWT_SECRET || "",
        EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME || '')) ? parseInt(process.env.TOKEN_EXPIRE_TIME || '') : 24 * 60 * 60 ,  // 86400
        REFRESH_TOKEN_SECRET: process.env.REFRESH_JWT_SECRET || "",
        REFRESH_EXPIRE_TIME: !isNaN(parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME || '')) ? parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME || '') : 24 * 60 * 60 * 7 , 
    }
export const FILE_UPLOAD_PATH= process.env.FILE_UPLOAD_PATH
export const DEFAULT_LANG= process.env.DEFAULT_LANG || "EN"
