import axios from 'axios';
let util = {};
const ajaxUrl = process.env.NODE_ENV === 'development'
  // 测试环境api接口
  ? 'http://192.168.1.91:8081'
  // 线上环境api接口
  : 'http://api.yibowanbo.com';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

util.api = ajaxUrl;
util.oauthUrl = ajaxUrl;

export default util;
