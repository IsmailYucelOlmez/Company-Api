import { Request, Response } from "express";
import UserController from "../controllers/UserController";
import { asyncWrapper } from "../lib/AsyncWrapper";
import ResponseClass from "../lib/Response";
import { HTTP_CODES, PASS_LENGTH, SUPER_ADMIN } from "../config/enum";
import User from "../models/User";
import CustomError, { CustomErrorType } from "../lib/Error";
import { DEFAULT_LANG, JWT } from "../config";
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require("jwt-simple");

const router = express.Router();

router.post("/register", async (req:Request, res:Response) => {
    let body = req.body;
    try {
  
      let user = await User.findOne({});
  
      if (user) {
        return res.sendStatus(HTTP_CODES.NOT_FOUND);
      }
  
      if (!body.email) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be filled"});
  
      if (is.not.email(body.email)) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be an email format"});
  
      if (!body.password) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password field must be filled"});
  
      if (body.password.length < PASS_LENGTH) {
        throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password length must be greater than " + PASS_LENGTH});
      }
  
      let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
  
      let createdUser = await User.create({
        email: body.email,
        password,
        is_active: true,
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number
      });
  
  
      res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({ success: true }, HTTP_CODES.CREATED));
  
    } catch (err:any) {
      let errorResponse = ResponseClass.errorResponse({code:err.code || 401,message:err.message, description:err.description },req.user.language);
      res.status(errorResponse.code).json(errorResponse);
    }
  })
  
  router.post("/auth", limiter, async (req:Request, res:Response) => {
    try {
  
      let { email, password } = req.body;
  
      User.validateFieldsBeforeAuth(email, password);
  
      let user = await User.findOne({ email });
  
      if (!user) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      if (!user.validPassword(password)) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      let payload = {
        id: user._id,
        exp: parseInt(Date.now() / 1000) + JWT.EXPIRE_TIME
      }
  
      let token = jwt.encode(payload, JWT.SECRET);
  
      let userData = {
        _id: user._id,
        first_name: user.firstName,
        last_name: user.lastName
      }
  
      res.json(ResponseClass.successResponse({ token, user: userData }));
  
    } catch (err:any) {
      let errorResponse = ResponseClass.errorResponse({code:err.code, message:err.message,description:err.description}, req.user.language);
      res.status(errorResponse.code).json(errorResponse);
    }
})

router.get('/', asyncWrapper(UserController.getUsers));

router.get('/:id', asyncWrapper(UserController.getUserById));

router.post('/', asyncWrapper(UserController.createUser));

router.put('/:id', asyncWrapper(UserController.updateUser));

router.delete('/:id', asyncWrapper(UserController.deleteUser));

module.exports=router;