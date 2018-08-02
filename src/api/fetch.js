import Util from '../libs/util'
import qs from 'qs'
import Vue from 'vue'
import router from "../router/index"
import {Loading,Message} from 'element-ui';

let loadingInstance;
Util.ajax.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
};
//request 拦截器
Util.ajax.interceptors.request.use(config => {
  /**
   * loading ...
   * @type {string}
   */
  loadingInstance = Loading.service({
    fullscreen: true,
  });
  // 获取token
  config.headers.common['USER_TOKEN'] = Vue.ls.get("USER_TOKEN");
  return config
}, error => {
  loadinginstace.close();
  Message.error({
    message: '加载超时'
  });
  return Promise.reject(error)
});
//response 拦截器
Util.ajax.interceptors.response.use(response => {
  /**
   * loading 关闭
   */
  loadingInstance.close();

  // 如果后端有新的token则重新缓存
  if (response.data && response.data.customerVo) {
    let USER_TOKEN = response.data.customerVo.token;
    if (USER_TOKEN) {
      Vue.ls.set("USER_TOKEN", USER_TOKEN);
    }
  }

  if (response.data.code == '1') {//success
    return response.data;
  } else {//error
    if (response.data.code == 22001 || response.data.code == 11002) {//	登录已过期, 请重新登录
      router.replace({
        path: '/base/login',
        query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
      })
    }
    loadingInstance.close();
    Message.error(response.data.msg);
    return response.data;
  }
}, error => {
  loadingInstance.close();
  Message.error("加载失败");
  return Promise.reject(error)
});

export default {
  post(url, data) {
    return Util.ajax({
      method: 'post',
      url: url,
      data: qs.stringify(data),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },

  get(url, params) {
    return Util.ajax({
      method: 'get',
      url: url,
      params,
    })
  },

  delete(url, params) {
    return Util.ajax({
      method: 'delete',
      url: url,
      params
    })
  },

  put(url, data) {
    return Util.ajax({
      method: 'put',
      url: url,
      data: qs.stringify(data),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  }
}

