import { Request, Response } from "express";
import RoleController from "../controllers/RoleController";
import { asyncWrapper } from "../lib/AsyncWrapper";

const express = require('express');

const router = express.Router();

router.get('/', asyncWrapper(RoleController.getRoles));

router.get('/:id', asyncWrapper(RoleController.getRoleById));

router.post('/', asyncWrapper(RoleController.createRole));

router.put('/:id', asyncWrapper(RoleController.updateRole));

router.delete('/:id', asyncWrapper(RoleController.deleteRole));

module.exports=router;