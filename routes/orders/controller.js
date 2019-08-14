const datasources = require('./model');
const HttpError = require('../../utils/HttpError');
const createController = require('../../utils/createController');

const controller = {};

/**
 * Obtiene los pedidos
 * @param request Objeto que contiene información para filtrar pedidos
 *                el objeto puede contener:
 *                product_ids: array con ids de productos
 *                minDate: fecha mínima de creación
 *                maxDate: fecha máxima de creación
 * @returns Los pedidos
 */
controller.get = async (request) => {
    const requestQuery = request.query;
    const ordersQuery = {};
    const orderDetailsQuery = {};

    try {
        const productIds = JSON.parse(requestQuery.product_ids);

        if (Array.isArray(productIds) &&
            productIds.length > 0) {
            orderDetailsQuery.product_id = {
                $in: productIds
            };
        }
    } catch (e) {
        //Do nothing
    }

    if (Object.keys(orderDetailsQuery).length > 0) {
        const orderDetails = await datasources.orderDetails.find(orderDetailsQuery);
        const orderIds = orderDetails.map(orderDetail => orderDetail.order_id);

        ordersQuery._id = {
            $in: orderIds
        }
    }

    if (requestQuery.minDate) {
        ordersQuery.date = {
            $gte: Date(requestQuery.minDate)
        }
    }

    if (requestQuery.maxDate) {
        ordersQuery.date = {
            $lte: Date(requestQuery.maxDate)
        }
    }

    const orders = await datasources.orders.find(ordersQuery);
    const newOrders = [];

    for(let i = 0; i < orders.length; i++) {
        const currentOrder = orders[i];
        const orderDetails =
            await datasources.orderDetails.find({order_id: currentOrder._id});

        newOrders.push({
            _id: currentOrder._id,
            date: currentOrder.date,
            products:
                orderDetails.map(orderDetail => ({product_id: orderDetail.product_id, quantity: orderDetail.quantity}))
        });
    }

    return newOrders;
};

/**
 * Obtiene un pedido dado el identificador
 * @param request Objeto que contiene el identificado de pedido
 * @returns El pedido
 */
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

/**
 * Crea un nuevo pedido
 * @param request Objecto que contiene el cuerpo del pedido.
 *                Debe contener un objecto body que posee
 *                product_ids o los identificadores de los productos,
 *                junto con la cantidad determinada del producto, que
 *                por defecto es 1.
 * @returns El pedido creado
 */
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

/**
 * Actualiza un pedido
 * @param request Objeto que contiene los campos a actualizar.
 *                Debe contener los ids de los nuevos productos a agregar
 * @returns El objeto actualizado
 */
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

/**
 * Elimina el pedido dado un identificador
 * @param request Objeto que contiene el identificador
 * @returns El pedido eliminado
 */
controller.delete = async (request) => {
    const order = await controller.getOne(request);
    await datasources.orders.deleteOne({_id: request.params.id});
    await datasources.orderDetails.deleteMany({order_id: request.params.id});
    return order;
};

module.exports = createController(controller);
