const response = require('../../utils/response');
const companyTable = require('../../repositories/companyTable');
require('dotenv').config();

const listAssociatesByCompanyId = async (ctx) => {
	const { offset } = ctx.query;
	const companyId = ctx.params.id;



	if (offset && companyId) {
		const associates = await companyTable.getAssociatesByCompanyId(companyId);
		const totalPages = Math.ceil(associates.length / 13);
		const numberPage = Math.floor(offset / 13 + 1);

		const associatesFiltered = await companyTable.associatesListByOffsetAndCompanyId(offset, companyId);

		const associatesList = [];
		for (y = 0; y < associatesFiltered.length; y++) {
			const singleAssociate = {
				id: associatesFiltered[y].id,
				name: associatesFiltered[y].name,
				cpf: associatesFiltered[y].cpf,
				companyAdm: associatesFiltered[y].company_adm,
				signs: associatesFiltered[y].signs_for_company,
			};
			associatesList.push(singleAssociate);
		}
		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			totalDeSocios: associates.length,
			socios: associatesList,
		});
	}
	return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
};
const getAssociate = async (ctx) => {	
	const { id } = ctx.params;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}

	const companyDB = await companyTable.getAssociateById(id);
	if (!companyDB) {
		return response(ctx, 400, { mensagem: 'Esse sócio não existe!' });
	}

	const associateData = {
		id: companyDB.id,
		name: companyDB.name,
		cpf: companyDB.cpf,
		companyid: companyDB.company_id,
		mothersname: companyDB.mothers_name,
		politicallyexposed: companyDB.politically_exposed,
		companyadm: companyDB.company_adm,
		signsforcompany: companyDB.signs_for_company,
		addressid: companyDB.address_id,
		cep:companyDB.cep,
		numero:companyDB.number,
		address:companyDB.address,
		complement:companyDB.complement,
		city:companyDB.city,
		neighborhood:companyDB.neighborhood,
		state:companyDB.state,
		country:companyDB.country,
	};
	if (associateData) {
		return response(ctx, 200, associateData);
	}
}

const getCompany = async (ctx) => {
	const { id } = ctx.params;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}

	const companyDB = await companyTable.getCompanyById(id);
	if (!companyDB) {
		return response(ctx, 400, { mensagem: 'Essa empresa não existe!' });
	}

	const companyData = {
		id: companyDB.id,
		cnpj: companyDB.cnpj,
		razaosocial: companyDB.razaosocial,
		nomefantasia: companyDB.nomefantasia,
		cellphone: companyDB.cellphone,
		tellphone: companyDB.tellphone,
		inscricaoestadual: companyDB.inscricaoestadual,
		instagram: companyDB.instagram,
		website: companyDB.website,
		openingdate: companyDB.opening_date,
		cep: companyDB.cep,
		numero: companyDB.numero,
		complemento: companyDB.complemento,
		logradouro: companyDB.logradouro,
		bairro: companyDB.bairro,
		cidade: companyDB.cidade,
		estado: companyDB.estado,
		pais: companyDB.pais
	};
	if (companyData) {
		return response(ctx, 200, companyData);
	}
}

const listCompanies = async (ctx) => {
	const { offset } = ctx.query;
	if (offset) {
		const companies = await companyTable.getCompanies();
		const totalPages = Math.ceil(companies.length / 13);
		const numberPage = Math.floor(offset / 13 + 1);

		const companiesFiltered = await companyTable.companiesListByOffset(offset);
		const companiesList = [];
		for (y = 0; y < companiesFiltered.length; y++) {
			const singleCompany = {
				id: companiesFiltered[y].id,
				razaoSocial: companiesFiltered[y].razaosocial,
				nomeFantasia: companiesFiltered[y].nomefantasia,
				cnpj: companiesFiltered[y].cnpj,
			};
			companiesList.push(singleCompany);
		}

		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			totalDeEmpresass: companies.length,
			empresas: companiesList,
		});
	}
	return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
};


const getCompanies = async (ctx) => {
	if (ctx.state.type === 1) {
		const { offset } = ctx.query;
		const numberPage = Math.floor(offset / 5 + 1);
		const companiesFiltered = await CompanyTable.companiesList();
		const newCompany = [];
		let count = 0;
		// eslint-disable-next-line no-restricted-syntax
		const totalPages = Math.ceil((companiesFiltered.length - count) / 5);
		const companiesOrdered = newCompany.sort((a, b) => {
		});
		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			empresas: companiesOrdered.slice(offset, offset + 5),
		});
	}
}

const getAssociatesByCompanyId = async (ctx) => {//como usar offset apenas dos socios daquela empresa? TODO
	const { offset } = ctx.query;
	const { id } = ctx.params;

	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}

	if (offset) {
		const associates = await companyTable.getAssociatesByCompanyId(id);
		const totalPages = Math.ceil(associates.length / 13);
		const numberPage = Math.floor(offset / 13 + 1);

		const associatesFiltered = await companyTable.associatesListByOffset(offset);
		const associatesList = [];
		for (y = 0; y < associatesFiltered.length; y++) {
			const singleAssociate = {
				id: associatesFiltered[y].id,
				nome: associatesFiltered[y].nome,
				cpf: associatesFiltered[y].cpf,
				socioadministrador: associatesFiltered[y].socioadministrador,
				assina: associatesFiltered[y].assina
			};
			associatesList.push(singleAssociate);
		}

		return response(ctx, 200, {
			paginaAtual: numberPage,
			totalDePaginas: totalPages,
			totalDeEmpresass: companies.length,
			socios: associatesList,
		});
	}
	return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
}

const updateCompany = async (ctx) => {
	const { id } = ctx.params;
	let {
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
	} = ctx.request.body;

	if (
		!cnpj ||
		!razaosocial ||
		!nomefantasia  ||
		!cellphone  ||
		!tellphone  ||
		!inscricaoestadual  ||
		!openingdate  ||
		!cep  ||
		!numero  ||
		!complemento  ||
		!logradouro  ||
		!bairro  ||
		!cidade  ||
		!estado ||
		!pais
	) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const companyDB = await companyTable.updateCompany(
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
		id,
	);
	return response(ctx, 200, { mensagem: 'Empresa alterada com sucesso!' });
};

const deleteCompany = async (ctx) => {
	const { id = null } = ctx.params;
	const deleted_date = new Date();
	if (!id) {
		return response(ctx, 400, { mensagem: 'Erro de requisição' });
	}
	const deleteDB = await companyTable.deleteCompany(id, deleted_date);

	return response(ctx, 200, 'Deletado com sucesso!');
};


module.exports = {
	getAssociatesByCompanyId,
	getCompanies,
	listCompanies,
	getCompany,
	listAssociatesByCompanyId,
	getAssociate,
	updateCompany,
	deleteCompany
}