import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // 哈斯
  mode: 'history',
  linkActiveClass:"active",
  scrollBehavior(to, from, savedPosition) {
    // 兼容
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
    {
      // 重定向首页
      path: '/',
      redirect: '/base/login'
    },
    {
      // 登录
      name:"login",
      path: '/base/login',
      component(resolve) {
        require(['../views/base/login.vue'], resolve);
      }
    },
    {
      name:"找回密码",
      path: '/base/recoverPassword',
      component(resolve) {
        require(['../views/base/recoverPassword.vue'], resolve);
      }
    },
    {
      name:"关于我们",
      path: '/base/about',
      component(resolve) {
        require(['../views/base/about-ads.vue'], resolve);
      }
    },
    {
      name:"常见问题",
      path: '/base/problem',
      component(resolve) {
        require(['../views/base/problem.vue'], resolve);
      }
    },
    {
      // 登录后
      name:"wrapper-content",
      path: '/wrapper-content',
      component(resolve) {
        require(['../components/common/wrapper-content.vue'], resolve);
      },
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children:[
        {
          // 重定向首页
          path: '/',
          redirect: '/wrapper-content/index'
        },
        {
          // 登录后首页
          name:"首页",
          path: '/wrapper-content/index',
          component(resolve) {
            require(['../views/home/index.vue'], resolve);
          }
        },
        {
          // 我的需求列表
          name:"我的需求",
          path: '/wrapper-content/demandList',
          component(resolve) {
            require(['../views/demand/demand-list.vue'], resolve);
          }
        },
        {
          // 我的订单
          name:"我的订单",
          path: '/wrapper-content/orderList',
          component(resolve) {
            require(['../views/order/order-list.vue'], resolve);
          }
        },
        {
          // 账单
          name:"消费记录",
          path: '/wrapper-content/consumptionData',
          component(resolve) {
            require(['../views/bill/consumption-data.vue'], resolve);
          }
        },
        {
          //账户信息
          name:"账户信息",
          path: '/wrapper-content/personalInformation',
          component(resolve) {
            require(['../views/userData/personal-information.vue'], resolve);
          }
        },
        {
          // 我常用地址
          name:"常用地址",
          path: '/wrapper-content/addressList',
          component(resolve) {
            require(['../views/userData/address-list.vue'], resolve);
          }
        }
      ]
    },
  ]
})
