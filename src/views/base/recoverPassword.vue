<template>
  <div class="retrieve-pwd">
    <div class="banner"></div>
    <div class="form-horizontal">
      <h1 class="title">找回账户密码</h1>
      <div style="padding: 0 46px;margin-top: 40px" >
        <el-form :rules="resetPassWordRules" ref="resetPassWord" :model="resetPassWord">
          <el-form-item class="item" prop="user_email" >
            <el-input v-model="resetPassWord.user_email"  :clearable="true" placeholder="请输入您使用的邮箱号"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="code">
            <el-input v-model="resetPassWord.code" style="width: 209px" ype="password"  :clearable="true"  placeholder="请输入验证码"></el-input>
            <el-button style="width: 112px" @click="sendCode('resetPassWord')" :disabled="Timeout!=60">{{Timeout==60?'获取验证码':Timeout+"s"}}</el-button>
          </el-form-item>
          <el-form-item class="item" prop="new_pwd">
            <el-input v-model="resetPassWord.new_pwd" type="password"  :clearable="true"  placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="full_pwd">
            <el-input v-model="resetPassWord.full_pwd" type="password"  :clearable="true"  placeholder="请输再次入新密码"></el-input>
          </el-form-item>
          <el-form-item class="item">
            <el-button type="primary" @click="submit_resetPassWord('resetPassWord')" style="width: 100%">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
<!--        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输入您注册时使用的邮箱号">
        </div>
        <div class="form-group">
          <div class="input-group">
            <input class="form-control" type="text" placeholder="请输入您收到的验证码">
            <div class="input-group-btn">
              <button class="btn btn-main" type="button">获取验证码</button>
            </div>
          </div>
        </div>
        <p class="step-text" style="margin-top: 22px">
          <span>第二步</span>
          <span>修改信息</span>
        </p>
        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输入新密码">
        </div>
        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输再次入新密码">
        </div>
        <div class="form-group" style="margin-top: 26px">
          <button class="btn btn-main btn-block" @click="sub_updatePassworld">确认修改</button>
        </div>-->

<!--      <div style="padding: 0 46px">
        <p class="step-text">
          <span>第一步</span>
          <span>验证身份</span>
        </p>
        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输入您注册时使用的邮箱号">
        </div>
        <div class="form-group">
          <div class="input-group">
            <input class="form-control" type="text" placeholder="请输入您收到的验证码">
            <div class="input-group-btn">
              <button class="btn btn-main" type="button">获取验证码</button>
            </div>
          </div>
        </div>
        <p class="step-text" style="margin-top: 22px">
          <span>第二步</span>
          <span>修改信息</span>
        </p>
        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输入新密码">
        </div>
        <div class="form-group">
          <input class="form-control" type="text" placeholder="请输再次入新密码">
        </div>
        <div class="form-group" style="margin-top: 26px">
          <button class="btn btn-main btn-block" @click="sub_updatePassworld">确认修改</button>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>

  import API from '../../api/userData/personal/personal'
  import md5 from 'js-md5'
  import footer from '../../components/common/footer'
  export default {
    name: "recoverPassword",
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.resetPassWord.new_pwd !== '') {
            this.$refs.resetPassWord.validateField('full_pwd');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !==this.resetPassWord.new_pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        resetPassWord: {
          user_email:'',
          code: "",
          new_pwd: '',
          full_pwd: ""
        },
        resetPassWordRules:{
          user_email:[
            {required: true, message: '请输入您使用的邮箱号', trigger: 'change'}
          ],
          code:[
            {required: true, message: '请输入验证码', trigger: 'change'}
          ],
          new_pwd:[
            { validator: validatePass, trigger: 'change' }
          ],
          full_pwd:[
            { validator: validatePass2, trigger: 'change' }
          ]
        },
        Timeout:60
      }
    },
    methods: {
      /*重置密码*/
      submit_resetPassWord(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            let data=this.resetPassWord;
            data.new_pwd=md5(data.new_pwd)
            API.resetPassWord(this.resetPassWord).then((response=>{
              if(response.code==1){
                this.$message.success(response.msg)
                this.$router.replace("/base/login")
              }
            }))
          }
        })
      },
      //发送验证码
      sendCode(formName){
       this.$refs[formName].validateField('user_email',(valid)=>{
          if(valid){
            this.$message.error(valid)
          }else {
            API.sendCode({user_email:this.resetPassWord.user_email}).then((response)=>{
              if(response.code==1){
                this.$message.success("验证码发送成功，请注意查看");
                this.timer()
              }
            })
          }
        })

      },
      timer(){
        let time=setInterval(()=>{
          this.Timeout--
          if(this.Timeout<=0){
            clearInterval(time)
            this.Timeout=60
          }

        },1000)
      },
    },
    components: {
      vFooter: footer
    }
  }
</script>
<style scoped lang="less">
  .retrieve-pwd {
    position: relative;
    .banner {
      background: #00a9f1;
      height: 380px;
    }
    .form-horizontal {
      width: 463px;
      height: 493px;
      position: absolute;
      left: 50%;
      top: 65px;
      margin-left: -231px;
      padding-right: 46px;
      box-sizing: border-box;
      background: #fff /*url("../../../static/img/retrieve-pwd.png") no-repeat 96px 91px*/;
      .title {
        font-size: 30px;
        color: #333;
        margin-top: 40px;
        margin-left: 30px;
        font-weight: bold;
      }
    }
/*    .step-text {
      font-size: 14px;
      color: #333333;
      span {
        margin-right: 30px;
      }
      &:first-child {
        margin-top: 35px;
      }
    }
    .item{
      margin-left: 100px;
    }*/
  /*  .form-control {
      font-size: 14px;
      &::placeholder {
        color: #999;
      }
    }
    .form-group{
      padding-left:88px;
    }*/
  }
</style>
