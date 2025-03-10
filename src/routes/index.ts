var express = require('express');
var router = express.Router();

const fs = require("fs");

let routes = fs.readdirSync(__dirname);

for (let route of routes) {
  if (route.includes(".ts") && route != "index.ts") {
    router.use("/"+route.replace(".ts", ""), require('./'+route));
  }
}

module.exports = router;