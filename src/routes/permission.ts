import express from "express";
import { Request, Response } from "express";
//import { PermissionController } from "../controllers/permission";

const router = express.Router();

router.get('/', (req:Request, res:Response) => {
  res.send('Get Permission!');
});

router.post('/', (req:Request, res:Response) => {
    res.send('Post Permission!');
});

router.put('/', (req:Request, res:Response) => {
    res.send('Put Permission!');
});

router.delete('/', (req:Request, res:Response) => {
    res.send('Delete Permission!');
});

module.exports=router;