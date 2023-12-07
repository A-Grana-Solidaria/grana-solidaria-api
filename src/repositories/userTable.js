const database = require('../utils/database');

/**
 * Query para identificar se já existe algum email na hora de criar usuário.
 */
const searchUser = async (email) => {
	const query = `SELECT * FROM users WHERE email = $1`;
	const result = await database.query({
		text: query,
		values: [email],
	});
	return result.rows.shift();
};
const searchUserById = async (id) => {
	const query = `SELECT * FROM users WHERE id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};

const searchCompanyById = async (id) => {
	const query = `SELECT * FROM cnpj_entrepreneur_register WHERE id = $1`;
	const result = await database.query({
		text:query,
		values: [id],
	});
	return result.rows.shift();
}

const createUser = async (
	name,
	picture,
	birthdate,
	cep,
	cpf,
	email,
	phoneNumber,
	password,
	type,
	hasInvestingExperience,
	investingType,
	investingBudget
) => {
	if (
		!name ||
		!birthdate ||
		!cep ||
		!cpf ||
		!email ||
		!phoneNumber ||
		!password ||
		!type
	) {
		return null;
	}
	const query = `INSERT INTO users(
			  name,
		    birthdate,
		    picture,
        cep,
        cpf,
        email,
        phoneNumber,
        password,
        type,
        hasInvestingExperience,
        investingType,
        investingBudget) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`;		
	const result = await database.query({
		text: query,
		values: [
			name,
			birthdate,
			picture,
			cep,
			cpf,
			email,
			phoneNumber,
			password,
			type,
			hasInvestingExperience,
			investingType,
			investingBudget,
		],
	});
	return result.rows.shift();
};
const getUser = async (cpf) => {
	if (!cpf) {
		return null;
	}
	const query = `SELECT * FROM users WHERE cpf = $1`;
	const result = await database.query({
		text: query,
		values: [cpf],
	});
	return result.rows.length > 0;
};
const getUserConfirmed = async (email) => {
	const query = `SELECT * FROM users INNER JOIN emailConfirmation ON users.id = emailConfirmation.id_User WHERE email = $1`;
	const result = await database.query({
		text: query,
		values: [email],
	});
	return result.rows.shift();
};
const getSupporter = async (id) => {
	const query = `SELECT id, name,birthdate,picture,cep,cpf,email,phonenumber,hasinvestingexperience,investingtype,investingbudget FROM users WHERE id =$1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};
const getSupporters = async () => {
	const query = `SELECT name, birthdate, picture, cep, cpf, email, phonenumber, 
	hasinvestingexperience, investingtype, investingbudget FROM users 
	INNER JOIN emailconfirmation ON users.id = emailconfirmation.id_user 
	WHERE type = 1 AND deleted_at IS NULL AND verified = true`;
	const result = await database.query(query);
	return result.rows;
};
const getSupporterDreams = async (id) => {
	const query = `SELECT DISTINCT table2.id as dreamid, table1.name, table2.risk, count(table3.dreamid) FROM users as table1
	INNER JOIN dreams as table2 ON table1.id = table2.userid
	INNER JOIN user_support_dream as table3 on table2.id = table3.dreamid 
	where table3.userid = $1 and table1.type = 0 GROUP BY table2.id, table1.name, table2.risk`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows;
};
const getQuotas = async (id) => {
	const query = `select userid, dreamid, count(dreamid) from user_support_dream where userid = $1 group by dreamid, userid;`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows;
};
const changeSupporter = async (
	nome,
	data,
	picture,
	cpf,
	cep,
	telefone,
	email,
	id
) => {
	if (!nome || !data || !cpf || !cep || !telefone || !email || !id) {
		return null;
	}
	const query = `UPDATE users SET name=$1,birthdate=$2,picture=$3,cep=$4,cpf=$5,email=$6,phonenumber=$7 WHERE id = $8 `;
	const result = await database.query({
		text: query,
		values: [nome, data, picture, cep, cpf, email, telefone, id],
	});
	return result.rows;
};
// Fica faltando as informações do progresso e apoiadores que serão adicionados em tasks futuras.
const getDreamers = async () => {
	const query = `SELECT a.id, a.name, a.picture, b.status, b.cashGoal, b.risk, DATE_PART('DAY', NOW() - b.expiration_date) AS expiration_date, c.dream_id, c.total_score
	FROM users AS a 
	full JOIN emailconfirmation AS d on a.id = d.id_user 
	INNER JOIN dreams AS b 	ON d.id_user = b.userid 
	INNER JOIN dream_questions AS c 
	ON b.id = c.dream_id 
	WHERE deleted_at IS NULL AND verified = true 
	ORDER BY a.id`;
	const result = await database.query(query);
	return result.rows;
};
const updateDreamer = async (
	name,
	birthdate,
	cpf,
	cep,
	telefone,
	email,
	id,
	picture
) => {
	const query = `UPDATE users SET name = $1,birthdate = $2,cep = $3,cpf = $4,email=$5,phoneNumber=$6, picture = $8 WHERE id = $7 RETURNING *`;
	const result = await database.query({
		text: query,
		values: [name, birthdate, cep, cpf, email, telefone, id, picture],
	});
	return result.rows;
};
const dreamersListByOffset = async (offset) => {
	const query = `SELECT a.id, a.name, a.picture, b.status, b.cashGoal, b.quotasquantity, b.risk, 
	DATE_PART('DAY', NOW() - b.expiration_date) AS expiration_date, c.dream_id, c.total_score 
	FROM users AS a INNER JOIN emailconfirmation AS d ON a.id = d.id_user 
	INNER JOIN dreams AS b ON d.id_user = b.userid 
	INNER JOIN dream_questions AS c ON b.id = c.dream_id 
	 WHERE deleted_at IS NULL AND verified = true ORDER BY a.id DESC LIMIT 13 OFFSET $1`;
	const result = await database.query({
		text: query,
		values: [offset],
	});
	return result.rows;
};
const deleteUser = async (id, deleted_at) => {
	const query = `DELETE FROM users WHERE id= $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows;
};
const getDreamer = async (id) => {
	const query = `SELECT name FROM users INNER JOIN dreams ON users.id = dreams.userid WHERE userid = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};

const newPassword = async (password, email) => {
	const query = `UPDATE users SET password = $1 WHERE email = $2`;
	const result = await database.query({
		text: query,
		values: [password, email],
	});
	return result.rows.shift();
};
module.exports = {
	searchUser,
	searchUserById,
	searchCompanyById,
	createUser,
	getUser,
	getUserConfirmed,
	getDreamers,
	getDreamer,
	updateDreamer,
	dreamersListByOffset,
	changeSupporter,
	getSupporters,
	getSupporter,
	getSupporterDreams,
	getQuotas,
	deleteUser,
	newPassword,
};
