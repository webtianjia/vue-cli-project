import fetch from '../fetch';
export default {
  list(params){//需求列表
    return fetch.post('/clientNeedOrder/list',params)
  },
  getMakeOffers(params){//查看报价
    return fetch.post('/clientNeedOrder/getMakeOffers',params)
  },
  booking(params){//帮我订舱
    return fetch.post('/clientNeedOrder/booking',params)
  },
  cancelNeedOrder(params){//取消需求
    return fetch.post('/clientNeedOrder/cancelNeedOrder',params)
  },
  addAndUpdateNeedOrder(params){//发布需求&修改需求
    return fetch.post('/clientNeedOrder/addAndUpdateNeedOrder',params)
  }
}
