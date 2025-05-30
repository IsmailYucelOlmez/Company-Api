import mongoose, { Schema } from 'mongoose';
import is from "is_js";
import { HTTP_CODES, PASS_LENGTH } from '../config/enum';
import {DEFAULT_LANG} from "../config/index";
import CustomError from "../lib/Error";
import bcrypt from "bcrypt";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gitHub?: string;
    linkedIn?: string;
    roleId?: mongoose.Schema.Types.ObjectId;
    language?: string;
    isActive?: boolean;
    refreshTokens?: string[];

    validPassword(password: string): boolean;
    validateFieldsBeforeAuth(email: string, password: string): typeof CustomError | null;
}

const UserSchema: Schema = new Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },
    gitHub: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    language: { type: String, default: DEFAULT_LANG },
    isActive: { type: Boolean, default: true },
    refreshTokens: { type: [String], default: [] },
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});



class Users extends mongoose.Model {

    validPassword(password:string):boolean {
        return bcrypt.compareSync(password, this.password);
    }

    static validateFieldsBeforeAuth(email:string, password:string): typeof CustomError | null {
        if (typeof password !== "string" || password.length < PASS_LENGTH || is.not.email(email))
            throw new CustomError({code:HTTP_CODES.UNAUTHORIZED, message: "Validation Error", description:"email or password wrong"});

        return null;
    }

}

UserSchema.loadClass(Users);


const User=mongoose.model<IUser>('User', UserSchema, 'users');

export default User

