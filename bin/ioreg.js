const prj = require('../config');
const http = require('../lib/http');
const pswd = require('../lib/pswd');
const padZero = require('../lib/utils').padZero;

const CLOUD_URL = 'http://192.168.191.254';

const main = async() => {
  let form = {
    sn: '28:65:6b:00:00:01',
    PT: 'A',
  };
  for(let addr = 40001; addr < 40256; addr++) {
     form[addr] = parseInt((Math.random() * 1000)).toString(16);
  }
  await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {form});

  form = {
    sn: '28:65:6b:00:00:02',
    PT: 'A',
  };
  await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {form});

  form = {
    sn: '28:65:6b:00:00:00',
    PT: 'A',
  };
  await http.req('Guest', 'POST', CLOUD_URL + '/ioreg', {form});

};

main();
setInterval(main, 180000);
//setInterval(main, 1000);
