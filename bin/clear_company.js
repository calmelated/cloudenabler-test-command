const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');
const padZero = require('../lib/utils').padZero;

const CLOUD_URL = 'https://tn.ksmt.co';
// const CLOUD_URL = 'https://test1.ksmt.co';

const SA_COMPANY = 'company1';
const SA_ACCOUNT = 'Admin@company1.com';
const SA_PASSWORD = 'AdminPassword';

const main = async() => {
  // Login Admin
  await http.req('Admin', 'POST', CLOUD_URL + '/api/login', {
    form: {
      company: SA_COMPANY,
      account: SA_ACCOUNT,
      password: pswd.md5(SA_PASSWORD + SA_ACCOUNT),
      force: true,
    }
  });

  let [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/company');
  if(body.companies && body.companies.length > 0) {
    for(let i = 0; i < body.companies.length; i++) {
      let companyId = body.companies[i].id;
      if(companyId + '' === '28398895') {
        continue;
      }
      await http.req('Admin', 'DELETE', CLOUD_URL + '/api/company/id/' + companyId);
    }
  }
};

main();
