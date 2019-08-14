const express = require('express');

/**
 * Crea las rutas dado un controlador
 * @param controller El controlador que define las acciones CRUD de los datos
 */
module.exports = (controller) =>
    express.Router()
        .get('/', controller.get)
        .get('/:id', controller.getOne)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .patch('/:id', controller.update)
        .delete('/:id', controller.delete);
