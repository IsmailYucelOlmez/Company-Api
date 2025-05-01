/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';

declare global {
    namespace Express {
      interface User extends UserPayload {
        id: string;
        role: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        language?: string;
        // varsa diğer alanlar
      }
  
      interface Request {
        user?: UserPayload;
      }
    }
  }