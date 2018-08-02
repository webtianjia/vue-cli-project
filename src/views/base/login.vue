<template>
  <div>
    <div class="login">
      <div class="container">
        <div class="form-horizontal">
          <h1 class="title">用户登录</h1>
          <el-form :rules="rules" ref="loginForm" :model="loginForm">
            <el-form-item prop="user_email">
                <el-input v-model="loginForm.user_email" placeholder="请输入用户名/登录邮箱号"></el-input>
            </el-form-item>
            <el-form-item prop="pass_word">
              <el-input v-model="loginForm.pass_word" type="password" :clearable="true"  placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="form-group text-right">
            <router-link to="/base/recoverPassword" class="text-main">忘记密码</router-link>
          </div>
        </div>
      </div>
    </div>
    <v-footer style="margin-top: 50px;"></v-footer>
  </div>
</template>

<script>
  import footer from '../../components/common/footer'
  import API from '../../api/base/login'
  import md5 from 'js-md5';

  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          user_email: '',
          pass_word: ''
        },
        rules:{
          user_email: [
            { required: true, message: '请输入用户名/货登录邮箱', trigger: 'change' }
          ],
          pass_word: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs['loginForm'].validate((valid) => {
          if(valid){
            let loginForm = this.loginForm;
            loginForm.pass_word = md5(loginForm.pass_word);
            API.login(loginForm).then((response) => {
              if(response.code==1){
                this.$router.replace(this.$route.query.redirect||'/wrapper-content/index');
                this.$emit("userSignIn",response.customerVo)
              }else {
                this.loginForm.pass_word=''//清空密码输入框
              }
              this.hasSubmit=false
            })
          }
        });
      },
    },
    components: {
      vFooter: footer
    }
  }
</script>

<style scoped lang="less">
  .login {
    height: 540px;
    background: url("../../../static/img/login-banner.png") no-repeat center;
    background-size: cover;
    .container {
      position: relative;
    }
    .form-horizontal {
      width: 380px;
      height: 360px;
      padding: 0 30px;
      box-sizing: border-box;
      background: #fff;
      position: absolute;
      top: 64px;
      right: 0;
      .title {
        font-size: 30px;
        font-weight: bold;
        margin: 40px 0 40px;
        color: #333;
      }
      .form-group {
        margin-bottom: 24px;
      }
      .form-control {
        padding-left: 30px;
        font-size: 14px;
        &::placeholder {
          color: #999
        }
        &.user_email {
          background: url("../../../static/img/icon-1.png") no-repeat 7px 9px;
        }
        &.pass_word {
          background: url("../../../static/img/icon-2.png") no-repeat 7px 9px;
        }
      }
    }
  }
</style>
