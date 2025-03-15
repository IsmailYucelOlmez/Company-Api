import { Request, Response } from "express";
import RoleController from "../controllers/RoleController";
import { asyncWrapper } from "../lib/AsyncWrapper";

const express = require('express');

const router = express.Router();

router.get('/', asyncWrapper(RoleController.getRoles));

router.post('/', (req:Request, res:Response) => {
    res.send('Post User Education!');
});

router.put('/', (req:Request, res:Response) => {
    res.send('Put User Education!');
});

router.delete('/', (req:Request, res:Response) => {
    res.send('Delete User Education!');
});

module.exports=router;