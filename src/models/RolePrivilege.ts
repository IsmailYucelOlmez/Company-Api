import mongoose from "mongoose";

const schema = new mongoose.Schema({
    role_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    permission: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class RolePrivileges extends mongoose.Model {

}

schema.loadClass(RolePrivileges);
const RolePrivilege= mongoose.model('RolePrivilege', schema);

export default RolePrivilege;