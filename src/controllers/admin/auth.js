const jwt = require('jsonwebtoken');
const response = require('../../utils/response');

require('dotenv').config();

const authenticationADM = async (ctx) => {
	const { email = null, password = null } = ctx.request.body;

	if (!email || !password) {
		return response(ctx, 400, { mensagem: 'Pedido mal-formatado' });
	}

	if (
		email === process.env.ADMIN_EMAIL &&
		password === process.env.ADMIN_PASS
	) {
		const token = await jwt.sign(
			{
				email,
			},
			process.env.JWT_SECRET || 'grana',
			{ expiresIn: '24h' }
		);

		return response(ctx, 200, {
			mensagem: `Administrador logado com sucesso!`,
			token: `${token}`,
		});
	}
	return response(ctx, 200, { mensagem: 'Email ou senha incorreto!' });
};

module.exports = { authenticationADM };
