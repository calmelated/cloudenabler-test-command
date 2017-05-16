const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');
const padZero = require('../lib/utils').padZero;

const CLOUD_URL = 'https://tn.ksmt.co';
const company = 'company';
const adminAccount = 'Admin@company.com.tw';
const adminPassword = 'AdminPassword';
const devSN_1 = '28:65:6b:00:00:01';

const main = async() => {
  // Login 111 - 123@ksmt.com.tw
  let [err, resp, body] = await http.req('Admin', 'POST', CLOUD_URL + '/api/login', {
    form: {
      company: company,
      account: adminAccount,
      password: pswd.md5(adminPassword + adminAccount),
      force: true,
    }, expect: {
      resCode: 200
    }
  });

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1, {
    expect: {
      resCode: 200,
      device: {
        sn: devSN_1,
      }
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      enLog: 1,
      logFreq: 11
    }
  });

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1, {
    expect: {
      resCode: 200,
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      logFreq: 11
    }, expect: {
      resCode: 400,
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      noUsbChk: 1,
      logFreq: 11
    }, expect: {
      resCode: 200,
    }
  });

  [err, resp, body] = await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {
    form: {
      sn: devSN_1,
      PT: '32',
    }
  });
  if(body) {
    let rcmds = body.split('&');
    if(Array.isArray(rcmds) && rcmds.indexOf('DL=1') < 0) {
      throw 'Expect DL=1, but no found!';
    }
  }    

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1, {
    expect: {
      resCode: 200,
      device: {
        logFreq: 11,
      }
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      logFreq: 12
    }, expect: {
      resCode: 400,
    }
  });

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1, {
    expect: {
      resCode: 200,
      device: {
        logFreq: 11,
      }
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      noUsbChk: 1,
      noDevDL: 1,
      logFreq: 10
    }, expect: {
      resCode: 200,
    }
  });

  [err, resp, body] = await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {
    form: {
      sn: devSN_1,
      PT: '32',
    }
  });
  if(body) {
    let rcmds = body.split('&');
    if(Array.isArray(rcmds) && rcmds.indexOf('DL=1') >= 0) {
      throw 'No expect DL=1, but found!';
    }
  }

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1, {
    expect: {
      resCode: 200,
      device: {
        logFreq: 10,
      }
    }
  });
};

main();
