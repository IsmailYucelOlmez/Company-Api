import User from "../models/User"


const getAllUsers=async()=>{

    const user=await User.find({}, { password: 0 }).populate('roleId');

    return user;
}

export default { getAllUsers}