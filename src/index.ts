import cors from "cors"
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Database from "./config/db";
import { CONNECTION_STRING } from "./config";
dotenv.config()

const dbInstance = new Database(); 
dbInstance.connect(CONNECTION_STRING);

const app = express();
const port = process.env.PORT || 3000;

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
