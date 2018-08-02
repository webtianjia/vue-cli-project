<template>
  <el-aside style="padding-top: 20px">
    <keep-alive>
    <el-menu :router="true"
      default-active=" ">
      <el-menu-item index="/wrapper-content/demandList">
        <i class="el-icon-menu"></i>
        <span slot="title">我的需求</span>
      </el-menu-item>
      <el-menu-item index="/wrapper-content/orderList">
        <i class="el-icon-document"></i>
        <span slot="title">我的订单</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span slot="title">我的账单</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/wrapper-content/consumptionData">消费记录</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>我的资料</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/wrapper-content/personalInformation">账户信息</el-menu-item>
          <el-menu-item index="/wrapper-content/addressList">常用地址</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </keep-alive>
  </el-aside>
</template>

<script>
  export default {
    name: "v-left"
  }
</script>

<style scoped>

</style>
