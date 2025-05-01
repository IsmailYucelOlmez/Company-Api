import mongoose from "mongoose";

export interface IRole extends Document {
    role_name: string;
    isActive: boolean;
    permissions: mongoose.Types.ObjectId[];
    created_by: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<IRole>({
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


class Roles extends mongoose.Model {


}

schema.loadClass(Roles);
const Role = mongoose.model<IRole>('Role', schema,'roles');

export default Role;
