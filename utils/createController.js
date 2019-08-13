const HttpError = require('./HttpError');

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

module.exports = (controller) => {
    const newController = {};

    Object.keys(controller).forEach(key => {
        newController[key] = methodHandler(controller[key]);
    });

    return newController;
};
