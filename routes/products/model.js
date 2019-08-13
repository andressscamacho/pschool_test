const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const product = mongoose.Schema({
    name: String,
    price: Number
}, { versionKey: false });

module.exports = mongoose.model('product', product);
