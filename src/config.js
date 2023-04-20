require('dotenv').config();

module.exports = {
/*     app: {
        port: process.env.PORT || 3500,
    }, */
    jwt: {
        secret: process.env.JET_SECRET || 'secretnote!'
    },
    mysql: {
        host: process.env.host,
        user: process.env.username,
        password: process.env.password,
        database: process.env.database
    }
}