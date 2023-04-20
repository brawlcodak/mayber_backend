const express = require('express');
const response = require('../../red/responses');
const controller = require('./index');
const router = express.Router();
const bcrypt = require('bcrypt');
const security = require('./security');

router.get('/licenses_type', security(), get_licenses_types);
router.get('/licenses_by_user/:user_id', security(), get_licenses_by_users);
router.post('/add_license', security(), add_license);
router.post('/add_license_free', security(), add_license_free);
router.put('/update_license', security(), update_license);
router.get('/blacks/:ip', get_blacks);

async function get_blacks (req, res, next) {
    try{
        const item = await controller.get_blacks(req.params.ip);
        if(item){
            response.sucess(req, res, "Ip Observed", true, 200);
        }else{
            response.sucess(req, res, "Ip no registered", false, 202);
        }
    }catch(err){
        next(err)
    }
}   

async function get_licenses_types(req, res, next) {
    try{
        const items = await controller.get_all_licenses_types();
        if(items){
            response.sucess(req, res, "Get all licenses types success", items, 200);
        }else{
            response.error(req, res, "Get all licenses types error", {}, 303);
        }
    }catch (error){
        next(error)
    }
}

async function get_licenses_by_users(req, res, next) {
    try{
        const items = await controller.get_license_by_user(req.params.user_id);
        if(items){
            response.sucess(req, res, "Get all licenses by user_id success", items, 200);
        }else{
            response.error(req, res, "Get all licenses by user_id error", {}, 303);
        }
    }catch (error){
        next(error)
    }
}

async function add_license(req, res, next) {
    try{
        const send = controller.add_license(req.body);
        if(send){
            response.sucess(req, res, "License added success", {}, 200);
        }else{
            response.error(req, res, "License add error", {}, 303);
        }
    }catch(err) {
        next(error);
    }
}

async function add_license_free(req, res, next) {
    try{
        const send = await controller.add_license_free(req.body);
        if(send){
            response.sucess(req, res, "License added success", {}, 200);
        }else{
            response.error(req, res, "License add error", {}, 303);
        }
    }catch(err) {
        next(error);
    }
}

async function update_license (req, res, next) {
    try{
        if(req.body.license_type_id == 1){
            response.error(req, res, "Current user allready got free account", {}, 303);
        }else{
            const send = controller.update_license(req.body);
            if(send){
                response.sucess(req, res, "License update success", {}, 200);
            }else{
                response.error(req, res, "License update error", {}, 303);
            }
        }
    }catch(err) {
        next(error);
    }
}

module.exports = router;