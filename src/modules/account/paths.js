const express = require('express');
const response = require('../../red/responses');
const controller = require('./index');
const router = express.Router();
const bcrypt = require('bcrypt');
const security = require('./security');

router.post('/pay_report/response', security(), pay_report_adm);
router.post('/pay_report', security(), pay_report);
router.get('/pay_report', security(), get_pay_reports);
router.get('/pay_report/:user_id', security(), get_pay_reports_byUser);
router.post('/black_list', black_list);

async function pay_report(req, res, next) {
    try{
        const response_data = await controller.add_pay_report(req.body);
        if(response_data){
            response.sucess(req, res, "Pay report added success!", {}, 200);
        }else{
            response.error(req, res, "Pay report dont added", {}, 202);
        }
    }catch (err) {
        next(err)
    }
}

async function pay_report_adm(req, res, next) {
    try{
        const response_data = await controller.add_pay_report_adm(req.body);
        if(response_data){
            response.sucess(req, res, "Pay report updated success!", {}, 200);
        }else{
            response.error(req, res, "Pay report dont updated", {}, 202);
        }
    }catch (err) {
        next(err)
    }
}

async function get_pay_reports(req, res, next) {
    try{
        const response_data = await controller.get_all_pays_reports();
        if(response_data){
            response.sucess(req, res, "success", response_data, 200);
        }else{
            response.error(req, res, "Pays report empty", {}, 202);
        }
    }catch (err) {
        next(err)
    }
}

async function get_pay_reports_byUser(req, res, next) {
    try{
        const response_data = await controller.get_pays_reports_byuser(req.params.user_id);
        if(response_data){
            response.sucess(req, res, "success", response_data, 200);
        }else{
            response.error(req, res, "Pays report empty", {}, 202);
        }
    }catch (err) {
        next(err)
    }
}

async function black_list(req, res, next) {
    try{
        const response_data = await controller.send_black_list(req.body);
        if(response_data){
            response.sucess(req, res, "success", {}, 200);
        }else{
            response.error(req, res, "Error added to Black ips", {}, 202);
        }
    }catch (err) {
        next(err)
    }
}


module.exports = router;