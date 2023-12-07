/* eslint-disable no-await-in-loop */
const jwt = require('jsonwebtoken');
const DreamsTable = require('../../repositories/dreamsTable');
const response = require('../../utils/response');
const UserTable = require('../../repositories/userTable');
const {
	sendEmail,
	emailSupport,
	emailConfirmed,
} = require('../../utils/email');
const {
	createEmailConfirmation,
} = require('../../repositories/emailConfirmation');

const registerDream = async (ctx) => {
	const {
		status = 0,
		description = null,
		estimatedCashGoal = null,
		question1_status = null,
		question2_status = null,
		question3_status = null,
		question4_status = null,
		question5_status = null,
		question6_status = null,
	} = ctx.request.body;
	const { id = null } = ctx.state;

	if (!description || !estimatedCashGoal || !id) {
		return response(ctx, 400, { mensagem: 'Mal formatado' });
	}
	const userHasDream = await DreamsTable.dreamByIdUser(id);
	if (userHasDream) {
		return response(ctx, 401, {
			mensagem: 'Usuário já tem sonho cadastrado!',
		});
	}
	const resultDream = await DreamsTable.createDream(
		status,
		description,
		estimatedCashGoal,
		id
	);
	await DreamsTable.scoreDreamer(
		resultDream.id,
		question1_status,
		question2_status,
		question3_status,
		question4_status,
		question5_status,
		question6_status
	);
	const { name, picture, type, email } = await UserTable.searchUserById(id);
	const emailToken = await jwt.sign(
		{
			id,
			email,
			name,
			type,
			picture,
			status,
			dreamid: resultDream.id,
		},
		process.env.JWT_SECRET || 'grana',
		{
			expiresIn: '2d',
		}
	);
	const url = `${process.env.FRONTEND_DOMAIN}/cadastro-sucesso/${emailToken}`;
	const html = emailConfirmed(url);
	createEmailConfirmation(emailToken, id);
	sendEmail(email, 'Confirmação de email', html);
	return response(ctx, 201, {
		mensagem: 'Sonho cadastrado com sucesso!',
	});
};
const getAssociateByID = async (ctx) => {
	//ToDo devo usar esse metodo msm? ou juntar com o retorno da lista de "sonhadores?"
}
const getDreamById = async (ctx) => {
	const { id = null } = ctx.params;

	if (id) {
		const dreamDB = await DreamsTable.dreamById(id);
		if (!dreamDB) {
			return response(ctx, 403, { mensagem: 'Sonho não disponível' });
		}
		const userDB = await UserTable.searchUserById(dreamDB.userid);
		if (userDB.deleted_at) {
			return response(ctx, 403, {
				mensagem: 'Este usuário está deletado',
			});
		}
		const quotas = await DreamsTable.supportedQuotas(dreamDB.id);
		const quotasPercentage =
			(Number(quotas.count) * 100) / dreamDB.quotasquantity;
		const dream = {
			name: userDB.name,
			picture: userDB.picture,
			cashgoal: dreamDB.cashgoal,
			description: dreamDB.description,
			expiration_date: dreamDB.timeleft,
			quotasquantity: dreamDB.quotasquantity,
			quotas: quotas.count,
			score: dreamDB.total_score,
			risk: dreamDB.risk,
			quotasPercentage,
		};
		return response(ctx, 200, {
			dream,
		});
	}
	return response(ctx, 400, { mensagem: 'Mal formatado' });
};

const getDreams = async (ctx) => {
	if (ctx.state.type === 1) {
		const { offset } = ctx.query;
		const numberPage = Math.floor(offset / 5 + 1);
		const dreamsFilted = await DreamsTable.dreamsList();
		const newDream = [];
		let count = 0;
		// eslint-disable-next-line no-restricted-syntax
		for (const dream of dreamsFilted) {
			const quotas = await DreamsTable.supportedQuotas(dream.id);
			const QuotasFilled = await DreamsTable.dreamQuotasFilled(dream.id);
			const scoreDB = await DreamsTable.getScore(dream.id);
			const QuotasPercentage =
				(QuotasFilled * 100) / dream.quotasquantity;
			const newDreamsFilted = {
				quotasPercentage: QuotasPercentage,
				...dream,
				score: scoreDB.total_score,
				quotas: quotas.count,
			};
			if (QuotasPercentage !== 100) {
				newDream.push(newDreamsFilted);
			} else {
				count++;
			}
		}
		const totalPages = Math.ceil((dreamsFilted.length - count) / 5);
		const dreamsOrdered = newDream.sort((a, b) => {
			if (a.quotasPercentage > b.quotasPercentage) {
				return -1;
			}
			if (a.quotasPercentage < b.quotasPercentage) {
				return 1;
			}
			if (a.risk > b.risk) {
				return -1;
			}
			if (a.risk < b.risk) {
				return 1;
			}
			if (a.score > b.score) {
				return -1;
			}
			if (a.score < b.score) {
				return 1;
			}
		});
		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			sonhos: dreamsOrdered.slice(offset, offset + 5),
		});
	}

	const { id = null } = ctx.state;

	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}

	const dreamDB = await DreamsTable.dreamById(id);

	if (dreamDB.status == 1) {
		return response(ctx, 200, { mensagem: 'Aprovado' });
	}

	return response(ctx, 200, { mensagem: 'Pedente' });
};


const supportDream = async (ctx) => {
	const { totalQuotas = null } = ctx.request.body;
	const supporterId = ctx.state.id;
	const { id = null } = ctx.params;
	if (!totalQuotas || !supporterId || !id) {
		return response(ctx, 400, { mensagem: 'Mal formatado' });
	}
	const { email } = await UserTable.searchUserById(supporterId);
	const { quotasquantity, cashgoal, userid } = await DreamsTable.dreamById(
		id
	);
	const { name } = await UserTable.getDreamer(userid);
	const valor = cashgoal / quotasquantity;
	const { count } = await DreamsTable.supportedQuotas(id);
	const quotasLeft = quotasquantity - count;
	if (quotasLeft >= totalQuotas) {
		for (x = 0; x < totalQuotas; x++) {
			DreamsTable.addSupportOnDream(supporterId, id);
		}
		const total = totalQuotas * valor;
		const html = emailSupport(name, valor, totalQuotas, total);
		sendEmail(email, 'Apoio registrado!', html);
		return response(ctx, 200, { mensagem: 'Sonho apoiado com sucesso!' });
	}
	return response(ctx, 200, {
		mensagem: 'Quantidade de cotas não disponível',
	});
};
module.exports = {
	registerDream,
	getDreams,
	getDreamById,
	supportDream,
};
