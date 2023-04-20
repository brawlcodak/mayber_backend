const jwt = require('jsonwebtoken');
config = require('../config');

const secret = config.jwt.secret;

function tokenAsign(data) {
    return jwt.sign(data, secret);
}

function verifyToken(token){
    return jwt.verify(token, secret);
}

const checkToken = {
    confirmToken: function(req){
        const decodify = decodifyHeader(req);
    }
}

function getToken(authorization) {
    if(!authorization) {
        throw new Error('Without Token');
    }

    if(authorization.indexOf('Bearer') === -1){
        throw new Error('Invalid format');
    }

    let token = authorization.replace('Bearer ', '');
    return token;
}

function decodifyHeader(req){
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decodify = verifyToken(token);

    req.user = decodify;
    return decodify;
}

module.exports = {
    tokenAsign,
    checkToken
}