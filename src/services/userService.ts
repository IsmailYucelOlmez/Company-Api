import { ObjectId } from "mongoose";
import User, { IUser } from "../models/User"
import GenericService from "./GenericService";


class UserService extends GenericService<IUser> {
    constructor() {
        super(User);
    }

    async getAll(): Promise<IUser[]> {
        const users = await User.find({}, { password: 0 }).populate('roleId');
        return users;
    }

    async getById(id: string): Promise<IUser | null> {
        const user = await User.findById(id, { password: 0 }).populate('roleId');
        return user;
    }

}

export default new UserService();

