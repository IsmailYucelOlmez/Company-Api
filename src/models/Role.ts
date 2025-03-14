import mongoose from "mongoose";

const schema = new mongoose.Schema({
    role_name: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
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


}

schema.loadClass(Roles);
const Role = mongoose.model('Role', schema);

export default Role;
