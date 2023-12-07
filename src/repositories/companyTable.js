const database = require('../utils/database');

const searchCompanyById = async (id) => {
	const query = `SELECT * FROM cnpj_entrepreneur_register WHERE id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};

const getAssociatesByCompanyId = async (id) => {
	if (!id) {
		return null;
	}

	const query = {text:`SELECT a.id, a.name, a.cpf, a.company_adm , a.signs_for_company
	FROM associate a
	WHERE company_id = $1
	ORDER BY a.id`,
	values:[id],
	};
	const result = await database.query(query);
	return result.rows;
};

const associatesListByOffsetAndCompanyId = async (offset, id) => {
	if (!id) {
		return null;
	}
	const query ={text: `SELECT a.id, a.name, a.cpf, a.company_adm , a.signs_for_company
	FROM associate a
	WHERE company_id = $1
	ORDER BY a.id DESC LIMIT 13 OFFSET $2`,
	values:[id, offset],
	};	
	const result = await database.query(query);
	return result.rows;
};

const getCompanyById = async (id) => {
	if (!id) {
		return null;
	}
	// , to_char(company.opening_date, 'DD/MM/YYYY') AS opening_date, company.instagram
	const query = `SELECT company.id, company.razaosocial
											, company.nomefantasia, company.cellphone
											, company.tellphone, company.inscricaoestadual
											
											, CAST(company.opening_date as text) AS opening_date, company.instagram
											, company.website,company.cnpj
											, address.cep, address.numero
											, address.complemento, address.logradouro
											, address.bairro, address.cidade
											, address.estado, address.pais
	FROM cnpj_entrepreneur_register company
	INNER JOIN cnpj_entrepreneur_register_adress address ON company.id = address.company_id
	WHERE company.id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});

	return result.rows.shift();
};

const getAssociateById = async (id) => {
	if (!id) {
		return null;
	}
	const query = `SELECT a.id, a.name
											, a.company_id, a.mothers_name
											, a.politically_exposed, a.company_adm
											, a.signs_for_company, a.cpf
											, ad.id as address_id, ad.cep
											, ad.cep, ad.number
											, ad.address
											, ad.complement, ad.city
											, ad.neighborhood
											, ad.state, ad.country
	FROM associate a
	LEFT JOIN associate_adress ad ON a.id = ad.associate_id
	WHERE a.id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});

	return result.rows.shift();
};

const updateCompany = async (
	cnpj,
	razaosocial,
	nomefantasia,
	cellphone,
	tellphone,
	inscricaoestadual,
	instagram,
	website,
	openingdate,
	cep,
	numero,
	complemento,
	logradouro,
	bairro,
	cidade,
	estado,
	pais,
	id
) => {
	
	const queryRegister = `UPDATE cnpj_entrepreneur_register SET 
	  cnpj = $1, razaosocial = $2
	, nomefantasia = $3, cellphone = $4
	, tellphone = $5, inscricaoestadual = $6
	, instagram = $7, website = $8, opening_date = $9
	WHERE id = $10`;

	const queryAdress = `UPDATE cnpj_entrepreneur_register_adress SET
	cep = $1, numero = $2
	, complemento = $3, logradouro = $4
	, bairro = $5, cidade = $6
	, estado = $7, pais = $8
	WHERE company_id = $9`;


	const resultAdress = await database.query({
		text: queryAdress,
		values: [
			cep,
			numero,
			complemento,
			logradouro,
			bairro,
			cidade,
			estado,
			pais,
			id,
		],
	});
	
	const result = await database.query({
		text: queryRegister,
		values: [
			cnpj,
			razaosocial,
			nomefantasia,
			cellphone,
			tellphone,
			inscricaoestadual,
			instagram,
			website,
			openingdate,
			id,
		],
	});
	
	return result.rows;
};

const companiesList = async () => {
		const query = `		
		SELECT a.id
		, a.razaosocial
		, a.nomefantasia
		, a.cnpj
			FROM cnpj_entrepreneur_register a
			WHERE deleted_at IS NULL
		ORDER BY a.id`;//ToDO email confirmation
		const result = await database.query(query);
		return result.rows;
};

const companiesListByOffset = async (offset) => {
	const query = `		SELECT a.id
	, a.razaosocial
	, a.nomefantasia
	, a.cnpj
		FROM cnpj_entrepreneur_register a
		WHERE deleted_at IS NULL
	ORDER BY a.id DESC LIMIT 13 OFFSET $1`;
	const result = await database.query({
		text: query,
		values: [offset],
	});
	return result.rows;
};

const getCompanies = async () => {
	const query = `SELECT a.id, a.nomefantasia, a.razaosocial, a.cnpj 
	FROM cnpj_entrepreneur_register a
	WHERE deleted_at IS NULL
	ORDER BY a.id`;//TODO: refinar query para validações
	const result = await database.query(query);
	return result.rows;
};

const deleteCompany = async (id, deleted_at) => {
	const query = `UPDATE cnpj_entrepreneur_register SET deleted_at = $2 WHERE id = $1`;
	const result = await database.query({
		text: query,
		values: [id, deleted_at],
	});
	return result.rows;
};

module.exports = {
  searchCompanyById,
	companiesList,
	getCompanies,
	companiesListByOffset,
	getCompanyById,
	getAssociatesByCompanyId,
	associatesListByOffsetAndCompanyId,
	getAssociateById,
	updateCompany,
	deleteCompany,
}

//ToDO; separar em outros arquivos para cada tabela