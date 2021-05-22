const axios = require('axios');
const querystring = require('querystring');
const response_code = require('./response_code.json')

function sendSMS({number, text, time}) {
  this.API_ID = process.env.SMS_TOKEN;
  this.isTest = process.env.DEVELOPMENT === 'TRUE';
  const params = {
    api_id: this.API_ID,
    to: number,
    msg: text,
    time,
    json: 1,
    test: +this.isTest
  };
  return axios.get(`https://sms.ru/sms/send?${querystring.stringify(params)}`);
}


module.exports = sendSMS;
