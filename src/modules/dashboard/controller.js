const bcrypt = require('bcrypt');
const db = require('../../DB/mysql');
const auth = require('../../auth');
const TABLE_LICENSES_TYPES = 'licenses_type';
const TABLE_LICENSES = 'licenses';

module.exports = function(dbinjected){

    let db = dbinjected;
    if(!db){
        db=require('../../DB/mysql');
    }

    async function get_blacks(ip) {
        const ip_response = await db.query('black_ips', {ip: ip});
        if(ip_response){
            return true;
        }else{
            return false;
        }
    }

    async function get_all_licenses_types() {
    const licenses_type = await db.todos(TABLE_LICENSES_TYPES);
        if (licenses_type){
            return licenses_type
        }else{
            return false;
        }
    }

    async function get_license_by_user(user_id) {
        const licenses = await db.queryAll(TABLE_LICENSES, {user_id: user_id});
        if (licenses){
        const last_license = licenses[licenses.length-1];
        const today = new Date();
        const due_date = new Date(last_license.due_date);
        if (today == due_date || today > due_date){
            const send_due = {
                id: last_license.id,
                user_id: last_license.user_id,
                license_type_id: last_license.license_type_id,
                date: last_license.date,
                due_date: last_license.due_date,
                expire: true
            }
            const sendData = await db.add(TABLE_LICENSES, send_due);
            return send_due;
        }else{
            return last_license;
        }
        }
    }

    async function add_license(body) {
        const today = new Date();
        try{
            if (body){
                let date_expire = 0;
                switch (body.license_type_id){
                    case 2:
                        date_expire = 14;
                        break;
                    case 3:
                        date_expire = 30;
                        break;
                    case 4: 
                        date_expire = 183;
                        break;
                }
                const dataSend = {
                    user_id: body.user_id,
                    license_type_id: body.license_type_id,
                    date: today,
                    due_date: new Date(today.setDate(today.getDate() + date_expire)),
                    expire: false
                }
                const send = await db.add(TABLE_LICENSES, dataSend);
                return true
            }else{
                return false;
            }
        }catch (err) {
            console.log(err);
        }
    }

    async function add_license_free(body) {
        const today = new Date();
        const next_due = new Date();
            if (body){
                const dataSend = {
                    user_id: body.user_id,
                    license_type_id: body.license_type_id,
                    date: today,
                    due_date: new Date(next_due.setDate(next_due.getDate() + 3)),
                    expire: false
                }
                const send = await db.add(TABLE_LICENSES, dataSend);
                return true
            }else{
                return false;
            }
    }

    async function update_license(body) {
        const current_license = await db.query(TABLE_LICENSES, {user_id: body.user_id});
        const today = new Date();
        try{
            if (body){
                const date_expire = 0;
                switch (body.licenses_type_id){
                    case 2:
                        date_expire = 14;
                        break;
                    case 3:
                        date_expire = 30;
                        break;
                    case 4: 
                        date_expire = 183;
                        break;
                }
                const dataSend = {
                    id: current_license.id,
                    user_id: body.user_id,
                    licenses_type_id: body.licenses_type_id,
                    date: today,
                    due_date: today.setDate(today.getDate() + date_expire),
                    expire: false
                }
                const send = await db.add(TABLE_LICENSES, dataSend);
                return true
            }else{
                return false;
            }
        }catch (err) {
            console.log(err);
        }
    }

    return {
        update_license,
        get_all_licenses_types,
        get_license_by_user,
        add_license,
        add_license_free,
        get_blacks
    }
}