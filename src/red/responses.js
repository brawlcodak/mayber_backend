exports.sucess = function(req, res, message = '', data, status = 200) {
    res.status(status).send({
        data: data,
        message: message,
        error: false,
        code: status
    });
}

exports.error = function(req, res, message = 'Internal error', data, status = 500) {;
    res.status(status).send({
        data: data,
        message: message,
        error: true,
        code: status
    });
}