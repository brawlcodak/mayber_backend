const bcrypt = require('bcrypt');
const db = require('../../DB/mysql');
const auth = require('../../auth');
const TABLE = 'users';
const TABLE_ERRORS = 'report_errors';

module.exports = function(dbinjected){

    let db = dbinjected;
    if(!db){
        db=require('../../DB/mysql');
    }

    async function login(username, password) {
        var today = new Date();
        const data = await db.query(TABLE, {username: username});
        if(data){
            return bcrypt.compare(password, data.password)
        .then(async result => {
            if(result){
                //generate token
                const result_user = await db.query('users', {id: data.id});
                const setResult = {
                    bearer: auth.tokenAsign({ ...data}),
                    user: {
                        id: result_user.id,
                        username: data.user,
                        email: data.email,
                    }
                }
                const newUser = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    date: data.date,
                    login_date: today,
                    token: setResult.bearer
                }
                await db.add(TABLE, newUser);
                return setResult;
            }else{
                throw new Error('Ivalid info');
            }
        })
        }
    }

    async function report_error(body) {
        const send_error = await db.add(TABLE_ERRORS, body);
        if(send_error){
            return send_error;
        }else{
            return false;
        }
    }

    async function todos() {
        let user_response = [];
        const users = await db.todos(TABLE);
        for (const item in users) {
            const license = await db.query('licenses', {user_id: users[item].id});
            const data = {
                user: users[item],
                license: license
            }
            user_response.push(data);
        };
        return user_response;
    }
    
    function uno(id) {
        return db.uno(TABLE, id);
    }
    
    async function add(body) {
        const exists = await db.query(TABLE, {email: body.email});
        if (!exists){
         const register = await db.add(TABLE, body);
         if(register) {
            const user = await db.query(TABLE, {email: body.email});
            return user;
         }
        }else{
            return false;
        }
    }

    async function consult_token(token) {
        const user = await db.query(TABLE, {token: token});
        if(user){
            return true;
        }else{
            return false
        }
    }
    
    function del(body) {
        return db.del(TABLE, body);
    }

    return {
        todos,
        login,
        uno,
        del,
        add,
        report_error,
        consult_token
    }
}