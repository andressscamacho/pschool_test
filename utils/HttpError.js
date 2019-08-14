// Error usando en el controlador para transmitir errores
// y devolverlos en la respuesta HTTP en caso de ser
// necesario
class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

module.exports = HttpError;
