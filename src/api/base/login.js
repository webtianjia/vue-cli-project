import fetch from '../fetch';
export default {
  login(params){//登录
    return fetch.post('/clientLogin/go',params)
  },
  loginOut(params){//退出登录
    return fetch.post('/clientLogin/logout',params)
  }
}
