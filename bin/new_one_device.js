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
  // Login SuperAdmin
  await http.req('SuperAdmin', 'POST', CLOUD_URL + '/api/login', {
    form: {
      company: SA_COMPANY,
      account: SA_ACCOUNT,
      password: pswd.md5(SA_PASSWORD + SA_ACCOUNT),
      force: true,
    }
  });

  // Create companies
  for(let k = 0; k < 1; k++) {
    let company = 'cmp' + k;
    let cmpIdx = padZero(k.toString(16), 2);

    // Create a company 111
    let [err, resp, body] = await http.req('Guest' + k, 'POST', CLOUD_URL + '/api/company/add', {
      formData: {
        company: company,
        account: '123@ksmt.com.tw',
        password: 'Admin123',
      // }, expect: {
        // resCode: 200
      }
    });

    // Login 111 - 123@ksmt.com.tw
    [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/login', {
      form: {
        company: company,
        account: '123@ksmt.com.tw',
        password: pswd.md5('Admin123' + '123@ksmt.com.tw'),
        force: true,
      // }, expect: {
      //     resCode: 200
      }
    });

    // Create User - 456@ksmt.com.tw
    [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/user/add', {
      formData: {
        account: '456@ksmt.com.tw',
        password: 'Admin123',
        admin: 1,
        name: '456',
      // } , expect: {
      //     resCode: 200
      }
    });

    let sn = '28:65:6b:00:' + cmpIdx + ':00';
    [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/device/add', {
      formData: {
        sn: sn,
        name: sn,
        mo: '63515',
        pollTime: 50,
      }
    });
    for(let i = 1; i < 3;) {
      // Create Device - 28:65:6b:00:00:01
      let sn = '28:65:6b:00:' + cmpIdx + ':' + padZero(i.toString(16), 2);
      // console.log('comp=' + company + ', sn=' + sn);
      [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/device/add', {
        formData: {
          sn: sn,
          name: sn,
          mo: '63514W',
          pollTime: 50,
        }
      });

      [err, resp, body] = await http.req('C' + k + '-Admin', 'GET', CLOUD_URL + '/api/device/' + sn);
      if(resp.statusCode === 200) {
        i++;
      }
    }

    for(let i = 1; i < 3;) {
      let sn = '28:65:6b:00:' + cmpIdx + ':' + padZero(i.toString(16), 2);
      // console.log('comp=' + company + ', sn=' + sn);
      [err, resp, body] = await http.req('SuperAdmin', 'GET', CLOUD_URL + '/api/device/fake/reg?sn=' + sn + '&num=3');
      if(resp.statusCode === 200) {
        i++;
      }
    }
  }
};

main();
