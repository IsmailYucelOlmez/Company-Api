import cors from "cors"
import config from "./config"
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
var logger = require('morgan');



if (process.env.NODE_ENV != "production") dotenv.config()

mongoose.connect(config.CONNECTION_STRING as string).then(()=>{
  console.log("connected")
})

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors())

app.use(express.json());

app.use('/api', require('./routes/index'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
