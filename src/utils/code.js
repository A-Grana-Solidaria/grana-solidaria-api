const emailValidator = (email) => {
	if (
		email.includes('@') &&
		email.includes('.') &&
		email.includes('.', email.indexOf('@'), email.length - 1)
	) {
		if (
			email[0] === '.' ||
			email[email.length - 1] === '.' ||
			email.includes(' ')
		) {
			return false;
		}
		return true;
	}
	return false;
};

module.exports = { emailValidator };
