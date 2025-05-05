import express from 'express';
const router = express.Router();

import fs from "fs";

const routes = fs.readdirSync(__dirname);

for (const route of routes) {
  if (route.includes(".ts") && route != "index.ts") {
    router.use("/"+route.replace(".ts", ""), require('./'+route));
  }
}

module.exports = router;