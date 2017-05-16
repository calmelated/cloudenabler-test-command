const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');
const padZero = require('../lib/utils').padZero;

// const CLOUD_URL = 'https://tn.ksmt.co';
const CLOUD_URL = 'https://test1.ksmt.co';

const SA_COMPANY = 'company1';
const SA_ACCOUNT = 'Admin@company1.com';
const SA_PASSWORD = 'AdminPassword';


const main = async() => {
  // Login SuperAdmin
  await http.req('Admin', 'POST', CLOUD_URL + '/api/login', {
    form: {
      company: SA_COMPANY,
      account: SA_ACCOUNT,
      password: pswd.md5(SA_PASSWORD + SA_ACCOUNT),
      force: true,
    }
  });

  await http.req('Admin', 'GET', CLOUD_URL + '/api/company', {output: true});    
};

main();
