const datasource = require('./model');
const HttpError = require('../../utils/HttpError');
const createController = require('../../utils/createController');

const controller = {};

/**
 * Obtiene los productos
 * @param request Contiene información de la petición.
 *                El único campo que consultado es query,
 *                contiene los valores de filtrado de productos.
 *                Los valores válidos para filtrar productos son:
 *                - name: filtrar por nombre
 *                - price: filtrar por precio
 *                - minPrice: filtrar por precio mínimo.
 *                - maxPrice: filtrar por precio máximo.
 *
 *                Se puede combinar los filtros de minPrice y maxPrice
 * @returns La lista de productos
 */
controller.get = async (request) => {
    const requestQuery = request.query;
    const query = {};

    if (requestQuery.name) {
        query.$text = {
            $search: requestQuery.name
        }
    }

    if (requestQuery.price) {
        query.price = Number(requestQuery.price);
    } else {
        if (requestQuery.minPrice) {
            query.price = {
                $gte: Number(requestQuery.minPrice)
            };
        }

        if (requestQuery.maxPrice) {
            query.price = {
                $lte: Number(requestQuery.maxPrice)
            }
        }
    }

    return datasource.find(query);
};

/**
 * Obtiene un producto dado el identificador
 * @param request Objetivo que contiene información del identificador
 * @returns El producto
 */
controller.getOne = async (request) => {
    const product = await datasource.findOne({_id: request.params.id});

    if (!product)
        throw new HttpError(400, 'No se encontró el producto.');

    return product;
};

/**
 * Crea un nuevo producto
 * @param request Contiene el cuerpo del nuevo producto a crear.
 *                Debe ser un objecto que contenga name (nombre) y price (precio)
 * @returns El nuevo producto creado
 */
controller.create = async (request) => {
    const newItem = new datasource(request.body);
    return newItem.save();
};

/**
 * Actualiza un producto dado un identificador
 * @param request Contiene el cuerpo de la información a actualizar en
 *                producto. Debe contener name (nombre) o price (precio)
 * @returns El producto actualizado
 */
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

/**
 * Elimina un producto
 * @param request El objecto que contiene el identificador del producto a eliminar
 * @returns El producto eliminado
 */
controller.delete = async (request) => {
    const product = await controller.getOne(request);
    await datasource.deleteOne({_id: request.params.id});
    return product;
};

module.exports = createController(controller);
