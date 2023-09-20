/* eslint-disable camelcase */
const database = require('../utils/database');

const createEmailConfirmation = async (emailToken, id_User) => {
	if (!emailToken || !id_User) {
		return null;
	}

	const query = `INSERT INTO emailConfirmation(emailToken, id_User) VALUES($1,$2) RETURNING *`;
	const result = await database.query({
		text: query,
		values: [emailToken, id_User],
	});
	return result.rows;
};
const getEmail = async (emailToken) => {
	if (!emailToken) {
		return null;
	}
	const query = `SELECT * FROM emailconfirmation WHERE emailToken = $1`;
	const result = await database.query({
		text: query,
		values: [emailToken],
	});
	return result.rows.length > 0;
};
const changeStatus = async (id) => {
	const query = `UPDATE emailconfirmation SET verified = true WHERE id_user = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows;
};

module.exports = { createEmailConfirmation, getEmail, changeStatus };
