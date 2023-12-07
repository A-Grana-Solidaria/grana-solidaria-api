const { Client } = require('pg');

const path = require('path');

require('dotenv').config({
	path: path.resolve(__dirname, '../../.env.example'),
});

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	password: process.env.DB_PW,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
});

client
	.connect()
	.catch((err) => console.error('connection error', err.stack));

module.exports = client;
