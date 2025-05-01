/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Request, Response } from "express";
import UserController from "../controllers/UserController";
import { asyncWrapper } from "../lib/AsyncWrapper";
import ResponseClass from "../lib/Response";
import { HTTP_CODES, PASS_LENGTH } from "../config/enum";
import User from "../models/User";
import CustomError from "../lib/Error";
import { CONNECTION_STRING, DEFAULT_LANG, JWT } from "../config";
import rateLimit from "express-rate-limit";
import I18n from "../lib/i18n";
const RateLimitMongo = require("rate-limit-mongo");
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require("jwt-simple");

const i18n = new I18n(DEFAULT_LANG);

const limiter = rateLimit({
  store: new RateLimitMongo({
    uri: CONNECTION_STRING,
    collectionName: "rateLimits",
    expireTimeMs: 15 * 60 * 1000 // 15 minutes
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  // standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const router = express.Router();

router.post("/register", async (req:Request, res:Response) => {
    const body = req.body;
    try {
  
      const user = await User.findOne({});
  
      if (user) {
        return res.sendStatus(HTTP_CODES.NOT_FOUND);
      }
  
      if (!body.email) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be filled"});
  
      if (is.not.email(body.email)) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be an email format"});
  
      if (!body.password) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password field must be filled"});
  
      if (body.password.length < PASS_LENGTH) {
        throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password length must be greater than " + PASS_LENGTH});
      }
  
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
  
      const createdUser = await User.create({
        email: body.email,
        password:hashedPassword,
        is_active: true,
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        roleId: body.roleId,
      });
  
  
      res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({ success: true, result:createdUser }, HTTP_CODES.CREATED));
  
    } catch (err:any) {
      const errorResponse = ResponseClass.errorResponse({code:err.code || 401,message:err.message, description:err.description },(req.user as any).language || DEFAULT_LANG);
      res.status(errorResponse.code).json(errorResponse);
    }
  })
  
  router.post("/auth", limiter, async (req:Request, res:Response) => {
    try {
  
      const { email, password } = req.body;
  
      (User as any).validateFieldsBeforeAuth(email, password);
  
      const user = await User.findOne({ email });
  
      if (!user) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      if (!user.validPassword(password)) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      const payload = {
        id: user._id,
        exp: parseInt((Date.now() / 1000).toString()) + JWT.EXPIRE_TIME,
      }
  
      const token = jwt.encode(payload, JWT.SECRET);
  
      const userData = {
        _id: user._id,
        first_name: user.firstName,
        last_name: user.lastName,
      }
  
      res.json(ResponseClass.successResponse({ token, user: userData }));
  
    } catch (err:any) {
      const errorResponse = ResponseClass.errorResponse({code:err.code, message:err.message,description:err.description}, (req.user as any).language || DEFAULT_LANG);
      res.status(errorResponse.code).json(errorResponse);
    }
})

router.get('/', asyncWrapper(UserController.getUsers));

router.get('/:id', asyncWrapper(UserController.getUserById));

router.post('/', asyncWrapper(UserController.createUser));

router.put('/:id', asyncWrapper(UserController.updateUser));

router.delete('/:id', asyncWrapper(UserController.deleteUser));

module.exports=router;