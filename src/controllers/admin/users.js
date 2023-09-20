const userTable = require('../../repositories/userTable');
const response = require('../../utils/response');
const dreamTable = require('../../repositories/dreamsTable');
require('dotenv').config();

const listDreamers = async (ctx) => {
	const { offset } = ctx.query;
	if (offset) {
		const dreamers = await userTable.getDreamers();
		const totalPages = Math.ceil(dreamers.length / 13);
		const numberPage = Math.floor(offset / 13 + 1);

		const dreamersFilted = await userTable.dreamersListByOffset(offset);
		const dreamersList = [];
		for (y = 0; y < dreamersFilted.length; y++) {
			const totalQuotas = await dreamTable.supportedQuotas(
				dreamersFilted[y].dream_id
			);
			const totalSupporters = await dreamTable.allSupportersOnDream(
				dreamersFilted[y].dream_id
			);
			let progress =
				(totalQuotas.count * 100) / dreamersFilted[y].quotasquantity;
			if (!Number.isInteger(progress)) {
				progress = 0;
			}
			const singleDreamer = {
				id: dreamersFilted[y].id,
				name: dreamersFilted[y].name,
				picture: dreamersFilted[y].picture,
				status: dreamersFilted[y].status,
				cashgoal: dreamersFilted[y].cashgoal,
				quotasquantity: dreamersFilted[y].quotasquantity,
				risk: dreamersFilted[y].risk,
				expiration_date: dreamersFilted[y].expiration_date,
				dream_id: dreamersFilted[y].dream_id,
				total_score: dreamersFilted[y].total_score,
				progress: `${Math.round(progress)}%`,
				supporters: totalSupporters.length,
			};
			dreamersList.push(singleDreamer);
		}

		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			totalDeSonhadores: dreamers.length,
			sonhadores: dreamersList,
		});
	}
	return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
};
const listSupporters = async (ctx) => {
	const { offset } = ctx.query;
	if (offset) {
		const supportersFilted = await dreamTable.supporterListByOffset(offset);
		const supporterList = [];
		for (y = 0; y < supportersFilted.length; y++) {
			const result = await dreamTable.totalDreams(supportersFilted[y].id);
			let total = 0;
			for (i = 0; i < result.length; i++) {
				const { dreamid } = result[i];
				const qtd = result[i].count;
				const dream = await dreamTable.dreamById(dreamid);
				const { cashgoal, quotasquantity = 0 } = dream;
				const quotaValue = cashgoal / quotasquantity;
				total += quotaValue * qtd;
			}
			const singleSupporter = {
				id: supportersFilted[y].id,
				name: supportersFilted[y].name,
				totalSupport: supportersFilted[y].count,
				invested: total.toFixed(),
			};
			supporterList.push(singleSupporter);
		}
		const supporters = await userTable.getSupporters();
		const totalPages = Math.ceil(supporters.length / 13);
		const numberPage = Math.floor(offset / 13 + 1);

		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			totalDeApoiadores: supporters.length,
			apoiadores: supporterList,
		});
	}
	return response(ctx, 400, { mensagem: 'É necessário passar o offset' });
};
const getDream = async (ctx) => {
	const { id } = ctx.params;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}

	const dreamDB = await dreamTable.getDreamAndScoreById(id);
	if (!dreamDB) {
		return response(ctx, 400, { mensagem: 'Esse sonho não existe!' });
	}
	const supportersOnDream = await dreamTable.allSupportersOnDream(dreamDB.id);
	let totalQuotas = 0;
	const allSupporters = [];
	supportersOnDream.forEach(async (element) => {
		totalQuotas += Number(element.count);
		const result = await userTable.searchUserById(element.userid);
		const supporterData = {
			id: element.userid,
			name: result.name,
			picture: result.picture,
			quotas: element.count,
		};
		allSupporters.push(supporterData);
	});
	let progress = (totalQuotas * 100) / dreamDB.quotasquantity;
	if (!Number.isInteger(progress)) {
		progress = 0;
	}
	const userDB = await userTable.searchUserById(dreamDB.userid);
	if (userDB.deleted_at) {
		return response(ctx, 400, { mensagem: 'Esse usuário está deletado!' });
	}
	const quotas = await dreamTable.supportedQuotas(dreamDB.id);
	const userData = {
		id: userDB.id,
		name: userDB.name,
		birthdate: userDB.birthdate,
		picture: userDB.picture,
		cep: userDB.cep,
		cpf: userDB.cpf,
		email: userDB.email,
		phonenumber: userDB.phonenumber,
		type: userDB.type,
	};
	const dreamData = {
		dream: {
			...dreamDB,
			progress: `${Math.round(progress)}%`,
			quotas: quotas.count,
		},
		user: userData,
		allSupporters,
	};
	if (dreamData.user.deleted_at) {
		return response(ctx, 403, { mensagem: 'Esse usuário está deletado' });
	}
	if (dreamData) {
		return response(ctx, 200, dreamData);
	}
	return response(ctx, 401, { mensagem: 'Ocorreu um erro' });
};
const updateDream = async (ctx) => {
	const { id } = ctx.params;
	let {
		description,
		cashgoal,
		quotasquantity,
		risk,
		status,
		name,
		birthdate,
		cpf,
		cep,
		phonenumber,
		email,
	} = ctx.request.body;

	if (cashgoal === 'null') cashgoal = null;
	else cashgoal = Number(cashgoal);
	if (quotasquantity === 'null') quotasquantity = null;
	else quotasquantity = Number(quotasquantity);

	let { picture } = ctx.request.body;

	if (picture === 'undefined') picture = null;

	status = Number(status);

	if (
		!description ||
		status === null ||
		!name ||
		!birthdate ||
		!cpf ||
		!cep ||
		!phonenumber ||
		!email
	) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const getDream = await dreamTable.dreamById(id);
	if (status === 1) {
		risk = Number(risk);

		if (!cashgoal || !quotasquantity || risk === null) {
			return response(ctx, 400, {
				mensagem: 'É necessário passar o valor da meta, risco e cotas',
			});
		}
		if (!getDream.expiration_date) {
			const currentDate = new Date();
			const dreamerDB = await dreamTable.updateDream(
				description,
				cashgoal,
				quotasquantity,
				risk,
				status,
				currentDate,
				id
			);
		} else {
			const dreamerDB = await dreamTable.updateDream(
				description,
				cashgoal,
				quotasquantity,
				risk,
				status,
				getDream.expiration_date,
				id
			);
		}
	} else {
		const dreamerDB = await dreamTable.updateDream(
			description,
			null,
			null,
			null,
			status,
			null,
			id
		);
	}
	const userDB = await userTable.updateDreamer(
		name,
		birthdate,
		cpf,
		cep,
		phonenumber,
		email,
		getDream.userid,
		picture
	);
	return response(ctx, 200, { mensagem: 'Sonhador alterado com sucesso!' });
};
const getSupporter = async (ctx) => {
	const { id } = ctx.params;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const supporterDB = await userTable.getSupporter(id);
	const dreamdata = await userTable.getSupporterDreams(id);
	const profileSupporter = {
		supporterData: supporterDB,
		dreamsData: dreamdata,
	};
	return response(ctx, 200, profileSupporter);
};
const updateSupporter = async (ctx) => {
	const { id } = ctx.params;
	const { name, birthdate, cep, cpf, email, phonenumber } = ctx.request.body;

	let { picture } = ctx.request.body;

	if (picture === 'undefined') picture = null;

	if (!name || !birthdate || !cpf || !cep || !phonenumber || !email || !id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const supporterDB = await userTable.changeSupporter(
		name,
		birthdate,
		picture,
		cpf,
		cep,
		phonenumber,
		email,
		id
	);
	return response(ctx, 200, 'Apoiador alterado com sucesso');
};
const deleteProfile = async (ctx) => {
	const { id = null } = ctx.params;
	const deleted_date = new Date();
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const deleteDB = await userTable.deleteUser(id, deleted_date);
	return response(ctx, 200, 'Deletado com sucesso!');
};
module.exports = {
	listDreamers,
	getDream,
	updateDream,
	getSupporter,
	updateSupporter,
	listSupporters,
	deleteProfile,
};
