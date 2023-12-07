const axios = require("axios");
const Router = require('@koa/router');
const response = require('./utils/response');

const socinalRouter = new Router();

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

socinalRouter.post('/socinalauth/token', async (ctx) => {
  try {
    const token = await getToken();
    ctx.status = 200;
    ctx.body = { token};
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

const isTokenValid = async () => {
  try {
    //func to get token
    //func2 to auth token

    if(/* is token */true) {
      if(/*!Is token valid */ false) {
        //func2 get token
      }
    }
  } catch (error) {

  }
}