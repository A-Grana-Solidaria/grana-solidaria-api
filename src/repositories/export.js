const database = require('../utils/database');

// const exportTable = async () => {
// 	const query = `SELECT users.id, name, TO_CHAR(birthdate, 'DD/MM/YYYY') AS birthdate,
// 	picture, cpf, cep, email, phonenumber, CASE type WHEN 1 THEN 'supporter' ELSE 'dreamer' END AS type,
// 	hasinvestingexperience, investingtype, investingbudget, deleted_at, dreams.status, dreams.quotasquantity,
// 	dreams.estimatedcashgoal, dreams.cashgoal, CASE dreams.risk WHEN 0 THEN 'high' WHEN 1 THEN 'medium' WHEN 2 THEN 'low' END AS risk,
// 	dreams.expiration_date FROM users FULL JOIN dreams ON dreams.userid = users.id ORDER BY users.id`;
// 	const result = await database.query(query);
// 	return result.rows;
// };

const dreamersSummary = async () => {
	const query = `
		select
			users.name as "Nome",
			TO_CHAR(users.usersince, 'DD/MM/YYYY') as "Usuário desde",
			users.term as "Termo de Aceite",
			TO_CHAR(users.birthdate, 'DD/MM/YYYY') as "Data de nascimento",
			users.picture as "Foto de perfil",
			users.cep as "CEP",
			users.cpf as "CPF",
			users.email as "E-mail",
			users.phonenumber as "Telefone de contato",
			CASE
				WHEN emailconfirmation.verified = true THEN '✓'
				WHEN emailconfirmation.verified = false THEN ' '
			END as "Email verificado",
			CASE
				WHEN dreams.status=0 THEN 'Pendente'
				WHEN dreams.status=1 THEN 'Aprovado'
			END as "Situação",
			dreams.quotasquantity as "Quantidade de Quotas",
			dreams.description as "Descrição",
			dreams.estimatedcashgoal as "Estimativa de orçamento",
			dreams.cashgoal as "Meta de orçamento",
			dreams.expiration_date as "Data de expiração do sonho",
			CASE
				WHEN dreams.risk=0 THEN 'Alto'
				WHEN dreams.risk=1 THEN 'Medio'
				WHEN dreams.risk=2 THEN 'Baixo'
			END as "Risco"
		from users
			left join emailconfirmation on emailconfirmation.id_user = users.id
			inner join dreams on dreams.userid = users.id
		where "type" = 0
		order by users.id
	`;
	const result = await database.query(query);
	return result.rows;
};

const supportersSummary = async () => {
	const query = `
		select
			name as "Nome",
			TO_CHAR(users.usersince, 'DD/MM/YYYY') as "Usuário desde",
			users.term as "Termo de Aceite",
			TO_CHAR(users.birthdate, 'DD/MM/YYYY') as "Data de nascimento",
			users.picture as "Foto de perfil",
			users.cep as "CEP",
			users.cpf as "CPF",
			users.email as "E-mail",
			users.phonenumber as "Telefone de contato",
			CASE
				WHEN emailconfirmation.verified = true THEN '✓'
				WHEN emailconfirmation.verified = false THEN ' '
			END as "Email verificado",
			CASE
				WHEN users.hasinvestingexperience = true THEN 'Sim'
				WHEN users.hasinvestingexperience = false THEN 'Não'
			END as "Tem experiência de investimento",
			CASE
				WHEN users.investingtype = 0 THEN 'Pontual'
				WHEN users.investingtype = 1 THEN 'Recorrente'
			END as "Tipo de investimento escolhido",
			users.investingbudget as "Orçamento disponível para investimento",
			sum (dreams.cashgoal / dreams.quotasquantity) as "Total investido"

		from users
			left join emailconfirmation on emailconfirmation.id_user = users.id
			left join user_support_dream on user_support_dream.userid = users.id
			left join dreams on dreams.id = user_support_dream.dreamid
		where "type" = 1
		GROUP BY users.id, emailconfirmation.verified 
		ORDER BY users.id;
	`;
	const result = await database.query(query);
	return result.rows;
};

const matchSummary = async () => {
	const query = `
		select
			TO_CHAR(user_support_dream.support_date, 'DD/MM/YYYY HH24:MI') as "Data do Apoio",
			supporter.name as "Apoiador",
			dreamer.name as "Sonhador",
			count(supporter.name) as "Quantidade de Cotas",
			sum ((dreams.cashgoal / dreams.quotasquantity)) as "Total Investido"
		from users supporter
			inner join user_support_dream on supporter.id = user_support_dream.userid
			inner join dreams on dreams.id = user_support_dream.dreamid
			inner join users dreamer on dreamer.id = dreams.userid
		group by TO_CHAR(user_support_dream.support_date, 'DD/MM/YYYY HH24:MI'), supporter.name, dreamer.name 
		order by TO_CHAR(user_support_dream.support_date, 'DD/MM/YYYY HH24:MI')
	`;
	const result = await database.query(query);
	return result.rows;
};

module.exports = { dreamersSummary, supportersSummary, matchSummary };
