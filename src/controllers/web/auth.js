const jwt = require('jsonwebtoken');
const UserTable = require('../../repositories/userTable');
const DreamTable = require('../../repositories/dreamsTable');
const Password = require('../../utils/password');
const response = require('../../utils/response');
const emailConfirmation = require('../../repositories/emailConfirmation');

require('dotenv').config();

const authentication = async (ctx) => {
	const { email = null, password = null } = ctx.request.body;

	if (!email || !password) {
		return response(ctx, 400, { mensagem: 'Pedido mal-formatado' });
	}
	const user = await UserTable.searchUser(email);

	if (user) {
		const projects = await DreamTable.totalDreams(user.id)
		const dream = await DreamTable.dreamByIdUser(user.id);
		const UserConfirmed = await UserTable.getUserConfirmed(email);
		if (!UserConfirmed.verified) {
			return response(ctx, 400, {
				mensagem: 'Usuario não confirmou o email!',
			});
		}
		const comparision = await Password.check(password, user.password);

		if (comparision) {
			const token = await jwt.sign(
				{
					id: user.id,
					name: user.name,
					type: user.type,
					picture: user.picture,
					status: dream ? dream.status : null,
					dreamid: dream ? dream.id : null,
					projects: projects ? projects.length : 0,
				},
				process.env.JWT_SECRET || 'granasolidaria',
				{ expiresIn: '1h' }
			);

			return response(ctx, 200, {
				mensagem: `Usuário logado com sucesso!`,
				token: `${token}`,
			});
		}
	}
	return response(ctx, 401, { mensagem: 'Email ou senha incorreto!' });
};
const changeVerified = async (ctx) => {
	const token = ctx.url.split('/')[2];
	if (!token) {
		return response(ctx, 403, { mensagem: 'Ação Proibida' });
	}
	try {
		if (token) {
			const verification = await jwt.verify(
				token,
				process.env.JWT_SECRET
			);
			ctx.state.email = verification.email;
			ctx.state.id = verification.id;
			if (emailConfirmation.getEmail(token)) {
				emailConfirmation.changeStatus(verification.id);
				return response(ctx, 200, {
					mensagem: `Email confirmado com sucesso! ${process.env.FRONTEND_DOMAIN} `,
				});
			}
		} else {
			return response(ctx, 404, { mensagem: 'Pagina não encontrada' });
		}
	} catch (err) {
		return response(ctx, 403, { mensagem: 'Ação Proibida' });
	}

	// return response(ctx, 400, { mensagem: 'Esse token é invalido' });
};

module.exports = { authentication, changeVerified };
