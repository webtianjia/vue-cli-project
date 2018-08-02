import fetch from '../../fetch';
export default {
  list(params){//收件人列表
    return fetch.post('/clientRecipientInfo/list',params)
  },
  del(params){//删除收件人
    return fetch.post('/clientRecipientInfo/del',params)
  },
  addAndEdit(params){//收件人-添加/修改
    return fetch.post('/clientRecipientInfo/addAndEdit',params)
  },
}
