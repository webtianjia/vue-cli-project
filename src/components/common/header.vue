<template>
  <nav class="navbar">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href=""></a>
      </div>
      <ul class="nav  navbar-right  navbar-nav">
        <router-link to="/base/problem" tag="li"><a>常见问题</a></router-link>
        <router-link to="/base/about" tag="li"><a>关于ADS</a></router-link>
        <router-link v-if="!userSignIn" to="/base/login" tag="li"><a>登录</a></router-link>
        <router-link v-if="userSignIn" to="/wrapper-content/index" tag="li"><a>订单查询</a></router-link>
        <li v-if="userSignIn">
          <a href="javascript:void (0)">
            <el-dropdown trigger="click" @command="loginOut">
              <a href="javascript:void (0)" class="el-dropdown-link">
                {{userSignIn.user_name}}<i class="el-icon-arrow-down el-icon--right"></i>
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>安全退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import API from '../../api/base/login'

  export default {
    name: "v-header",
    props: {
      userSignIn: {
        type: Object,
        default: null
      }
    },
    methods: {
      loginOut() {
        this.$confirm('退出登录？').then(_ => {
          API.loginOut().then((response) => {
            this.$ls.remove("USER_TOKEN");
            this.$router.replace("/base/login");
            this.$emit("loginOut", null)
          }).catch((err) => {
            this.$ls.remove("USER_TOKEN");
            this.$router.replace("/base/login")
            this.$emit("loginOut", null)
          });
          done();
        }).catch(_ => {
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .navbar-brand {
    width: 121px;
    display: inline-block;
    background: url("../../assets/ADS-logo.png") no-repeat center;
    background-size: contain;
  }
  .navbar {
    margin-bottom: 0;
    border-radius: 0;
    background: #fff;
  }
</style>
