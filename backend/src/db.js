const mysql = require('mysql2');
const config = require('./config');
require('dotenv').config();

config['host'] = process.env.DB_HOST
config['user'] = process.env.DB_USER
config['password'] = process.env.DB_PASSWORD
config['database'] = process.env.DB_NAME


const pool = mysql.createPool(config)

module.exports = pool;