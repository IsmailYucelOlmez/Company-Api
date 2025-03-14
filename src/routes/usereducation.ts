import { Request, Response } from "express";

const express = require('express');

const router = express.Router();

router.get('/', (req:Request, res:Response) => {
  res.send('Hello World User Education!');
});

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