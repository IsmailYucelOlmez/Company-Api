import { Request, Response } from "express";
import UserController from "../controllers/UserController";
import { asyncWrapper } from "../lib/AsyncWrapper";

const express = require('express');

const router = express.Router();

router.get('/', asyncWrapper(UserController.getUsers));

router.get('/:id', asyncWrapper(UserController.getUserById));

router.post('/', asyncWrapper(UserController.createUser));

router.put('/:id', asyncWrapper(UserController.updateUser));

router.delete('/:id', asyncWrapper(UserController.deleteUser));

module.exports=router;