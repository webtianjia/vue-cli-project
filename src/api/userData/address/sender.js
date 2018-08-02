import fetch from '../../fetch';
export default {
  list(params){//发件人列表
    return fetch.post('/clientSenderInfo/list',params)
  },
  del(params){//删除发件人
    return fetch.post('/clientSenderInfo/del',params)
  },
  addAndEdit(params){//发件人-添加/修改
    return fetch.post('/clientSenderInfo/addAndEdit',params)
  },
}
