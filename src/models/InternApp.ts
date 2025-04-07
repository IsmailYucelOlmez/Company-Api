import mongoose from "mongoose";

export interface IInternApp {
    duration: string;
    location: string;
    startDate: Date;
    userId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    status?: string;
}

const schema = new mongoose.Schema<IInternApp>({
    duration: {type: String, required: true},
    location: {type: String, required: true},
    startDate: {type: Date, required: true},
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    categoryId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    status: { type: String, default: 'pending' }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class InternApps extends mongoose.Model {

}

schema.loadClass(InternApps);
const InternApp = mongoose.model<IInternApp>('InternApp', schema);
export default InternApp;