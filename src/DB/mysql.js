const mysql = require('mysql');
const {createPool} = require('mysql2/promise')
const config = require('../config');
const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    ssl: {
        rejectUnauthorized: false
    }
}
let conexion;
async function conMysql(){
    conexion = await createPool(dbconfig);
    console.log('Connection Ready!!');
    /* conexion.connect((err) => {
        if(err){
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        }else{
            console.log('DB connected!!')
        }
    });
    conexion.on('error', err => {
        console.log('[db.err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();
        }else{
            throw err;
        }
    }); */
}
conMysql();

function todos(table) {
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${table}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function uno(table, id) {
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${table} WHERE id=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function add(table, data) {
    return new Promise( (resolve, reject) => {
        conexion.query(`INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function del(table, data) {
    return new Promise( (resolve, reject) => {
        conexion.query(`DELETE FROM ${table} WHERE id = ?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function query(table, consult) {
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${table} WHERE ?`, consult, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        })
    })
}

function queryAll(table, consult) {
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${table} WHERE ?`, consult, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}


module.exports = {
    todos,
    uno,
    add,
    del,
    query,
    queryAll
}