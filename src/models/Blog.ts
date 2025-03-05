import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    text: { type: String, required: true },
    category_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    published: { type: Boolean, default: true },
    publish_date: { type: Date, default: Date.now },
    imageUrl: { type: String },
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
  }, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Blogs extends mongoose.Model {

}

schema.loadClass(Blogs);
const Blog = mongoose.model('Blog', schema);
export default Blog;