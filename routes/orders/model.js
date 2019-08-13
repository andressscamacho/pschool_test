const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const order = mongoose.Schema({
    date: Date,
}, { versionKey: false });

const orderDetail = mongoose.Schema({
    order_id: {type: ObjectId, required: true},
    quantity: Number,
    product_id: {type: ObjectId, required: true}
}, { versionKey: false });

module.exports = {
    orders: mongoose.model('order', order),
    orderDetails: mongoose.model('order_detail', orderDetail)
};
