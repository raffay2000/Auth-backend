const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: String,
    dob: String,
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{11}$/,
    },
    address: String,
    city: String,

})
// mongoose.Model('users',{}    )
module.exports = mongoose.model("users",userSchema);