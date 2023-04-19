const bcrypt = require('bcrypt');
const db = require('../../DB/mysql');
const auth = require('../../auth');
const TABLE = 'pay_reports';

module.exports = function(dbinjected){
    const today = new Date();
    let db = dbinjected;
    if(!db){
        db=require('../../DB/mysql');
    }

    async function add_pay_report(body) {
        const data = {
            user_id: body.user_id,
            email: body.email,
            price: body.price,
            user_number: body.user_number,
            username_nequi: body.username_nequi,
            date: today,
            license_name: body.license_name,
            accepted: false
        }
        const send_data = await db.add(TABLE, data);
        if(send_data){
            return true;
        }else{
            return false;
        }
    }

    async function add_pay_report_adm(body) {
        console.log(body);
        const data_send = {
            id: body.id,
            user_id: body.user_id,
            email: body.email,
            price: body.price,
            user_number: body.user_number,
            username_nequi: body.username_nequi,
            date: today,
            license_name: body.license_name,
            accepted: body.accepted
        }
        const response = await db.add(TABLE, data_send);
        if(response){
            return true;
        }else{
            return false;
        }
    }
    
    async function get_all_pays_reports() {
        const response = await db.todos(TABLE);
        if(response){
            return response;
        }else{
            return false;
        }
    }

    async function get_pays_reports_byuser(user_id) {
        const response = await db.queryAll(TABLE, {user_id: user_id});
        if(response){
            return response;
        }else{
            return false;
        }
    }

    async function send_black_list(body) {
        const response = await db.add('black_ips', body);
        if(response){
            return true;
        }else{
            return false;
        }
    }

    return {
        add_pay_report,
        get_all_pays_reports,
        get_pays_reports_byuser,
        send_black_list,
        add_pay_report_adm
    }
}