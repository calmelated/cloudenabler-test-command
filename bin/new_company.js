
const prj = require('./config');
const http = require('./lib/http');
const pswd = require('./lib/pswd');

const main = async() => {
  let [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/company/789');
  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/login/status');
  [err, resp, body] = await http.req('C1-Admin', 'POST', prj.CLOUD_URL + '/api/login', {
      form: {
        company: '789',
        account: '123@ksmt.com.tw',
        password: pswd.md5('Admin123' + '123@ksmt.com.tw'),
        force: true,
      }
  });

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/user/123@ksmt.com.tw');

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/company/789');

  let companyId_789 = body.company.id;
  [err, resp, body] = await http.req('C1-Admin', 'PUT', prj.CLOUD_URL + '/api/company/edit', {
      formData: {
        companyId: companyId_789,
        agent: '789-agent',
        ct_name: '789@ct_name',
        ct_email: '789@ct_email',
        ct_phone: '789@ct_phone',
        ct_company: '789@ct_company',
      }
  });

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/company/789', {
      expect: {
        desc: 'OK',
        company: {
          id: companyId_789,
          extra: {
            ct_name: '789@ct_name',
            ct_email: '789@ct_email',
            ct_phone: '789@ct_phone',
            ct_company: '789@ct_company',
          }
        },
      }
  });

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/device');

  [err, resp, body] = await http.req('C1-Admin', 'POST', prj.CLOUD_URL + '/api/user/add', {
      formData: {
        account: '456@ksmt.com.tw',
        password: 'Admin123',
        admin: 1,
        name: '456',
        pushType: 3,
      }
  });

  [err, resp, body] = await http.req('C1-Admin', 'PUT', prj.CLOUD_URL + '/api/user/edit', {
      formData: {
        account: '456@ksmt.com.tw',
        name: '456-new',
      }
  });

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/user', {
    expect: {
        users: [{
          account: '456@ksmt.com.tw',
          name: '456-new',
        }],
      }
    }
  );

  [err, resp, body] = await http.req('C1-Admin', 'PUT', prj.CLOUD_URL + '/api/user/lang', {
      formData: {
        account: '456@ksmt.com.tw',
        lang: 'a_TW',
      }, 
      expect: {
        resCode: 400, 
      }
    }
  );

  [err, resp, body] = await http.req('C1-Admin', 'PUT', prj.CLOUD_URL + '/api/user/lang', {
    formData: {
        account: '456@ksmt.com.tw',
        lang: 'zh_TW',
      }
    }
  );

  [err, resp, body] = await http.req('C1-User-456', 'POST', prj.CLOUD_URL + '/api/login', {
      form: {
        company: '789',
        account: '456@ksmt.com.tw',
        password: pswd.md5('Admin123' + '456@ksmt.com.tw'),
        force: true,
      }
    }
  );

  [err, resp, body] = await http.req('C1-User-456', 'GET', prj.CLOUD_URL + '/api/user/' + '456@ksmt.com.tw');

  [err, resp, body] = await http.req('C1-Admin', 'PUT', prj.CLOUD_URL + '/api/user/lang', {
    formData: {
      account: '456@ksmt.com.tw',
      lang: 'en_US',
    } 
  });

  [err, resp, body] = await http.req('C1-User-456', 'GET', prj.CLOUD_URL + '/api/user/' + '456@ksmt.com.tw', {
    expect: {
      user: {
        lang: 'en_US',
      }
    }        
  });

  [err, resp, body] = await http.req('C1-Admin', 'DELETE', prj.CLOUD_URL + '/api/user/' + '456@ksmt.com.tw');

  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/user/' + '456@ksmt.com.tw', {
    expect: {
      resCode: 404
    }        
  });

  [err, resp, body] = await http.req('C1-Admin', 'DELETE', prj.CLOUD_URL + '/api/company/id/' + companyId_789);
  [err, resp, body] = await http.req('C1-Admin', 'GET', prj.CLOUD_URL + '/api/user');
  [err, resp, body] = await http.req('C1-User-456', 'GET', prj.CLOUD_URL + '/api/user');

};

main();
