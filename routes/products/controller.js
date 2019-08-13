const datasource = require('./model');
const HttpError = require('../../utils/HttpError');
const createController = require('../../utils/createController');

const controller = {};

controller.get = async (request) => {
    return datasource.find({});
};

controller.getOne = async (request) => {
    const product = await datasource.findOne({_id: request.params.id});

    if (!product)
        throw new HttpError(400, 'No se encontró el producto.');

    return product;
};

controller.create = async (request) => {
    const newItem = new datasource(request.body);
    return newItem.save();
};

controller.update = async (request) => {
    const product = await controller.getOne(request);
    const newFields = request.body;

    if (newFields.name) {
        product.name = newFields.name;
    }

    if (newFields.price) {
        product.price = newFields.price;
    }

    return product.save();
};

controller.delete = async (request) => {
    const product = await controller.getOne(request);
    await datasource.deleteOne({_id: request.params.id});
    return product;
};

module.exports = createController(controller);
