const jwt = require('jsonwebtoken');
const brazilianUtils = require('@brazilian-utils/brazilian-utils');
const moment = require('moment');
const userTable = require('../../repositories/userTable');
const dreamTable = require('../../repositories/dreamsTable');
const response = require('../../utils/response');
const Password = require('../../utils/password');
const code = require('../../utils/code');
const { sendEmail, emailConfirmed, emailReset } = require('../../utils/email');
const {
	createEmailConfirmation,
} = require('../../repositories/emailConfirmation');

require('dotenv').config();

const registerDreamer = async (ctx) => {
	const {
		name = null,
		birthdate = null,
		cep = null,
		cpf = null,
		email = null,
		phonenumber = null,
		password = null,
		type = '0',
	} = ctx.request.body;

	let { picture } = ctx.request.body;

	if (picture === 'undefined') picture = null;

	if (
		!name ||
		!birthdate ||
		!cep ||
		!cpf ||
		!email ||
		!phonenumber ||
		!password ||
		!type
	) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
	}

	const passwordEncrypted = await Password.encrypt(password);

	if ((await userTable.getUser(cpf)) || (await userTable.searchUser(email))) {
		return response(ctx, 400, {
			mensagem: 'Usuario já está cadastrado',
		});
	}
	if (!brazilianUtils.isValidCPF(cpf)) {
		return response(ctx, 400, { mensagem: 'CPF inválido' });
	}
	if (!brazilianUtils.isValidCEP(cep)) {
		return response(ctx, 400, { mensagem: 'CEP inválido' });
	}
	if (!brazilianUtils.isValidMobilePhone(phonenumber)) {
		return response(ctx, 400, { mensagem: 'Telefone inválido' });
	}
	if (!code.emailValidator(email)) {
		return response(ctx, 400, {
			mensagem: 'Por favor, preencha um email válido.',
		});
	}
	const dreamerDB = await userTable.createUser(
		name,
		picture,
		birthdate,
		cep,
		cpf,
		email,
		phonenumber,
		passwordEncrypted,
		type
	);
	
	if (dreamerDB) {
		const token = await jwt.sign(
			{
				picture: dreamerDB.picture,
				id: dreamerDB.id,
				name: dreamerDB.name,
				type: dreamerDB.type,
			},
			process.env.JWT_SECRET || 'granasolidaria',
			{ expiresIn: '1h' }
		);
		return response(ctx, 201, {
			mensagem: 'Sonhador criado com sucesso!',
			token,
		});
	}

	return response(ctx, 400, {
		mensagem: 'Ocorreu um erro no cadastro do sonhador',
	});
};

const registerEntrepreneurCompany = async (ctx) => {
	const {
		name = null,
		birthdate = null,
		cep = null,
		cpf = null,
		email = null,
		phonenumber = null,
		password = null,
		type = '0',
	} = ctx.request.body;

	let { picture } = ctx.request.body;

	if (picture === 'undefined') picture = null;

	if (
		!name ||
		!birthdate ||
		!cep ||
		!cpf ||
		!email ||
		!phonenumber ||
		!password ||
		!type
	) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
	}

	const passwordEncrypted = await Password.encrypt(password);

	if ((await userTable.getUser(cpf)) || (await userTable.searchUser(email))) {
		return response(ctx, 400, {
			mensagem: 'Usuario já está cadastrado',
		});
	}
	if (!brazilianUtils.isValidCPF(cpf)) {
		return response(ctx, 400, { mensagem: 'CPF inválido' });
	}
	if (!brazilianUtils.isValidCEP(cep)) {
		return response(ctx, 400, { mensagem: 'CEP inválido' });
	}
	if (!brazilianUtils.isValidMobilePhone(phonenumber)) {
		return response(ctx, 400, { mensagem: 'Telefone inválido' });
	}
	if (!code.emailValidator(email)) {
		return response(ctx, 400, {
			mensagem: 'Por favor, preencha um email válido.',
		});
	}
	const dreamerDB = await userTable.createUser(
		name,
		picture,
		birthdate,
		cep,
		cpf,
		email,
		phonenumber,
		passwordEncrypted,
		type
	);
	
	if (dreamerDB) {
		const token = await jwt.sign(
			{
				picture: dreamerDB.picture,
				id: dreamerDB.id,
				name: dreamerDB.name,
				type: dreamerDB.type,
			},
			process.env.JWT_SECRET || 'granasolidaria',
			{ expiresIn: '1h' }
		);
		return response(ctx, 201, {
			mensagem: 'Sonhador criado com sucesso!',
			token,
		});
	}

	return response(ctx, 400, {
		mensagem: 'Ocorreu um erro no cadastro do sonhador',
	});
};

const registerSupporter = async (ctx) => {
	const {
		name = null,
		birthdate = null,
		cep = null,
		cpf = null,
		email = null,
		phonenumber = null,
		password = null,
		type = '1',
		hasInvestingExperience = null,
		investingType = null,
		investingBudget = null,
	} = ctx.request.body;
	let { picture } = ctx.request.body;

	if (picture === 'undefined') picture = null;
	if (
		!name ||
		!birthdate ||
		!cep ||
		!cpf ||
		!email ||
		!phonenumber ||
		!password ||
		!hasInvestingExperience ||
		!investingType ||
		!investingBudget
	) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
	}
	const passwordEncrypted = await Password.encrypt(password);

	if ((await userTable.getUser(cpf)) || (await userTable.searchUser(email))) {
		return response(ctx, 400, { mensagem: 'Usuario já está cadastrado' });
	}
	if (!brazilianUtils.isValidCPF(cpf)) {
		return response(ctx, 400, { mensagem: 'CPF inválido' });
	}
	if (!brazilianUtils.isValidCEP(cep)) {
		return response(ctx, 400, { mensagem: 'CEP inválido' });
	}
	if (!brazilianUtils.isValidMobilePhone(phonenumber)) {
		return response(ctx, 400, { mensagem: 'Telefone inválido' });
	}
	const supporterDB = await userTable.createUser(
		name,
		picture,
		birthdate,
		cep,
		cpf,
		email,
		phonenumber,
		passwordEncrypted,
		type,
		hasInvestingExperience,
		investingType,
		investingBudget
	);
	if (supporterDB) {
		const projects = await dreamTable.totalDreams(supporterDB.id);

		const emailToken = await jwt.sign(
			{
				id: supporterDB.id,
				email: supporterDB.email,
				name: supporterDB.name,
				picture: supporterDB.picture,
				type: supporterDB.type,
				projects: projects ? projects.length : 0,
			},
			process.env.JWT_SECRET || 'grana',
			{
				expiresIn: '2d',
			}
		);
		const url = `${process.env.FRONTEND_DOMAIN}/cadastro-sucesso/${emailToken}`;
		createEmailConfirmation(emailToken, supporterDB.id);
		const html = emailConfirmed(url);
		sendEmail(supporterDB.email, 'Confirmação de email', html);
		return response(ctx, 201, {
			mensagem: 'Apoiador criado com sucesso!',
		});
	}
	return response(ctx, 400, {
		mensagem: 'Ocorreu um erro no cadastro do Apoiador',
	});
};

const sendEmailReset = async (ctx) => {
	const { email = null } = ctx.request.body;
	if (!email) return response(ctx, 400, { mensagem: 'Pedido mal formatado' });

	const hasUser = userTable.searchUser(email);
	if (hasUser) {
		const emailToken = await jwt.sign(
			{ email },
			process.env.JWT_SECRET || 'passwordGrana'
		);
		const url = `${process.env.FRONTEND_DOMAIN}/nova-senha/${emailToken}`; // confirmar path do front
		const html = emailReset(url);
		sendEmail(email, 'Redefinição de Senha', html);
		return response(ctx, 200, { mensagem: 'Email enviado com sucesso!' });
	}
	return response(ctx, 400, { mensagem: 'Esse usuário não existe.' });
};

const resetPassword = async (ctx) => {
	const token = ctx.url.split('/')[2];
	const { newPassword } = ctx.request.body;
	if (!token) {
		return response(ctx, 403, { mensagem: 'Ação Proibida' });
	}
	try {
		if (token) {
			const verification = await jwt.verify(
				token,
				process.env.JWT_SECRET || 'passwordGrana'
			);
			if (verification) {
				const passwordEncrypted = await Password.encrypt(newPassword);
				userTable.newPassword(passwordEncrypted, verification.email);
				return response(ctx, 200, {
					mensagem: `Senha redefinida com sucesso!`,
				});
			}
		} else {
			return response(ctx, 404, { mensagem: 'Pagina não encontrada' });
		}
	} catch (err) {
		console.log(err);
		return response(ctx, 403, { mensagem: 'Ação Proibida' });
	}
};
module.exports = {
	registerDreamer,
	registerEntrepreneurCompany,
	registerSupporter,
	sendEmailReset,
	resetPassword,
};
