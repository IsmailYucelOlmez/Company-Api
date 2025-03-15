import { ObjectId } from "mongoose";
import User from "../models/User"


const getAllUsers=async()=>{

    const users=await User.find({}, { password: 0 }).populate('roleId');

    return users;
}

const getUserById=async(userId:ObjectId)=>{

    const user=await User.findById({id:userId})

    return user;
}


const postUser=async(user:typeof User,id:ObjectId)=>{

    const existingUser=await User.findOne({_id:id});

    if(existingUser) { 
         
        return existingUser;
    }

    const newUser=new User(user);
    await newUser.save();

    return newUser
}

const updateUser=()=>{

}

const deleteUser=()=>{

}

export default { getAllUsers,getUserById, postUser, updateUser, deleteUser}