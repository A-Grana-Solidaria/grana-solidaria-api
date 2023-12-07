const axios = require("axios");
const Router = require('@koa/router');

const socinalRouterDocumentacao = new Router();

axios.defaults.baseURL = 'https://baas-staging.socinal.com.br/api/v1';
axios.defaults.headers.post['accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const instance = axios.create({
  headers: {'accept':'application/json'}
});

//Enviar documentos gerais
socinalRouterDocumentacao.post('/documentos', async (ctx) => {
  try {
    const fileBase64 = ctx.request.body.fileBase64;
    const fileName = ctx.request.body.name; 
    const token = ctx.request.header.authorizationsocinal; 
    const response = await instance.post('/documentos', {
      file_base64: fileBase64,
      name: fileName
    },
    {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    ctx.status = 200;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.response.data;
  }
})

//Enviar documento de proposta
socinalRouterDocumentacao.post('/emprestimo/documentos', async (ctx) => {
  try {
    const fileBase64 = ctx.request.body.fileBase64;
    const ccbNumber = ctx.request.body.ccb_number; 
    const token = ctx.request.header.authorizationsocinal; 
    const response = await instance.post('/emprestimo/documentos', {
      file_base64: fileBase64,
      ccb_number: ccbNumber,
      document_type: "ccb"
    },
    {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    ctx.status = 200;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.response.data;
  }
})

//Enviar documento do cliente
socinalRouterDocumentacao.post('/clientes/documentos', async (ctx) => {
  try {
    const documentType = ctx.request.body.document_type; 
    const fileBase64 = ctx.request.body.fileBase64;
    const ownerIdentification = ctx.request.body.owner_identification;
    const token = ctx.request.header.authorizationsocinal; 
    const response = await instance.post('/clientes/documentos', {
      document_type: documentType,
      file_base64: fileBase64,
      owner_identification: ownerIdentification,
    },
    {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    ctx.status = 200;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.response.data;
  }
})
module.exports = socinalRouterDocumentacao;