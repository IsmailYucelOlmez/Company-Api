import { CONNECTION_STRING } from "../config";

/* eslint-disable @typescript-eslint/no-require-imports */
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'silly', // Tüm seviyeleri kaydeder
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.MongoDB({
      level: 'silly', // Bu da önemli: Transport seviyesini de 'silly' yapıyoruz
      db: CONNECTION_STRING,
      options: { useUnifiedTopology: true },
      collection: 'AuditLog',
      tryReconnect: true
    }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
