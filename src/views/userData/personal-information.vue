<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="m-r-lg">用户名：XiuEx</span>
        <el-button type="primary" @click="editCustomer">修改账号信息</el-button>
        <el-button type="primary" @click="show_updateModal('resetPassWord')">修改登录密码</el-button>
      </div>
      <el-form :disabled="!updateCustomerEntity"  :model="customerEntity" :rules="rules" ref="customerEntity"
               label-width="140px" style="width: 600px">
        <el-form-item label="公司名称：" prop="company_full_name">
          <el-input v-model="customerEntity.company_full_name"></el-input>
        </el-form-item>
        <el-form-item label="公司简称：" prop="company_name">
          <el-input v-model="customerEntity.company_name"></el-input>
        </el-form-item>
        <el-form-item label="业务联系人：" prop="salesman_name">
          <el-input v-model="customerEntity.salesman_name"></el-input>
        </el-form-item>
        <el-form-item label="业务联系人电话：" prop="salesman_phone">
          <el-input v-model="customerEntity.salesman_phone"></el-input>
        </el-form-item>
        <el-form-item label="业务联系人邮箱：" prop="salesman_email">
          <el-input v-model="customerEntity.salesman_email"></el-input>
        </el-form-item>
        <el-form-item label="财务联系人：" prop="treasurer_name">
          <el-input v-model="customerEntity.treasurer_name"></el-input>
        </el-form-item>
        <el-form-item label="财务联系人电话：" prop="treasurer_phone">
          <el-input v-model="customerEntity.treasurer_phone"></el-input>
        </el-form-item>
        <el-form-item label="财务联系人邮箱：" prop="treasurer_email">
          <el-input v-model="customerEntity.treasurer_email"></el-input>
        </el-form-item>
        <el-form-item label="公司地址：" prop="company_address">
          <el-input v-model="customerEntity.company_address"></el-input>
        </el-form-item>
        <el-form-item label="" v-if="updateCustomerEntity" >
          <el-button type="primary" @click="submit_editCustomer('customerEntity')">确认</el-button>
          <el-button @click="reset_editCustomer">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="修改登录密码"  :visible.sync="updateModal" width="600px">
      <el-form :model="resetPassWord" :rules="resetPassWordRules" ref="resetPassWord" label-width="140px" style="width: 500px">
        <el-form-item label="验证码：" prop="code">
          <el-input v-model="resetPassWord.code" placeholder="请输入邮箱验证码" style="width: 244px"></el-input>
          <el-button style="width: 112px" @click="sendCode" :disabled="Timeout!=60">{{Timeout==60?'获取验证码':Timeout+"s"}}</el-button>
        </el-form-item>
        <el-form-item label="新密码：" prop="new_pwd">
          <el-input type="password" v-model="resetPassWord.new_pwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="full_pwd">
          <el-input type="password" v-model="resetPassWord.full_pwd" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_resetPassWord('resetPassWord')">确定</el-button>
        <el-button @click="updateModal=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/userData/personal/personal'
  import md5 from 'js-md5'



  export default {
    name: "Personal-information",
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
        updateModal: false,
        updateCustomerEntity: false,
        customerEntity: {//客户信息
          company_full_name: '',//公司全称
          company_name: '',//公司简称
          salesman_name: '',//业务联系人姓名
          salesman_phone: '',//业务联系人电话
          salesman_email: '',//业务联系人邮箱
          treasurer_name: '',//财务联系人姓名
          treasurer_phone: '',//财务联系人电话
          treasurer_email: '',//财务联系人邮箱
          company_address: ''//公司地址
        },
        rules: {
          company_full_name: [
            {required: true, message: '请输入公司全称', trigger: 'change'}
          ],
          company_name: [
            {required: true, message: '请输入公司简称', trigger: 'change'}
          ],
          salesman_name: [
            {required: true, message: '请输入业务联系人姓名', trigger: 'change'}
          ],
          salesman_phone: [
            {required: true, message: '请输入业务联系人电话', trigger: 'change'}
          ],
          salesman_email: [
            {required: true, message: '请输入业务联系人邮箱', trigger: 'change'}
          ],
          treasurer_name: [
            {required: true, message: '请输入财务联系人姓名', trigger: 'change'}
          ],
          treasurer_phone: [
            {required: true, message: '请输入财务联系人电话', trigger: 'change'}
          ],
          treasurer_email: [
            {required: true, message: '请输入财务联系人邮箱', trigger: 'change'}
          ],
          company_address: [
            {required: true, message: '请输入公司地址', trigger: 'change'}
          ]
        },
        resetPassWord: {
          code: "",
          new_pwd: '',
          full_pwd: ""
        },
        resetPassWordRules:{
          code:[
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          new_pwd:[
            { validator: validatePass, trigger: 'blur' }
          ],
          full_pwd:[
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
       Timeout:60
      }
    },
    methods: {
      /*修改账号信息*/
      editCustomer(){
        this.updateCustomerEntity=true
      },
      /*取消修改*/
      reset_editCustomer(){
        this.updateCustomerEntity=false;
        this.$refs['customerEntity'].clearValidate();
        this.getCustomer();
      },
      /*提交修改*/
      submit_editCustomer(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            API.editCustomer(this.customerEntity).then((response)=>{
              if(response.code==1){
                this.reset_editCustomer()
              }
            })
          }
        })
      },
      show_updateModal(formName){
        this.updateModal=true;
        this.resetForm(formName)
      },


      /*重置密码*/
      submit_resetPassWord(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            let data=this.resetPassWord;
                data.new_pwd=md5(data.new_pwd)
            API.resetPassWord(this.resetPassWord).then((response=>{
              if(response.code==1){
                this.$message.success(response.msg)
                this.$ls.clear("USER_TOKEN");
                this.$router.replace("/base/login")
              }
            }))
          }
        })
      },
      //发送验证码
      sendCode(){
        API.sendCode().then((response)=>{
          console.log(response)
          if(response.code==1){
            this.$message.success("验证码发送成功，请注意查看")
            this.timer()
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
      /*获取用户信息*/
      getCustomer(){
        API.getCustomer().then((response)=>{
          if(response.code==1){
            this.customerEntity=response.data;
            if(!this.updateCustomerEntity){
              this.resetForm('customerEntity')
            }
          }
          console.log(response)
        })
      },
      resetForm(formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields();
        }
      }
    },
    created(){
      this.getCustomer()
    }
  }
</script>

<style>
  .el-input.is-disabled .el-input__inner {
    background: transparent;
    cursor: inherit;
    border: none;
    box-shadow: none;
    color: inherit;
  }
</style>
