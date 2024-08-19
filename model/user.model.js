const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName: { type: String},
    lastName: {type: String},
    email: {
        type: String,
        unique: true
    },
    stack: {type: String}
},{
    timestamps: true
});

userModel = mongoose.model("user_mgt", user);
module.exports = userModel;