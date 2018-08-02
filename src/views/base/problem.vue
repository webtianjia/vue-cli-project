<template>
  <div class="problem-list">
    <div class="container">
      <div class="left">
        <div class="input-group">
          <input class="form-control" type="text" placeholder="请输入关键字搜索">
          <div class="input-group-btn">
            <button class="btn btn-main"></button>
          </div>
        </div>
        <div class="image">
          <img src="../../../static/img/help-logo.png" alt="" width="400" height="360">
        </div>
       <v-footer></v-footer>
      </div>
      <div class="content">
        <ul class="list-group">
          <li class="list-group-item" v-for="i in 10">
            <div class="media">
              <div class="media-left">
                <div class="date">
                  <div class="day">22</div>
                  <div class="year">2017-12</div>
                </div>
              </div>
              <div class="media-body">
                <h2 class="title">进口货物哪些情况需要补充申报？</h2>
                <p class="text">进出口货物向海关申报后未办结海关手续前，海关要求以进口出货的收货人..</p>
                <a class="btn btn-main btn-link" href="#">阅读原文</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import footer from '../../components/common/footer'

  export default {
    name: "problem",
    components: {
      vFooter: footer
    }
  }
</script>

<style scoped lang="less">
  .problem-list {
    background: #eff4fa url("../../../static/img/about-bg.png") no-repeat;
    background-position-y: -100px;
    background-position-x: -70px;
    min-height: 1080px;
    .left {
      float: left;
      width: 400px;
      margin-top: 28px;
      .input-group {
        display: table;
        width: 100%;
        .form-control {
          height: 40px;
          border-radius: 4px;
          font-size: 14px;
          padding-left: 10px;
          width: 100%;
          display: table-cell;
          vertical-align: middle;
          background: transparent;
          border: 1px solid #aed1fa;
          box-sizing: border-box;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          &::placeholder {
            color: #999;
          }
        }
        .input-group-btn {
          display: table-cell;
          vertical-align: middle;
          .btn {
            width: 61px;
            height: 40px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            cursor: pointer;
            background: #0287db url("../../../static/img/search.png") no-repeat center;
          }
        }
      }
      .image {
        margin-top: 16px;
      }
      .footer {
        margin-top: 20px;
        background: transparent;
        border: none;
      }
    }
    .content {
      margin-left: 416px;
      .list-group {
        margin-top: 84px;
        .list-group-item {
          padding-bottom: 20px;
          padding-top: 20px;
          border: none;
          &:first-child {
            padding-top: 0;
          }
          border-bottom: 1px #a2a2a2 dashed;
        }
      }
      .media {
        display: table;
        overflow: hidden;
        .media-body {
          display: table-cell;
          width: 100%;
          position: relative;
          .title {
            margin-top: 10px;
            margin-left: 20px;
            font-size: 24px;
            color: #333;
          }
          .text {
            margin-left: 20px;
            margin-top: 20px;
            font-size: 14px;
            color: #555;
            max-width: 470px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .btn-link {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
      .date {
        width: 90px;
        height: 80px;
        text-align: center;
        background: #ff8b48;
        color: #fff;
        .day {
          font-size: 36px;
        }
        .year {
          font-size: 18px;
        }
      }
    }
  }
</style>
