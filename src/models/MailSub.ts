import mongoose from "mongoose";

const schema = new mongoose.Schema({
    mail: { type: String, required: true },
    isSub:{type:Boolean,default:true}
  }, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class MailSubs extends mongoose.Model {

}

schema.loadClass(MailSubs);
const MailSub = mongoose.model('MailSub', schema);
export default MailSub;