const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = new Schema({
    'name': {
        type: String,
        required: true,
        unique: true
    },
    'title' : String,
    'content': String,
    'create_date': {
        type : Date,
        default : new Date()
    }
}, { collection: 'Text', versionKey: false });

textSchema.statics = {
    getText: function (_id) {
        return this.findOne({ _id: _id }).exec();
    },
    getTextByName: function (name) {
        return this.findOne({ name: name }).exec();
    }
}

module.exports = mongoose.model('Text', textSchema);
