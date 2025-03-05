import { string } from "is";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: {type:string, required:true},
    text: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    published: {type:Boolean, default:true},
    publish_date: {type:Date,default:Date.now},
    imageUrls: {type:[String],default:[]}
  }, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Annoucements extends mongoose.Model {

}

schema.loadClass(Annoucements);
const Annoucement = mongoose.model('Annoucement', schema);
export default Annoucement;