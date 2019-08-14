const HttpError = require('./HttpError');

/**
 * Envuelve cada método del controlador para que
 * pueda ser ejecutado correctamente cuando se
 * hacer una petición al servidor
 * @param method El método del controlador
 * @returns {Function} Una función que contiene la petición y respuesta HTTP y es pasado a Express
 */
const methodHandler = (method) => async (request, response) => {
    try {
        const data = await method(request);
        await response.json(data);
    } catch (e) {
        console.error(e);

        if (e instanceof HttpError) {
            await response.status(e.code).json({error: e.toString()});
        } else {
            await response.status(500).json({error: e.toString()});
        }
    }
};

/**
 * Crea un puente entre el servidor HTTP y la base de datos Mongo
 * @param controller Objeto que contiene las operaciones CRUD sobre determinado recurso
 */
module.exports = (controller) => {
    const newController = {};

    Object.keys(controller).forEach(key => {
        newController[key] = methodHandler(controller[key]);
    });

    return newController;
};
