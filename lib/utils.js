
const prj = require('../config');

module.exports.toJson = (jStr) => {
  if(!jStr) { 
    return; 
  } else if(jStr === '{}') {
    return {};
  }
  try {
    return JSON.parse(jStr);
  } catch (e) {
    // console.log(e.stack);
  }
}; 

module.exports.toJsonStr = (json) => {
  if(!json) {
    return;
  }
  try {        
    return JSON.stringify(json);
  } catch (e) {
    // console.log(e.stack);
  }
}; 

module.exports.padZero = (num, size) => {
  let s = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};
