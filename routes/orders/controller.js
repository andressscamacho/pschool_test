const datasources = require('./model');
const HttpError = require('../../utils/HttpError');
const createController = require('../../utils/createController');

const controller = {};

controller.get = async (request) => {
    const orders = await datasources.orders.find({});
    const newOrders = [];

    for(let i = 0; i < orders.length; i++) {
        const currentOrder = orders[i];
        const orderDetails = await datasources.orderDetails.find({order_id: currentOrder._id});

        newOrders.push({
            _id: currentOrder._id,
            date: currentOrder.date,
            products:
                orderDetails.map(orderDetail => ({product_id: orderDetail.product_id, quantity: orderDetail.quantity}))
        });
    }

    return newOrders;
};

controller.getOne = async (request) => {
    const order = await datasources.orders.findOne({_id: request.params.id});

    if (!order)
        throw new HttpError(400, 'No se encontró el pedido.');

    const orderDetails = await datasources.orderDetails.find({order_id: order._id});

    return {
        _id: order._id,
        date: order.date,
        products:
            orderDetails.map(orderDetail => ({product_id: orderDetail.product_id, quantity: orderDetail.quantity}))
    };
};

controller.create = async (request) => {
    const newOrder = new datasources.orders({date: Date.now()});
    const savedOrder = await newOrder.save();

    const products = request.body.products;
    const savedOrderDetails = [];

    for(let i = 0; i < products.length; i++) {
        const product = products[i];
        const newOrderDetail =
            new datasources.orderDetails({order_id: savedOrder._id, product_id: product.product_id, quantity: product.quantity || 1});
        const savedOrderDetail = await newOrderDetail.save();

        savedOrderDetails.push({product_id: savedOrderDetail.product_id, quantity: savedOrderDetail.quantity});
    }

    return {
        _id: savedOrder._id,
        date: savedOrder.date,
        products: savedOrderDetails
    }
};

controller.update = async (request) => {
    const order = await datasources.orders.findOne({_id: request.params.id});

    if (!order)
        throw new HttpError(400, 'No se encontró el pedido.');

    const newFields = request.body;
    const savedOrderDetails = [];

    if (newFields.products) {
        await datasources.orderDetails.deleteMany({order_id: request.params.id});

        for(let i = 0; i < newFields.products.length; i++) {
            const product = newFields.products[i];
            const newOrderDetail =
                new datasources.orderDetails({order_id: order._id, product_id: product.product_id, quantity: product.quantity || 1});
            const savedOrderDetail = await newOrderDetail.save();

            savedOrderDetails.push({product_id: savedOrderDetail.product_id, quantity: savedOrderDetail.quantity});
        }
    }

    return {
        _id: order._id,
        date: order.date,
        products: savedOrderDetails
    }
};

controller.delete = async (request) => {
    const order = await controller.getOne(request);
    await datasources.orders.deleteOne({_id: request.params.id});
    await datasources.orderDetails.deleteMany({order_id: request.params.id});
    return order;
};

module.exports = createController(controller);
