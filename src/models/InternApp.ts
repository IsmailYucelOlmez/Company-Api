import mongoose from "mongoose";

const schema = new mongoose.Schema({
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
const InternApp = mongoose.model('InternApp', schema);
export default InternApp;