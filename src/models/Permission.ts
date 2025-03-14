import mongoose from "mongoose";

const schema= new mongoose.Schema({

    name: { type: String, required: true, unique: true },
    isActive: {type: Boolean, default: true},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{
    versionKey:false,
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
})

class Permissions extends mongoose.Model{

}

schema.loadClass(Permissions);
const Permission = mongoose.model('Permission', schema);
export default Permission;