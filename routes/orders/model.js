const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
    Modelo para pedido
 */
const order = mongoose.Schema({
    //Fecha de realización del pedido
    date: Date,
}, { versionKey: false });

/*
    Modelo para detalle de pedido
 */
const orderDetail = mongoose.Schema({
    //Identificador del pedido
    order_id: {type: ObjectId, required: true},
    //Cantidad del producto
    quantity: {type: Number, default: 1},
    //Identificador del producto
    product_id: {type: ObjectId, required: true}
}, { versionKey: false });

module.exports = {
    orders: mongoose.model('order', order),
    orderDetails: mongoose.model('order_detail', orderDetail)
};
