
const fs = require('fs');
const prj = require('../config');
const toJson = require('../lib/utils').toJson;
const toJsonStr = require('../lib/utils').toJsonStr;
const request = require('request');

// load previous cookies
try {
  prj.SET_COOKIE = toJson(fs.readFileSync('.cookies'));
} catch(e) {
  prj.SET_COOKIE = {};
}

const setCookie = (user, url) => {    
  if(!prj.SET_COOKIE[user] || !user || user.match(/guest/i)) {
    return;
  }
  let jarStr = '';
  let keys = Object.keys(prj.SET_COOKIE[user]);
  for(let i = 0; i < keys.length; i++) {
    jarStr += (i === 0) ? '' : ';';
    jarStr += keys[i] + '=' + prj.SET_COOKIE[user][keys[i]];
  }
  // console.log('SEND==>' + jarStr);
  if(jarStr.length > 0) {
    return request.cookie(jarStr);
  }
};

const saveSetCookie = (user, httpResp) => {
  if(!httpResp || !httpResp.headers['set-cookie'] || !user || user.match(/guest/i)) {
    return;
  }
  let cookieStr = '';
  let cookies = httpResp.headers['set-cookie'];
  // console.log('GET');
  // console.dir(cookies);

  prj.SET_COOKIE[user] = prj.SET_COOKIE[user] || {};
  for(let i = 0; i < cookies.length; i++) {
    let [key, val] = cookies[i].split(';')[0].split('=');
    prj.SET_COOKIE[user][key] = val;
  }

  console.log('Save cookies to .cookies ' + toJsonStr(prj.SET_COOKIE));
  fs.writeFileSync('.cookies', toJsonStr(prj.SET_COOKIE));
};

const checkExpect = (expect, body) => {
  if(!body) { return 'No reponse data!'; }
  for(let key in expect) {
    if(Array.isArray(expect[key])) {
      if(expect[key].length === 0) {
        if(body[key] && Array.isArray(body[key]) && body[key].length === 0) {
          return null;
        } else {
          return '1. Expected[' + key + ']: ' + expect[key] + ' Get[' + key + ']: ' + body[key]; 
        }
      } else if(typeof expect[key][0] === 'object') { // [{a:1, b:2}]
        for(let i = 0; i < expect[key].length; i++) {
          let foundErr = true;
          for(let j = 0; j < body[key].length; j++) {
            foundErr = checkExpect(expect[key][i], body[key][j]);
            if(!foundErr) {
              break;
            }
          }
          if(foundErr) {
            return '2. Expected[' + key + '][' + i + '], but not found in body[' + key + ']'; 
          }
        }
      } else { // [1,2,3] or ['1','2','3']
        if(toJsonStr(expect[key].sort()) === toJsonStr(body[key].sort())) {
          return null;
        } else {
          return '3. Expected[' + key + ']: ' + expect[key] + ' Get[' + key + ']: ' + body[key]; 
        }
      }       
    } else if(typeof expect[key] === 'object') {
      let err = checkExpect(expect[key], body[key]);
      if(err) { 
        return err; 
      }
    } else if(expect[key] !== body[key]) { // string compare
      return '4. Expected[' + key + ']: ' + expect[key] + ' Get[' + key + ']: ' + body[key]; 
    }
  }
  return null;
};

module.exports.req = (user, method, url, data) => {
  return new Promise((resolve, reject) => {
    let opts = {url, method, headers: { Cookie: setCookie(user, url) } };
    if(data && typeof data.form !== 'undefined') { opts.form = data.form; }
    if(data && typeof data.formData !== 'undefined') { opts.formData = data.formData; }

    let req = request(opts, (err, httpResp, body) => {
      saveSetCookie(user, httpResp);
      body = (httpResp.request.path.match(/\/ioreg|\/api\/ioreg/)) ? body.split('\r\n')[0] : body;

      let jbody = toJson(body);
      let desc = (!jbody || typeof jbody !== 'object') ? body : jbody.desc ;
      body = (!jbody || typeof jbody !== 'object') ? body : jbody;
      console.log('[' + user + '] ' + method + ' ' + httpResp.request.path + ' -> ' + httpResp.statusCode + ' ' + desc);
      if(data && data.output) {
        console.dir(body);
      }
      if(data && data.expect) {
        if(data.expect.resCode && data.expect.resCode !== httpResp.statusCode) {
          return reject('Expected code: ' + data.expect.resCode + ', Get: ' + httpResp.statusCode);
        } 
        delete data.expect.resCode;
        let errMsg = checkExpect(data.expect, body);
        if(errMsg) {
          return reject(errMsg);
        }
      }
      return resolve([err, httpResp, body]);
    });
    // console.dir(req.headers);
  });    
};

process.on("unhandledRejection", (e) => {
  console.log(e);
});
