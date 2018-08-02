<template>
  <el-container>
    <v-left></v-left>
    <el-main>
      <router-view />
    </el-main>
  </el-container>

</template>

<script>
  import vLeft from './left'
  export default {
    name: "wrapper-content",
    components: {
      vLeft: vLeft
    }
  }
</script>

<style scoped>

</style>
