import { Request, Response } from "express";
import UserController from "../controllers/UserController";

const express = require('express');

const router = express.Router();

router.get('/', UserController.getUsers);

router.post('/', (req:Request, res:Response) => {
    res.send('Post User!');
});

router.put('/', (req:Request, res:Response) => {
    res.send('Put User!');
});

router.delete('/', (req:Request, res:Response) => {
    res.send('Delete User!');
});

module.exports=router;