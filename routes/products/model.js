const mongoose = require('mongoose');

/*
    Modelo del producto
 */
const product = mongoose.Schema({
    //Nombre del producto
    name: String,
    //Precio del producto
    price: Number
}, { versionKey: false });

//Indexado de nombre para búsquedas de texto
product.index({name: 'text'});

module.exports = mongoose.model('product', product);
