import fetch from '../fetch';
export default {
  list(params){//订单列表
    return fetch.post('/clientOrder/list',params)
  },
  cancelOrder(params){//取消订单
    return fetch.post('/clientOrder/cancelOrder',params)
  },
  getExceptionData(params){//异常信息
    return fetch.post('/clientOrder/getExceptionData',params)
  },
  orderDetails(params){//订单详情
    return fetch.post('/clientOrder/orderDetails',params)
  },
  shipment(params){//确认出货
    return fetch.post('/clientOrder/shipment',params)
  },
  getOrderRouteInfo(params){//路由轨迹
    return fetch.post('/clientOrder/getOrderRouteInfo',params)
  },
}
