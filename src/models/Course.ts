import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    image_url: { type: String },
    state: { type: String, default: "notStart" },
    explanation: { type: String, required: true },
    syllabus : { type: String, required: true },
    price: { type: Number, required: true },
    quota: { type: Number, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    categoryId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    instructor: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Courses extends mongoose.Model {

}

schema.loadClass(Courses);
const Course = mongoose.model('Course', schema);
export default Course;