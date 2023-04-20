const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const error = require('./red/errors');
const bodyParser = require('body-parser');

const users = require('./modules/users/paths');
const dashboard = require('./modules/dashboard/paths');
const accounts = require('./modules/account/paths');

const app = express();
//middleware
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
     next();
});

app.set('port', config.app.port);

//paths
app.use('/api/users', users);
app.use('/api/dashboard', dashboard);
app.use('/api/accounts', accounts);

app.use(error)

module.exports = app;