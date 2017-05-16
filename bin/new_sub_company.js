const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');

const main = async() => {
  let [err, resp, body] = await http.req('C1-Admin', 'POST', prj.CLOUD_URL + '/api/login', {
      form: {
        company: 'cmp0',
        account: '123@ksmt.com.tw',
        password: pswd.md5('Admin123' + '123@ksmt.com.tw'),
        force: true,
      }
    }
  );

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/company/cmp0');

  let parentId = body.company.id;
  for(let i = 300; i < 1000; i++) {
    let company = 'cmp' + i;
    [err, resp, body] = await http.req('C1-Admin', 'POST', prj.CLOUD_URL + '/api/company/add', {
        formData: {
          parentId: parentId,
          company: company,
          account: '123@ksmt.com.tw',
          password: 'Admin123',
        }
      }
    );

    [err, resp, body] = await http.req('C2-Admin', 'POST', prj.CLOUD_URL + '/api/login', {
        form: {
          company: company,
          account: '123@ksmt.com.tw',
          password: pswd.md5('Admin123' + '123@ksmt.com.tw'),
          force: true,
          pushType: 21,
          pushId: 'c3412a6e3e00f1eefdasa9e3008d2bc7',
        }
      }
    );

    [err, resp, body] = await http.req('C2-Admin', 'POST', prj.CLOUD_URL + '/api/user/add', {
        formData: {
          account: '456@ksmt.com.tw',
          password: 'Admin123',
          admin: 1,
          name: '456',
        }
      }
    );

    [err, resp, body] = await http.req('C2-Admin', 'POST', prj.CLOUD_URL + '/api/user/add', {
        formData: {
          account: '789@ksmt.com.tw',
          password: 'Admin123',
          admin: 1,
          name: '789',
        }
      }
    );

    [err, resp, body] = await http.req('C2-Admin', 'POST', prj.CLOUD_URL + '/api/login', {
        form: {
          company: company,
          account: '456@ksmt.com.tw',
          password: pswd.md5('Admin123' + '456@ksmt.com.tw'),
          force: true,
          pushType: 21,
          pushId: 'c3445a683e00f9eedda8a9e300872bc7',
        }
      }
    );

    [err, resp, body] = await http.req('C2-Admin', 'POST', prj.CLOUD_URL + '/api/login', {
        form: {
          company: company,
          account: '789@ksmt.com.tw',
          password: pswd.md5('Admin123' + '789@ksmt.com.tw'),
          force: true,
          pushType: 21,
          pushId: 'c2412a6e2e00f9eedda8a9e300872bc7',
        }
      }
    );
  }
};

main();
