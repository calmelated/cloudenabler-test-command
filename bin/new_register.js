const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');
const padZero = require('../lib/utils').padZero;

//const CLOUD_URL = 'https://tn.ksmt.co';
const CLOUD_URL = 'https://test1.ksmt.co';
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
  for(let k = 0; k < 8; k++) {
    let company = 'cmp' + k;
    let cmpIdx = padZero(k.toString(16), 2);

    // Create a company 111
    let [err, resp, body] = await http.req('Guest' + k, 'POST', CLOUD_URL + '/api/company/add', {
      formData: {
        company: company,
        account: '123@ksmt.com.tw',
        password: 'Admin123',
      }, expect: {
        resCode: 200
      }
    });

    // Login 111 - 123@ksmt.com.tw
    [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/login', {
      form: {
        company: company,
        account: '123@ksmt.com.tw',
        password: pswd.md5('Admin123' + '123@ksmt.com.tw'),
        force: true,
      }, expect: {
        resCode: 200
      }
    });

    // Create User - 456@ksmt.com.tw
    [err, resp, body] = await http.req('C' + k + '-Admin', 'POST', CLOUD_URL + '/api/user/add', {
      formData: {
        account: '456@ksmt.com.tw',
        password: 'Admin123',
        admin: 1,
        name: '456',
        pushType: 3,
      } , expect: {
        resCode: 200
      }
    });

    for(let i = 0; i < 100;) {
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

    for(let i = 0; i < 100;) {
      let sn = '28:65:6b:00:' + cmpIdx + ':' + padZero(i.toString(16), 2);
      // console.log('comp=' + company + ', sn=' + sn);
      [err, resp, body] = await http.req('SuperAdmin', 'GET', CLOUD_URL + '/api/device/fake/reg?sn=' + sn + '&num=128');
      if(resp.statusCode === 200) {
        i++;
      }
    }
  }

  // for(let i = 40001; i <= 40005; i++) {
  //     [err, resp, body] = await http.req('C1-Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
  //         formData: {
  //             sn: '22:22:22:22:22:22',
  //             mbusAction: 'ADD',
  //             mbusDesc: i.toString(),
  //             mbusType: 0,
  //             mbusHaddr: i.toString(),
  //             mbusLaddr: '',
  //             mbusEnlog: 0,
  //         }
  //     });

  //     [err, resp, body] = await http.req('C1-Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
  //         formData: {
  //             sn: '88:88:88:88:88:88',
  //             mbusAction: 'ADD',
  //             mbusDesc: i.toString(),
  //             mbusType: 0,
  //             mbusHaddr: i.toString(),
  //             mbusLaddr: '',
  //             mbusEnlog: 0,
  //         }
  //     });
  // }

  // for(let i = 1400001; i <= 1400100; i+=2) {
  //     [err, resp, body] = await http.req('C1-Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
  //         formData: {
  //             sn: '88:88:88:88:88:88',
  //             mbusAction: 'ADD',
  //             mbusDesc: i.toString(),
  //             mbusType: 2,
  //             mbusHaddr: i.toString(),
  //             mbusLaddr: (i + 1).toString(),
  //             mbusEnlog: 0,
  //         }
  //     });
  // }
};

main();
