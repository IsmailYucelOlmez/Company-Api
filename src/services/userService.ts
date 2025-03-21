import { ObjectId } from "mongoose";
import User, { IUser } from "../models/User"
import GenericService from "./GenericService";


class UserService extends GenericService<IUser> {
    constructor() {
        super(User);
    }

    getAllWithoutPassword=async()=>{

        const users=await User.find({}, { password: 0 }).populate('roleId');

        return users;
    }
}

export default new UserService();

