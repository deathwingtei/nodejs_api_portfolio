const mongoose = require('mongoose');
const isprivateip = require("../util/isprivateip");
const mongodb_data = require("../util/mongodb_data");
require('dotenv').config();

// mongoose.connect(mongodb_data.url, mongodb_data.options).catch(err => console.log(err));


let catogorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    order_show: { type: Number, default: 0 },
    discard: { type: Boolean, default: 0 },
    dateTimeCreated: { type: Date, default: Date.now },
    dateTimeUpdated: { type: Date, default: Date.now },
});

let Categorymongoose = mongoose.model("category", catogorySchema);

class Categoryquery {
    constructor() {

    }
    static getAllData(query, cb) {
        Categorymongoose.find(
            {
                $or: [
                    { discard: false },
                    { discard: { $exists: false } },
                ],
                $and: [
                    query
                ]
            }).sort({order_show: 1}).exec()
            .then((catdata) => {
                cb(catdata);
            }).catch((err) => {
                cb(err);
                console.log(err);
            });
    }

    
}


module.exports = Categorymongoose;
module.exports.query = Categoryquery;