const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const path = require('path');
const cors = require('@koa/cors');
const koaBody = require('koa-body');

const server = new Koa();
const router = require('./src/routes');
const socinalRouterBase = require('./src/socinalRoutes/Base');
const socinalRouterDocumentacao = require('./src/socinalRoutes/Documentacao');

const PORT = process.env.PORT || 8081;

server.use(
	cors({
		allowHeaders: '*'//ToDO: change to only accept our requests
	})
);

server.use(koaBody({ multipart: true, json: true }));
server.use(mount('/temp', serve(path.resolve(__dirname, 'temp/'))));

server.use(router.routes());
server.use(socinalRouterBase.routes());
server.use(socinalRouterDocumentacao.routes());


server.listen(PORT, () => console.log(`Running on ${PORT}`));
