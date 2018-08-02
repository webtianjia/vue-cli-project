<template>
  <dl class="dl-horizontal router-trajectory" style="max-height: 305px;overflow-y: scroll">
    <dd v-for="(item,$index) in orderRouteList">
      <p :class="{'active':$index==0}">
        <i class="el-icon-refresh"></i>
        <span class="text">{{item.route_detail}}</span>
        <span class="m-l-lg">{{item.op_time|formatDate}}</span>
      </p>
    </dd>
<!--    <dd>
      <p>
        <i class="el-icon-refresh"></i>
        <span class="text">确认报价</span>
        <span class="m-l-lg">2018-04-23 19：00：00</span>
      </p>
    </dd>
    <dd>
      <p>
        <i class="el-icon-refresh"></i>
        <span class="text">反馈报价</span>
        <span class="m-l-lg">2018-04-23 19：00：00</span>
      </p>
    </dd>
    <dd>
      <p>
        <i class="el-icon-refresh"></i>
        <span class="text">发布需求</span>
        <span class="m-l-lg">2018-04-23 19：00：00</span>
      </p>
    </dd>-->
  </dl>
</template>

<script>
  import {formatDate} from '../../assets/js/date'
    export default {
        name: "router-trajectory",
        props:{
          orderRouteList:{
            type:Array,
            default:[]
          }
        },
      filters:{
        /*时间格式转换*/
        formatDate(time) {
          let date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
      }
    }
</script>

<style scoped lang="less">
  /*路由轨迹*/
  .router-trajectory {
      dd,dt{
        color: #868c98;
        .text{
          margin-left: 35px;
        }
      }
      .active{
        color:#3393ff;
        .el-icon-refresh{
          color: #3393ff;
          &:after{
            display: none;
          }
        }
      }
      .el-icon-refresh{
        position: relative;
        &:after{
          content:'';
          position: absolute;
          width: 1px;
          height: 22px;
          background-color:#868c98;
          left: 50%;
          bottom: 0;
          transform: translate(-50%,-50%);
        }
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        min-width: 90px;
      }
    }
</style>
