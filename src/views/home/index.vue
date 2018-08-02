<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="16">
        <el-card style="min-height: 327px">
          <div slot="header">
            <span>XIUEX</span>
            <el-button size="small" class="pull-right" style="padding: 3px 0" type="text">账户设置</el-button>
            <el-button size="small" class="pull-right m-r-lg" style="padding: 3px 0" type="text">需求管理</el-button>
          </div>
          <el-row class="text-center m-t-lg">
            <el-col :span="4" :push="1">
              <a href="">
                <p>总订单列表</p>
                <p>(200)</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="">
                <p>已报价</p>
                <p>(3)</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="">
                <p>待出货</p>
                <p>(3)</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="">
                <p>干线运输</p>
                <p>(5)</p>
              </a>
            </el-col>
            <el-col :span="4" :push="1">
              <a href="">
                <p>已结束</p>
                <p>(3)</p>
              </a>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>最新公告</span>
            <el-button style="float: right; padding: 3px 0" type="text">更多<i class="el-icon-d-arrow-right"></i>
            </el-button>
          </div>
          <div class="list-group">
            <div class="list-group-item" v-for="i in 5"> amazon欧盟严查VAT…</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="m-t">
      <div slot="header">
        <span class="text-danger">异常订单(5)</span>
      </div>
      <el-table
        :data="exceptionData"
        style="width: 100%">
        <el-table-column label="单号" width="200">
          <template slot-scope="scope">
            <p>{{scope.row.order_no}}订单号</p>
            <p>{{scope.row.bill_lading_no}}提单号</p>
          </template>
        </el-table-column>
        <el-table-column label="需求概述" width="400">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="8">起运地 {{scope.row.provenance}}</el-col>
              <el-col :span="8">{{scope.row.airline_company_name}}</el-col>
              <el-col :span="8">
                <el-popover
                  placement="top-start"
                  title="描述"
                  width="200"
                  trigger="hover"
                  :content="scope.row.info_describe">
                  <p slot="reference" class="br">{{scope.row.info_describe}}</p>
                </el-popover>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">目的地 {{scope.row.destination}}</el-col>
              <el-col :span="8"><p>{{scope.row.service_mode|service_mode}}</p></el-col>
            </el-row>
            <el-row>
              <el-col :span="8">货物重量 {{scope.row.need_weight}}KG</el-col>
              <el-col :span="8">{{scope.row.declaration_type|declaration_type}}</el-col>
              <el-col :span="8">
                <el-popover
                  placement="top-start"
                  title="备注"
                  width="200"
                  trigger="hover"
                  :content="scope.row.require_remark">
                  <p slot="reference" class="br">{{scope.row.require_remark}}</p>
                </el-popover>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="收寄人信息">
          <template slot-scope="scope">
            <div>
              <el-tag size="mini">收</el-tag>
              <span>{{scope.row.recipientName}}</span>
              <span>{{scope.row.recipientPhone}}</span>
              <p>{{scope.row.recipientAddress}}</p>
            </div>
            <div>
              <el-tag size="mini">寄</el-tag>
              <span>{{scope.row.senderName}}</span>
              <span>{{scope.row.senderPhone}}</span>
              <p>{{scope.row.senderAddress}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p>{{scope.row.state|orderState}}</p>
            <p v-if="scope.row.is_exception==1">
              <el-tag type="danger" size="mini">{{scope.row.exception_state|exception_state}}</el-tag>
            </p>
            <p v-for="item in scope.row.orderRouteList">{{item.op_time|formatDate}} {{item.route_detail}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="getOrderDetail(scope.row.id)">查看
            </el-button>
            <el-button size="mini"
                       @click="getOrderRouter(scope.row.id)">轨迹
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="cancelOrder(scope.row.id)">取消
            </el-button>
            <el-button size="mini" v-if="scope.row.is_exception==1" @click="getExceptionData(scope.row.id,scope.row)">
              异常信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--<v-panel :head="true" :body="true">
      <div slot="head">
        <p class="text-danger"></p>
      </div>
      <div slot="body">
        <table class="table">
          <thead>
          <tr>
            <th>单号</th>
            <th>需求概述</th>
            <th>收寄件人信息</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <p>S00987654232 <span class="tag">[订单号]</span></p>
              <p>S00987654232 <span class="tag">[提单号]</span></p>
            </td>
            <td>
              <table class="table">
                <tbody>
                <tr>
                  <td>起运地 多伦多</td>
                  <td>深圳航空</td>
                  <td>无人机</td>
                </tr>
                <tr>
                  <td>目的地 北京</td>
                  <td>门对门</td>
                  <td></td>
                </tr>
                <tr>
                  <td>货物重量 80.00KG</td>
                  <td>自主提货</td>
                  <td>其他</td>
                </tr>
                </tbody>
              </table>
            </td>
            <td>
              <div class="row">
                <div class="col-sm-6">
                  <div>
                    <span class="label pull-left ">寄</span>
                    <p class="m-l-lg">李磊 13723456792</p>
                    <p class="br m-l-lg">广东省 广州市 黄埔区 广州市黄埔区大沙地下沙青云里7-1</p>
                  </div>
                  <div>
                    <span class="label pull-left">收</span>
                    <p class="m-l-lg">李磊 13723456792</p>
                    <p class="br m-l-lg">广东省 广州市 黄埔区 广州市黄埔区大沙地下沙青云里7-1</p>
                  </div>
                </div>
                <div class="col-sm-6">
                  <p>状态：已下单</p>
                  <p>2018-09-08 14:00:45 <span class="tag">[下单]</span></p>
                </div>
              </div>
            </td>
            <td>
              <p>
                <button class="btn btn-sm btn-outline">查看</button>
              </p>
              <p>
                <button class="btn btn-sm btn-outline">轨迹</button>
              </p>
              <p>
                <button class="btn btn-sm btn-outline">取消</button>
              </p>
            </td>
          </tr>
          </tbody>
        </table>
        >
      </div>
    </v-panel>-->
  </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        exceptionData: null,
        value: [20, 50]
      }
    }
  }
</script>

<style scoped>

</style>
