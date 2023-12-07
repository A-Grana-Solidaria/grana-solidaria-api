const axios = require("axios");
const Router = require('@koa/router');

const socinalRouterBase = new Router();

axios.defaults.baseURL = 'https://baas-staging.socinal.com.br/api/v1';
axios.defaults.headers.post['accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const instance = axios.create({
});

const getToken = async () => {
  try {
    const response = await instance.post('auth/token',  {
      username: 'GRANASOL',
      password: 'GR4N4S0LSCNL',
      ttl: '0'
    });
    return response.data.Token;
  } catch (error) {
    throw error;
  }
};

socinalRouterBase.post('/socinalauth/token', async (ctx) => {
  try {
    const token = await getToken();
    ctx.status = 200;
    ctx.body = { token};
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

module.exports = socinalRouterBase;