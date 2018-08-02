<template>
  <div>
    <v-header :userSignIn="userSignIn" @loginOut="setuserSignIn"></v-header>
    <router-view @userSignIn="setuserSignIn"/>
  </div>
</template>

<script>
  import vHeader from './components/common/header'
  import Vue from 'vue'

  export default {
    components: {
      vHeader: vHeader
    },
    data() {
      return {
        userSignIn: null
      }
    },
    methods: {
      setuserSignIn(userSignIn) {
        Vue.ls.set("userSignIn", userSignIn);
        this.userSignIn = Vue.ls.get('userSignIn')
      }
    },
    created() {
      this.userSignIn = Vue.ls.get('userSignIn')
    }
  }
</script>
<style lang="less">
 @import "assets/css/style";
</style>

