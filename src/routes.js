const Router = require('@koa/router');

const router = new Router();

const multer = require('@koa/multer');
const response = require('./utils/response');
const Auth = require('./controllers/web/auth');
const AuthAdm = require('./controllers/admin/auth');
const User = require('./controllers/web/user');
const UserAdm = require('./controllers/admin/users');
const Dreams = require('./controllers/web/dreams');
const Session = require('./middlewares/session');
const { upload, uploadFile } = require('./utils/storage2');
const Export = require('./controllers/admin/export');

const upload2 = multer();

// ROTAS DO USUÁRIO

router.get('/', (ctx) => {
	return response(ctx, 200, { message: 'hello world' });
});

router.get('/dreamerGet', (ctx) => {
	return response(ctx, 200, { message: 'dreamer ok'});
});

router.post('/dreamer', async (ctx, next) => {
	try {
		const { picture } = ctx.request.files;
		if (picture) {
			const { url } = await uploadFile({
				fileName: picture.name,
				filePath: picture.path,
				fileType: picture.type,
			});
			ctx.request.body.picture = url;
		}

		return User.registerDreamer(ctx);
	} catch (error) {
		return response(ctx, 400, { mensagem: error.message });
	}
});

router.post('/entrepreneurCompany', async (ctx, next) => {
	try {
		// const { picture } = ctx.request.files;
		// if (picture) {
		// 	const { url } = await uploadFile({
		// 		fileName: picture.name,
		// 		filePath: picture.path,
		// 		fileType: picture.type,
		// 	});
		// 	ctx.request.body.picture = url;
		// }

		return User.registerEntrepreneurCompany(ctx);
	} catch (error) {
		return response(ctx, 400, { mensagem: error.message });
	}
});

// Registrar Sonhador
router.post('/supporter', async (ctx, next) => {
	try {
		const { picture } = ctx.request.files;
		if (picture) {
			const { url } = await uploadFile({
				fileName: picture.name,
				filePath: picture.path,
				fileType: picture.type,
			});
			ctx.request.body.picture = url;
		}

		return User.registerSupporter(ctx);
	} catch (error) {
		return response(ctx, 400, { mensagem: error.message });
	}
});

// Registrar Apoiador
router.post('/auth', Auth.authentication); // Autenticar o login do usuário
router.get('/confirmation/:token', Auth.changeVerified); // Autenticação do email.
router.post('/dreams', Session.verify, Dreams.registerDream); // Registrar um sonho
router.get('/dreams', Session.verify, Dreams.getDreams); // listar os sonhos, usando a querystring '?offset='
router.get('/dreams/:id', Dreams.getDreamById); // listar o sonho buscado pelo id
router.get('/confirmation/:token', Session.verify, Auth.changeVerified); // verificação do email.
router.post('/support/:id', Session.verify, Dreams.supportDream);
router.post('/requestpassword', User.sendEmailReset);
router.post('/resetpassword/:token', User.resetPassword);

// ROTAS DO ADM
router.post('/login', AuthAdm.authenticationADM);
router.get('/dreamers', Session.verify, UserAdm.listDreamers); // listar os sonhadores, usando a querystring '?offset='
router.get('/dream/:id', Session.verify, UserAdm.getDream);

router.put('/dream/:id', Session.verify, async (ctx, next) => {
	try {
		const { picture } = ctx.request.files;

		if (picture) {
			const { url } = await uploadFile({
				fileName: picture.name,
				filePath: picture.path,
				fileType: picture.type,
			});
			ctx.request.body.picture = url;
		}

		return UserAdm.updateDream(ctx);
	} catch (error) {
		console.log(error)
		return response(ctx, 400, { mensagem: 'Arquivo não permitido!' });
	}
});

router.get('/supporter/:id', Session.verify, UserAdm.getSupporter);
router.put('/supporter/:id', Session.verify, async (ctx, next) => {
	try {
		const { picture } = ctx.request.files;
		if (picture) {
			const { url } = await uploadFile({
				fileName: picture.name,
				filePath: picture.path,
				fileType: picture.type,
			});
			ctx.request.body.picture = url;
		}

		return UserAdm.updateSupporter(ctx);
	} catch (error) {
		return response(ctx, 400, { mensagem: 'Arquivo não permitido!' });
	}
});
router.get('/supporters', Session.verify, UserAdm.listSupporters); // listar os apoiadores, usando a querystring '?offset='
router.delete('/user/:id', Session.verify, UserAdm.deleteProfile);

router.get('/export', Session.verify, Export.exportTables);

//router.post('https://baas-staging.socinal.com.br/api/v1/auth/token');

module.exports = router;