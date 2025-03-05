import { create } from "domain";
import mongoose from "mongoose";
import RolePrivileges from "./RolePrivilege";

const schema = new mongoose.Schema({
    role_name: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

type queryType = {
    _id: mongoose.Types.ObjectId,
}


class Roles extends mongoose.Model {

    static async remove(query:queryType) {

        if (query._id) {
            await RolePrivileges.deleteOne({role_id: query._id});
        }

        await super.deleteOne(query);
    }

}

schema.loadClass(Roles);
const Role = mongoose.model('Role', schema);

export default Role;
