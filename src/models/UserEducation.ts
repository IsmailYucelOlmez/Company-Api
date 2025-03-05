import mongoose, { Schema } from "mongoose";

const UserEducationSchema: Schema = new Schema({
    university: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    },
    cvUrl: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

const UserEducation = mongoose.model('UserEducation', UserEducationSchema);

export default UserEducation;