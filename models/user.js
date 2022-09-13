const mongoose = require('mongoose');
const isprivateip = require("../util/isprivateip");
const mongodb_data = require("../util/mongodb_data");

// mongoose.connect(mongodb_data.url,mongodb_data.options).catch(err=>console.log(err));

let userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    discard: { type: Boolean, default: 0 },
    dateTimeCreated: { type: Date, default: Date.now },
    dateTimeUpdated: { type: Date, default: Date.now },
});

let User = mongoose.model("user", userSchema);

module.exports = User;