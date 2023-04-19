const express = require('express');
const response = require('../../red/responses');
const controller = require('./index');
const router = express.Router();
const bcrypt = require('bcrypt');
const security = require('./security');

router.post('/login', login);
router.get('/all', security(), getAll);
router.get('/:id', uno);
router.post('/register', add);
router.post('/report_error', security(), report_error);
router.post('/token', consult_token);

async function login (req, res, next) {
    try{
    if(req.body.username){
        if(req.body.password){
            const data = await controller.login(req.body.username, req.body.password);
            if(data){
                response.sucess(req, res, "Success", data, 200);
            }else{
                response.error(req, res, 'Invalid credentials', {}, 404);
            }
        }else{response.error(req, res, 'password field is required', {},500)}
    }else{response.error(req, res, 'username field is required', {}, 500)}
    }catch(err){
        next(err);
    }
}

async function report_error(req, res, next) {
    try{
        var today = new Date();
        const dataSend = {
            user_id: req.body.user_id,
            title: req.body.title,
            description: req.body.description,
            date: today
        }
        const data = await controller.report_error(dataSend);
        if(data){
            response.sucess(req, res, "Success", {}, 200);
        }else{
            response.error(req, res, "Error", data, 404);
        }
    }catch(err){
        next(err)
    }
}

async function consult_token (req, res, next) {
    try{
    const items = await controller.consult_token(req.body.token);
    if(items){
        response.sucess(req, res, "Token is online", {}, 200);
    }else{
        response.error(req, res, "Token dont exits", {}, 200);
    }
   
    }catch(err){
        next(err);
    }
}

async function uno (req, res, next) {
    try{
    const items = await controller.uno(req.params.id);
    response.sucess(req, res, "Sucess", items, 200);
    }catch(err){
        next(err);
    }
}

async function add (req, res, next) {
    var today = new Date();
    const dataSend = {
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password.toString(), 5),
        date: today
    }
    try{
    const items = await controller.add(dataSend);
    if(items){
        response.sucess(req, res, "User register success", items ,201);

    }else if (items == false){
        response.error(req, res, "User all ready exits", {} , 404);
    }
    }catch(err){
        next(err);
    }
}

async function getAll(req, res, next) {
    try{
        const users = await controller.todos();
        response.sucess(req, res, 'All user success', users, 200);
    }catch(err) {
        next(err)
    }
}

async function del (req, res, next) {
    try{
    const items = await controller.del(req.body);
    response.sucess(req, res, 'Client deleted done!', 200);
    }catch(err){
        next(err);
    }
}

module.exports = router;