const mongoose = require('mongoose');
const isprivateip = require("../util/isprivateip");
const mongodb_data = require("../util/mongodb_data");
require('dotenv').config();

// mongoose.connect(mongodb_data.url, mongodb_data.options).catch(err => console.log(err));

let portdataSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    link: String,
    images: String,
    content: String,
    technology: String,
    api: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    language:  {
        type: String,
        enum : ['th','en'],
        default: 'th',
    },
    order_show: { type: Number, default: 0 },
    discard: { type: Boolean, default: 0 },
    dateTimeCreated: { type: Date, default: Date.now },
    dateTimeUpdated: { type: Date, default: Date.now },
});

let Portmongoose = mongoose.model("portdata", portdataSchema);
class Portquery {
    constructor() {

    }

    static getAllData(query, cb) {
        Portmongoose.find(
            {
                $or: [
                    { discard: false },
                    { discard: { $exists: false } },
                ], $and: [
                    query
                ]
            }).populate("category").sort({order_show: 1,category: 1,name: 1}).exec()
            .then((portdata) => {
                cb(portdata);
            }).catch((err) => {
                cb(err);
                console.log(err);
            });
    }
}


module.exports = Portmongoose;
module.exports.query = Portquery;