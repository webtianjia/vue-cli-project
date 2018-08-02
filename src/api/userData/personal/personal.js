import fetch from '../../fetch';
export default {
  getCustomer(params){//账户信息
    return fetch.post('/clientCustomer/getCustomer',params)
  },
  editCustomer(params){//修改账户信息
    return fetch.post('/clientCustomer/editCustomer',params)
  },
  sendCode(params){//重置密码-发送验证码
    return fetch.post('/clientCustomer/sendCode',params)
  },
  resetPassWord(params){//重置密码-确认
    return fetch.post('/clientCustomer/resetPassWord',params)
  },

}
