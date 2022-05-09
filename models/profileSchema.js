const mongoose = require('mongoose');
// if we use mongoose
const profileSchema = new mongoose.Schema({
    userID: {
        type: String,
        require: true,
        unique: true
    },
    ServerID: {
        type: String,
        require: true,
    },
    ProxyReq: {
        type: Number,
        default: 3
    }

})

const model = mongoose.model('Profile', profileSchema);

module.exports = model;