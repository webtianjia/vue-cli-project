<template>
  <div class="about">
    <div class="banner"></div>
    <div class="container">
      <h1 class="about-title">企业简介</h1>
      <p class="about-title-1">
        <span class="line"></span>
        <span>ENTERPRISE  PROFILE</span>
        <span class="line"></span>
      </p>
      <p class="about-text">深圳市安达顺国际物流有限公司 成立于2006年，是经商务部、交通部和海关总署批准成立的国际货运代理企业。经中国航空运输协会（CATA）
        审核获得一级国际货运代理资格(一级货代牌照号:ZN30214)，同时也是IATA, FIATA, CATA, CIFA和NVOCC的资深成员。 安达顺国际立足深圳，
        经过10余年发展目前自营网络遍布全国，可为国内进出口企业提供国际空运、集装箱海运、散货拼箱、散杂货运输、租船包机、海陆空联运、中
        港运输、仓储装卸、代理报关、代理报检、货运保险、供应链等服务。我们依托遍布200多个国家的500多家长期合作国际代理网络，提供全球任
        何点到点的物流服务；近几年开始依托传统空运及海运干线优势，为跨境电商企业提供优质干线及清关物流服务。 安达顺国际拥有一批经验丰富
        、平均从业年龄超过10年的专业物流团队，利用现代管理手段及IT技术设施，为用户打造运价查询、在线订舱、订单实时跟踪、进出口代理、跨境
        电商等基于云服务的信息化平台，提供全方位的高效、安全、稳定的服务。</p>
      <div class="row" style="margin-top: 110px;">
        <div class="col-sm-3 col-xs-6 m-t-lg">
          <a href="#">
            <img src="../../../static/img/about-1.png" alt="">
          </a>
        </div>
        <div class="col-sm-3 col-xs-6 m-t-lg">
          <a href="#">
            <img src="../../../static/img/about-2.png" alt="">
          </a>
        </div>
        <div class="col-sm-3 col-xs-6 m-t-lg">
          <a href="#">
            <img src="../../../static/img/about-3.png" alt="">
          </a>
        </div>
        <div class="col-sm-3 col-xs-6 m-t-lg">
          <a href="#">
            <img src="../../../static/img/about-4.png" alt=""></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "about-us"
  }
</script>

<style scoped lang="less">
  .about {
    overflow-y: scroll;
    background: url("../../../static/img/about-bg.png") no-repeat top center;
    min-height: 1080px;
    .banner {
      height: 340px;
      background: url("../../../static/img/about-banner.png") no-repeat center;
      background-size: cover;
    }
    .about-title {
      font-size: 36px;
      color: #0492eb;
      font-weight: bold;
      margin-top: 30px;
      text-align: center;
    }
    .about-title-1 {
      font-size: 16px;
      color: #333;
      margin-top: 10px;
      text-align: center;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-left: 18px;
      }
      .line {
        width: 148px;
        height: 1px;
        background: #ff8b48;
        vertical-align: middle;
      }
    }
    .about-text {
      margin-top: 30px;
      text-align: center;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      color: #555;
      line-height: 2;
    }
  }
</style>
