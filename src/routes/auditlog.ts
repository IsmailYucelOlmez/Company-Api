import { Request, Response } from "express";

const express = require('express');

const router = express.Router();

router.get('/', (req:Request, res:Response) => {
  res.send('Hello World User Education!');
});

router.post('/', (req:Request, res:Response) => {
    res.send('Post User Education!');
});

module.exports=router;

