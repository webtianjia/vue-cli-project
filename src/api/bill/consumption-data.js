import fetch from '../fetch';
export default {
  list(params){//需求列表
    return fetch.post('/clientPay/list',params)
  },
  getDetail(params){//查看报价
    return fetch.post('/clientPay/details',params)
  }
}
