import mongoose from "mongoose";

export interface ICategory {
    name: string;
    is_active?: boolean;
    created_by?: mongoose.Schema.Types.ObjectId;
}

const schema = new mongoose.Schema<ICategory>({
    name: {type: String, required: true},
    is_active: { type: Boolean, default: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId, requied:true }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Categories extends mongoose.Model {

}

schema.loadClass(Categories);
const Category = mongoose.model<ICategory>('Category', schema);
export default Category;
