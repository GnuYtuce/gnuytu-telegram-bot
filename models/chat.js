const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    'id': {
        type: Number,
        required: true,
        unique: true
    },
    'type': {
        type: String,
        required: true
    },
    'title': String,
    'first_name': String,
    'last_name': String
}, { collection: 'Chat', versionKey: false });

chatSchema.statics = {
    getChat: function (id) {
        return this.findOne({ id: id }).exec();
    },
    removeChat: function (id) {
        return this.remove({ id: id }).exec();
    }
}
chatSchema.methods = {
    saveChat: function () {
        return this.save();
    }
}
module.exports = mongoose.model('Chat', chatSchema);
