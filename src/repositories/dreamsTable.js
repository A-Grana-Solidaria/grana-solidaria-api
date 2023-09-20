/* eslint-disable camelcase */
const database = require('../utils/database');

const createDream = async (status, description, estimatedcashgoal, userid) => {
	const query = {
		text: `INSERT INTO dreams (status, description, estimatedcashgoal, userid)
	VALUES ($1, $2, $3, $4) RETURNING *`,
		values: [status, description, estimatedcashgoal, userid],
	};
	const result = await database.query(query);
	return result.rows.shift();
};

const scoreDreamer = async (
	dream_id,
	question1_status,
	question2_status,
	question3_status,
	question4_status,
	question5_status,
	question6_status
) => {
	let total = 0;
	if (question1_status == 0) {
		total += 100;
	} else {
		total += 50;
	}
	if (question2_status == 0) {
		total += 100;
	} else {
		total += 50;
	}
	if (question3_status == 0) {
		total += 150;
	} else {
		total += 75;
	}
	if (question4_status == 0) {
		total += 300;
	} else {
		total += 150;
	}
	if (question5_status == 0) {
		total += 150;
	} else {
		total += 75;
	}
	if (question6_status == 0) {
		total += 200;
	} else {
		total += 100;
	}
	const query = {
		text: `INSERT INTO dream_questions (dream_id, question1_status, question2_status, question3_status, question4_status, question5_status, question6_status, total_score)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
		values: [
			dream_id,
			question1_status,
			question2_status,
			question3_status,
			question4_status,
			question5_status,
			question6_status,
			total,
		],
	};
	const result = await database.query(query);
	return result.rows;
};
const dreamsList = async () => {
	const query = `SELECT a.id, b.name,a.risk, b.picture, a.status, 
	DATE_PART('DAY', NOW() - a.expiration_date) AS expiration_date , 
	a.quotasquantity, a.description, a.estimatedCashGoal, a.cashGoal, a.userid 
	FROM dreams AS a INNER JOIN emailconfirmation AS c ON a.userid = c.id_user 
	INNER JOIN users AS b ON b.id = c.id_user 
	WHERE a.status = 1  AND b.deleted_at IS NULL AND verified = true AND DATE_PART('DAY', NOW() - a.expiration_date) <= 60
	ORDER BY a.id ASC`;
	const result = await database.query(query);
	return result.rows;
};

const dreamQuotasFilled = async (dreamId) => {
	const query = `select * from user_support_dream where dreamid = $1 group by user_support_dream.id`;
	const result = await database.query({
		text: query,
		values: [dreamId],
	});
	return result.rowCount;
};
const getScore = async (dreamId) => {
	const query = `SELECT * FROM dream_questions WHERE dream_id = $1`;
	const result = await database.query({
		text: query,
		values: [dreamId],
	});
	return result.rows.shift();
};
const totalDreams = async (userid) => {
	const query = `SELECT dreamid, count(dreamid) FROM user_support_dream WHERE userid = $1 GROUP BY dreamid ORDER BY dreamid`;
	const result = await database.query({
		text: query,
		values: [userid],
	});
	return result.rows;
};
const supporterListByOffset = async (offset) => {
	const query = `SELECT a.id, a.name, COUNT(DISTINCT c.dreamid) 
	FROM users AS a INNER JOIN emailconfirmation AS b ON a.id = b.id_user 
	FULL JOIN user_support_dream AS c ON b.id_user = c.userid 
	WHERE a.type = 1 AND deleted_at IS NULL AND verified = true 
	GROUP BY a.id, a.name ORDER BY a.id DESC 
	LIMIT 13 OFFSET $1`;
	const result = await database.query({
		text: query,
		values: [offset],
	});
	return result.rows;
};
const dreamById = async (id) => {
	const query = `SELECT *, DATE_PART('DAY', AGE(NOW(), expiration_date)) as timeleft FROM dreams WHERE id = $1 ORDER BY id ASC`;
	const result = await database.query({
		text: query,
		values: [id],
	});

	return result.rows.shift();
};

const dreamByIdUser = async (userId) => {
	const query = `SELECT * FROM dreams INNER JOIN dream_questions ON dreams.id = dream_questions.dream_id WHERE userId = $1`;
	const result = await database.query({
		text: query,
		values: [userId],
	});
	return result.rows.shift();
};
const supportDream = async (quotas, id) => {
	if (!quotas || !id) {
		return null;
	}
	const query = `UPDATE dreams SET quotasquantity = $1 WHERE id = $2`;
	const result = await database.query({
		text: query,
		values: [quotas, id],
	});
	return result.rows.shift();
};
const getDreamAndScoreById = async (id) => {
	if (!id) {
		return null;
	}
	const query = `SELECT dreams.id, dreams.status, dreams.quotasquantity, dreams.description, 
	dreams.cashgoal, dreams.estimatedcashgoal, dreams.risk, DATE_PART('DAY', NOW() - dreams.expiration_date) AS expiration_date, 
	dreams.userid, dream_questions.question1_status, dream_questions.question2_status, 
	dream_questions.question3_status, dream_questions.question4_status, 
	dream_questions.question5_status, dream_questions.question6_status, 
	dream_questions.total_score 
	FROM dreams INNER JOIN dream_questions ON dreams.id = dream_questions.dream_id 
	WHERE dreams.id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};
const updateDream = async (
	description,
	cashgoal,
	quotasquantity,
	risk,
	status,
	expiration_date,
	id
) => {
	const query = `UPDATE dreams SET status = $1, quotasquantity = $2,description = $3,cashgoal =$4 ,risk = $5,expiration_date=$6 
	WHERE id = $7`;
	const result = await database.query({
		text: query,
		values: [
			status,
			quotasquantity,
			description,
			cashgoal,
			risk,
			expiration_date,
			id,
		],
	});
	return result.rows;
};
const supportedQuotas = async (dreamid) => {
	const query = `SELECT COUNT(dreamid) FROM user_support_dream WHERE dreamid = $1;`;
	const result = await database.query({
		text: query,
		values: [dreamid],
	});
	return result.rows.shift();
};

const addSupportOnDream = async (userid, dreamid) => {
	const query = `INSERT INTO user_support_dream (userid, dreamid) VALUES ($1, $2) RETURNING *`;
	const result = await database.query({
		text: query,
		values: [userid, dreamid],
	});
	return result.rows.shift();
};
const allSupportersOnDream = async (dreamid) => {
	const query = `SELECT userid, COUNT(dreamid) FROM user_support_dream WHERE dreamid = $1 GROUP BY userid`;
	const result = await database.query({
		text: query,
		values: [dreamid],
	});
	return result.rows;
};
module.exports = {
	createDream,
	scoreDreamer,
	dreamsList,
	dreamById,
	dreamByIdUser,
	supportDream,
	getDreamAndScoreById,
	updateDream,
	totalDreams,
	supporterListByOffset,
	dreamQuotasFilled,
	getScore,
	supportedQuotas,
	addSupportOnDream,
	allSupportersOnDream,
};
