import mongoose from "mongoose";

const schema = new mongoose.Schema({
    courseId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    state: { type: String, required: true, default: 'pending' }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class CourseApps extends mongoose.Model {

}

schema.loadClass(CourseApps);
const CourseApp = mongoose.model('CourseApp', schema);
export default CourseApp;