/* eslint-disable @typescript-eslint/no-unused-vars */
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
import bcrypt from 'bcrypt';
import userService from "../services/userService";
import express from 'express';
import jwt from "jsonwebtoken";

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

      if (!body.email) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be filled"});
  
      if (is.not.email(body.email)) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"email field must be an email format"});
  
      if (!body.password) throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password field must be filled"});
  
      const user = await User.findOne({email: body.email });
  
      if (user) {
        return res.sendStatus(HTTP_CODES.CONFLICT);
      }
  
      if (body.password.length < PASS_LENGTH) {
        throw new CustomError({code:HTTP_CODES.BAD_REQUEST, message:"Validation Error!", description:"password length must be greater than " + PASS_LENGTH});
      }
  
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
  
      const createdUser = await userService.create({
        email: body.email,
        password:hashedPassword,
        isActive: true,
        firstName: body.first_name,
        lastName: body.last_name,
        phoneNumber: body.phone_number,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        roleId: body.roleId,
      });
  
  
      res.status(HTTP_CODES.CREATED).json(ResponseClass.successResponse({ success: true, result:createdUser }, HTTP_CODES.CREATED));
  
    } catch (err:any) {
      const errorResponse = ResponseClass.errorResponse({code:err.code || 401,message:err.message, description:err.description }, req.user?.language || DEFAULT_LANG);
      res.status(errorResponse.code).json(errorResponse);
    }
  })
  
  router.post("/auth", limiter, async (req:Request, res:Response) => {
    try {

      const cookies = req.cookies;
  
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      user.validateFieldsBeforeAuth(email, password);
  
      if (!user.validPassword(password)) throw new CustomError({code:HTTP_CODES.UNAUTHORIZED,message: i18n.translate("COMMON.VALIDATION_ERROR_TITLE", DEFAULT_LANG),description: i18n.translate("USERS.AUTH_ERROR", DEFAULT_LANG)});
  
      const payload = {
        id: user._id,
        exp: parseInt((Date.now() / 1000).toString()) + JWT.EXPIRE_TIME,
      }

      const accessToken = jwt.sign( payload, JWT.SECRET, { expiresIn: JWT.EXPIRE_TIME } );

      const newRefreshToken = jwt.sign( { "username": user.firstName }, JWT.REFRESH_TOKEN_SECRET, { expiresIn: JWT.REFRESH_EXPIRE_TIME } );
  
      let newRefreshTokenArray = !cookies?.jwt ? user.refreshTokens : user.refreshTokens?.filter(rt => rt !== cookies.jwt);

      if (cookies?.jwt) {
        
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
                           
          newRefreshTokenArray = [];
        }
        res.clearCookie('jwt', { httpOnly: true, secure: true });
      }
  
      user.refreshTokens = [...newRefreshTokenArray || [], newRefreshToken];
      const result = await user.save();
      console.log(result);

      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, maxAge: JWT.REFRESH_EXPIRE_TIME * 1000 });

      const userData = {
        _id: user._id,
        first_name: user.firstName,
        last_name: user.lastName,
      }
  
      res.json(ResponseClass.successResponse({ accessToken, user: userData }));
  
    } catch (err:any) {
      const errorResponse = ResponseClass.errorResponse({code:err.code, message:err.message,description:err.description}, req.user?.language || DEFAULT_LANG);
      res.status(errorResponse.code).json(errorResponse);
    }
  })

  router.get("/logout", async (req:Request, res:Response) => {
    
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(HTTP_CODES.UNAUTHORIZED);

    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken }).exec();

    if (!user) {
      
      res.clearCookie('jwt', { httpOnly: true, secure: true });
      
      return res.sendStatus(HTTP_CODES.UNAUTHORIZED);
    }

    user.refreshTokens = (user.refreshTokens ?? []).filter(rt => rt !== refreshToken);
    const result = await user.save();

    res.clearCookie('jwt', { httpOnly: true, secure: true });
    
    res.sendStatus(HTTP_CODES.NO_CONTENT);
  })

  router.get("/refresh", async (req:Request, res:Response) => {
      
      const cookies = req.cookies;
  
      if (!cookies?.jwt) return res.sendStatus(HTTP_CODES.UNAUTHORIZED);
  
      const refreshToken = cookies.jwt;

      res.clearCookie('jwt', { httpOnly: true, secure: true });
  
      const user = await User.findOne({ refreshToken }).exec();
  
      if (!user) {
        
        jwt.verify( refreshToken, JWT.REFRESH_TOKEN_SECRET,
          async (err:any, decoded:any) => {
              
              if (err) return res.sendStatus(HTTP_CODES.FORBIDDEN); //Forbidden
              
              const hackedUser = await User.findOne({ username: decoded.username }).exec();

              if (hackedUser) {
                hackedUser.refreshTokens = [];
                const result = await hackedUser.save();
                console.log(result);
              }        
          }       
        )   

        return res.sendStatus(HTTP_CODES.FORBIDDEN);       
      }

      const newRefreshTokenArray = (user.refreshTokens ?? []).filter(rt => rt !== refreshToken);
  
      jwt.verify(refreshToken, JWT.REFRESH_TOKEN_SECRET, 
        async (err:any, decoded:any) => {
          if (err || user._id !== decoded.id) return res.sendStatus(HTTP_CODES.FORBIDDEN);
  
          const payload = {
            id: user._id,
            exp: parseInt((Date.now() / 1000).toString()) + JWT.EXPIRE_TIME,
          }
  
          const accessToken = jwt.sign( payload, JWT.SECRET, { expiresIn: JWT.EXPIRE_TIME } );

          const newRefreshToken = jwt.sign({ "username": user.firstName }, JWT.REFRESH_TOKEN_SECRET, { expiresIn: JWT.REFRESH_EXPIRE_TIME });
        // Saving refreshToken with current user
          user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
          const result = await user.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, maxAge: JWT.REFRESH_EXPIRE_TIME * 1000 });

        res.json(ResponseClass.successResponse({ accessToken ,user:payload}, HTTP_CODES.OK));
      })
  })



router.get('/', asyncWrapper(UserController.getUsers));

router.get('/:id', asyncWrapper(UserController.getUserById));

router.post('/', asyncWrapper(UserController.createUser));

router.put('/:id', asyncWrapper(UserController.updateUser));

router.delete('/:id', asyncWrapper(UserController.deleteUser));

module.exports=router;