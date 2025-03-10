import mongoose from "mongoose";

const schema = new mongoose.Schema({
    receivers: { type: [String], required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    mailType: {type: String, required:true},
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
  }, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class SendedMails extends mongoose.Model {

}

schema.loadClass(SendedMails);
const SendedMail = mongoose.model('SendedMail', schema);
export default SendedMail;