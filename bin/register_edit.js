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


  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    formData: {
      sn: devSN_1,
      enLog: 1,
    }, expect : {
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
  let mbusId;
  for(let reg of body.device.modbus) {
    if(reg.haddr === '40001') {
      mbusId = reg.id;
      console.log('Reg addr = ' + reg.haddr + ', upper-bound = ' + reg.up + ', id = ' + reg.id + ', enLog = ' + body.device.enLog);
    }
  }

  [err, resp, body] = await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {
    form: {
      sn: devSN_1,
      PT: '32',
      40001: 'ff',
    }
  });

  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1 + '/status?addr=40001', {
    // output: true,
    expect: {
      resCode: 200,
    }
  });
  if(body.iostats[0]) {
    // console.log(body.iostats[0].haddr + '-' + body.iostats[0].laddr + ' = ' + body.iostats[0].hval + '-' + body.iostats[0].lval);
    if(typeof body.iostats[0].hval === 'undefined') {
      throw 'Addr ' + body.iostats[0].haddr + ' should have value = ' + body.iostats[0].hval;
    }
  } else {
    throw 'Addr ' + body.iostats[0].haddr + ' should have value = ' + body.iostats[0].hval;
  }

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    // output: true,
    formData: {
      sn: devSN_1,
      mbusAction: 'EDIT',
      mbusId: mbusId,
      mbusHaddr: '40001',
      mbusLaddr: '',            
      mbusDesc: '40001',
      mbusType: 0,
      mbusEnlog: 0,
      mbusUp: 22,
    }, expect : {
      resCode: 400
    }
  });

  [err, resp, body] = await http.req('Admin', 'PUT', CLOUD_URL + '/api/device/edit', {
    // output: true,
    formData: {
      sn: devSN_1,
      noDevDL: 1,
      noRstVal: 1,
      noUsbChk: 1,
      mbusAction: 'EDIT',
      mbusId: mbusId,
      mbusHaddr: '40001',
      mbusLaddr: '',            
      mbusDesc: '40001',
      mbusType: 0,
      mbusEnlog: 0,
    }
  });
  
  [err, resp, body] = await http.req('Admin', 'GET', CLOUD_URL + '/api/device/' + devSN_1 + '/status?addr=40001', {
    // output: true,
    expect: {
      resCode: 200,
    }
  });
  if(body.iostats[0]) {
    // console.log(body.iostats[0].haddr + '-' + body.iostats[0].laddr + ' = ' + body.iostats[0].hval + '-' + body.iostats[0].lval);
    if(typeof body.iostats[0].hval === 'undefined') {
      throw 'Addr ' + body.iostats[0].haddr + ' should have value = ' + body.iostats[0].hval;
    }
  } else {
    throw 'Addr ' + body.iostats[0].haddr + ' should have value = ' + body.iostats[0].hval;
  }
   
  [err, resp, body] = await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {
    form: {
      sn: devSN_1,
      PT: '32',
    }
  });
  if(body) {
    let rcmds = body.split('&');
    if(Array.isArray(rcmds)) { 
      if(rcmds.indexOf('DL=1') >= 0) {
        throw 'No expect DL=1, but found!';
      } else if(rcmds.indexOf('40001=-') >= 0) {
        throw 'No expect 40001=-, but found!';
      }
    } 
  }
};

main();
