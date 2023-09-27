const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const path = require('path');
const cors = require('@koa/cors');
const bodyparser = require('koa-bodyparser');
const koaBody = require('koa-body');

const server = new Koa();
const router = require('./src/routes');

const PORT = process.env.PORT || 8081;

server.use(
	cors({
		allowHeaders: '*'
	})
);
// server.use(bodyparser());
server.use(koaBody({ multipart: true, json: true }));
server.use(mount('/temp', serve(path.resolve(__dirname, 'temp/'))));

server.use(router.routes());

// console.log(process.env.DB_HOST);

server.listen(PORT, () => console.log(`Running on ${PORT}`));
