<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="订单号/提单号，多个单号逗号隔开" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="m-t">
      <div slot="header">
        <el-button type="primary" :disabled="activeName>=2" @click="show_shipmentModal('shipmentData')">确认出货</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待确认" name="1"></el-tab-pane>
        <el-tab-pane label="待入仓" name="2 "></el-tab-pane>
        <el-tab-pane label="干线运输" name="3"></el-tab-pane>
        <el-tab-pane label="目的地派送" name="4"></el-tab-pane>
        <el-tab-pane label="已完结" name="5"></el-tab-pane>
        <el-tab-pane label="异常订单" name="6"></el-tab-pane>
      </el-tabs>
      <el-table
        :data="orderList"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
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
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <p>{{scope.row.state|orderState}}</p>
            <p  v-if="scope.row.is_exception==1"><el-tag type="danger" size="mini">{{scope.row.exception_state|exception_state}}</el-tag></p>
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
            <el-button size="mini" v-if="scope.row.is_exception==1" @click="getExceptionData(scope.row.id,scope.row)">异常信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block text-right m-t">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="pageParams.start"
          :page-sizes="pageParams.sizes"
          :page-size="pageParams.length"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="查看订单信息" :visible.sync="detailModal">
      <div class="form-horizontal" v-if="orderDetail">
        <el-card>
          <div slot="header">单号信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">订单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">S0123456789</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">提单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">999-56999898</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">调度单</div>
                <div class="col-sm-8">
                  <div class="form-control-static">ADS87878787</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">需求信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">线路信息</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳-SZX----》布拉格-RPG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">服务模式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">门到门</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">清关方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">委托报关</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">起运地服务方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">上门提货</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">目的地服务方式</div>
                <div class="col-sm-8">
                  <div class="form-control-static">清关派送</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">寄件人</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>李磊 13723446460 518000</p>
                    <p class="br">广东省深圳市南山区世外桃源创意园C栋</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">收件人</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>Jack 13723446460 95217</p>
                    <p class="br">137 W San Bernardino Rd. Covina，CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">提货信息</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>李磊 13723446460 518000</p>
                    <p class="br">广东省深圳市南山区世外桃源创意园C栋</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">内件信息</div>
                <div class="col-sm-8">
                  <div class="form-control-static">卡西欧手表，20只</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">特殊要求</div>
                <div class="col-sm-8">
                  <div class="form-control-static">包机</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">报价方案</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价航线</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳-SZX-->布拉格-RPG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航空公司</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳航空</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-17 12:30</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">空运费</div>
                <div class="col-sm-8">
                  <div class="form-control-static">15.00 CAD/KG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">燃油费</div>
                <div class="col-sm-8">
                  <div class="form-control-static">1.5 CAD/KG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">战争附加费</div>
                <div class="col-sm-8">
                  <div class="form-control-static">1.5 CAD/KG</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">订舱信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">报价航线</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳-SZX----》布拉格-RPG</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航空公司</div>
                <div class="col-sm-8">
                  <div class="form-control-static">深圳航空</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航班号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">ZLH90000</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">提单号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">999-56999898</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">航班时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-17 12:30</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">提货信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">司机姓名</div>
                <div class="col-sm-8">
                  <div class="form-control-static">李先生</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">司机电话</div>
                <div class="col-sm-8">
                  <div class="form-control-static">13723545454</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">车牌号</div>
                <div class="col-sm-8">
                  <div class="form-control-static">粤B XL876</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">入仓信息</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓重量</div>
                <div class="col-sm-8">
                  <div class="form-control-static">45.00Kg</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">货物体积</div>
                <div class="col-sm-8">
                  <div class="form-control-static">200*150*80 cm</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓内件</div>
                <div class="col-sm-8">
                  <div class="form-control-static">
                    <p>手表*20</p>
                    <p>电脑*20</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">入仓时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-08 15:12</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="m-t">
          <div slot="header">干线运输</div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">起运时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-10 12:50:20</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">到达时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-10 12:50:20</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">派送时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-10 12:50:20</div>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <div class="control-label col-sm-4">完结时间</div>
                <div class="col-sm-8">
                  <div class="form-control-static">2018-05-08 15:12:20</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div slot="footer">
        <el-button @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="路由轨迹" :visible.sync="routerModal">
      <div class="form-horizontal" v-if="routerDetail">
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <div class="control-label col-sm-4">单号:</div>
              <div class="form-control-static col-sm-8">{{routerDetail.order_no}}</div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <div class="control-label col-sm-4">当前状态:</div>
              <div class="form-control-static col-sm-8">{{routerDetail.order_state|orderState}}</div>
            </div>
          </div>
        </div>
        <el-card>
          <router-trajectory :orderRouteList="routerDetail.orderRouteList"></router-trajectory>
        </el-card>
      </div>
      <div slot="footer">
        <el-button @click="routerModal=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认出货操作" :visible.sync="shipmentModal">
      <el-card>
        <div slot="header">出货列表</div>
        <el-table
          :data="shipmentData.viewData"
          style="width: 100%">
          <el-table-column label="单号" width="200">
            <template slot-scope="scope">
              <p>{{scope.row.order_no}}订单号</p>
              <p>{{scope.row.bill_lading_no}}提单号</p>
            </template>
          </el-table-column>
          <el-table-column label="运输信息" width="400">
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
        </el-table>
        <el-form class="m-t" :inline="true" :model="shipmentData" ref="shipmentData" :rules="shipmentRules">
          <el-form-item label="司机姓名" prop="driver_name">
            <el-input v-model="shipmentData.driver_name" placeholder="请输入司机姓名"></el-input>
          </el-form-item>
          <el-form-item label="司机电话" prop="driver_phone">
            <el-input v-model="shipmentData.driver_phone" placeholder="请输入司机电话"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="plate_no">
            <el-input v-model="shipmentData.plate_no" placeholder="请输入车牌号"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_shipment('shipmentData')">确认出货</el-button>
      </div>
    </el-dialog>
    <el-dialog title="异常信息" :visible.sync="exceptionModal">
      <div>
        <el-table
          :data="exceptionData.viewData"
          style="width: 100%">
          <el-table-column label="单号" width="200">
            <template slot-scope="scope">
              <p>{{scope.row.order_no}}订单号</p>
              <p>{{scope.row.bill_lading_no}}提单号</p>
            </template>
          </el-table-column>
          <el-table-column label="运输信息" width="400">
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
        </el-table>
        <el-card class="m-t">
          <div slot="header">异常信息</div>
          <el-table
            :data="exceptionData.data"
            v-if="exceptionData.data"
            style="width: 100%">
            <el-table-column label="异常状态">
              <template slot-scope="scope">
                <p>{{scope.row.exception_state|exception_state}}</p>
              </template>
            </el-table-column>
            <el-table-column label="异常备注">
              <template slot-scope="scope">
                <p>{{scope.row.exception_remarks}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                <p>{{scope.row.create_time|formatDate}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作人">
              <template slot-scope="scope">
                <p>{{scope.row.op_name}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="exceptionModal=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/order/order'
  import routerTrajectory from '../../components/common/router-trajectory'
  import {formatDate} from '../../assets/js/date'

  export default {
    name: "order-list",
    data() {
      return {
        pageParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          order_no: null,
          bill_lading_no: '',
          tabType: 0
        },
        activeName: 0,
        shipmentModal: false,
        detailModal: false,
        routerModal: false,
        routerDetail: null,//路由信息
        orderList: null,//订单列表
        orderDetail: null,//订单详情
        shipmentData: {
          viewData: null,
          ids: [],
          plate_no: '',//提货司机车牌号
          driver_phone: '',//提货司机电话
          driver_name: ''//提货司机姓名
        },
        shipmentRules: {
          driver_name: [
            {required: true, message: '请输入提货司机姓名', trigger: 'change'}
          ],
          driver_phone: [
            {required: true, message: '请输入提货司机电话', trigger: 'change'}
          ],
          plate_no: [
            {required: true, message: '请输入提货车牌号', trigger: 'change'}
          ],
        },
        exceptionData: {
          viewData: [],
          data: null
        },//异常信息
        exceptionModal: false
      }
    },
    methods: {
      /*tab 切换*/
      tabClick(val) {
        this.pageParams.tabType = val.name;
        this.getOrderList()
      },
      selectable(row, index) {
        /*
        * 订单状态为: 【已下单】,且  服务模式为: 【门到门】 , 【门到港】 可选
        * */
        const orderStatus = 'have_order';//订单状态
        const door_to_door = 'door_to_door';//服务模式 门到门
        const door_to_port = 'door_to_port';//服务模式 门到港
        if (row.state === orderStatus && row.service_mode === door_to_door || row.service_mode === door_to_port) {
          return true
        }
      },
      /*取消订单*/
      cancelOrder() {
        this.$confirm('确认取消？').then(_ => {
          API.cancelOrder({
            id: id
          }).then((response) => {
            if (response.code == 1) {
              this.$message.success(response.msg);
              this.getOrderList()
            }
          });
          done();
        }).catch(_ => {
        });
      },

      /*处理选中*/
      handleSelectionChange(val) {
        this.shipmentData.viewData = val;
      },
      /*显示确认出货弹框*/
      show_shipmentModal(formName) {
        if (!this.shipmentData.viewData || this.shipmentData.viewData.length <= 0) {
          return this.$message.error("请选择出货订单");
        }
        this.shipmentModal = true
        this.resetForm(formName)
      },
      /*确认出货*/
      submit_shipment(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.shipmentData.ids = [];
            this.shipmentData.viewData.forEach((item, index) => {
              this.shipmentData.ids.push(item.id)
            });
            this.shipmentData.ids = this.shipmentData.ids.join(',');
            API.shipment(this.shipmentData).then((response) => {
              if (response.code == 1) {
                this.$message.success(response.msg);
                this.shipmentModal = false;
                this.shipmentData.viewData = null;
                this.getOrderList()
              }
            })
          }
        });
      },

      /*获取订单列表*/
      getOrderList() {
        API.list(this.pageParams).then((response => {
          if (response.code == 1) {
            this.pageParams.total = response.data.recordsTotal;
            this.orderList = response.data.list
            console.log(response.data.list)
          }
        }))
      },
      /*查看订单详情*/
      getOrderDetail(id) {
        API.orderDetails({id: id}).then((response => {
          if (response.code == 1) {
            this.orderDetail = response.data;
            this.detailModal = true;
          }
          console.log(response.data)
        }))
      },
      /*获取路由信息*/
      getOrderRouter(id) {
        API.getOrderRouteInfo({id: id}).then((response => {
          if (response.code == 1) {
            this.routerDetail = response.data;
            this.routerModal = true;
          }
        }))
      },
      /*获取异常信息*/
      getExceptionData(id, row) {
        API.getExceptionData({id: id}).then((response => {
          if (response.code == 1) {
            this.exceptionData.viewData = [row];
            this.exceptionData.data = response.data;
            console.log(response.data)
            this.exceptionModal = true;
          }
        }))
      },
      /*每页显示几条啊*/
      pageSizeChange(val) {
        this.pageParams.length = val
        this.getOrderList()
      },
      /*当前第几页*/
      pageCurrentChange(val) {
        this.pageParams.start = (val - 1) * this.pageParams.length;
        this.getOrderList()
      },

      resetForm(formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields();
        }
      }
    },
    created() {
      this.getOrderList()
    },
    components: {
      routerTrajectory: routerTrajectory
    },
    filters: {
      /*服务模式*/
      service_mode(mode) {
        switch (mode) {
          case 'door_to_door':
            return '门对门';
          case 'door_to_port':
            return '门对港';
          case 'port_to_door':
            return '港对门';
          case 'port_to_port':
            return '港对港';
        }
      },

      /*报关方式*/
      declaration_type(type) {
        switch (type) {
          case 'autonomy':
            return '自主报关';
          case 'entrust':
            return '委托报关';
        }
      },

      /*订单状态*/
      orderState(state) {
        switch (state) {
          case 'have_order' :
            return '已下单';

          case 'in_house' :
            return '已入仓';

          case 'shipment' :
            return '已出货';

          case 'booking' :
            return '已订舱';

          case 'take_off' :
            return '已起飞';

          case 'arrive' :
            return '已到达';

          case 'delivery' :
            return '派送中';

          case 'over' :
            return '派送完结';

          case 'pick_up' :
            return '已提货';

          case 'out_house' :
            return '已退仓';

          case 'cancel' :
            return '已取消';
        }
      },

      /*异常状态*/
      exception_state(state) {
        switch (state) {
          case 'content_wrong':
            return '内件不符';

          case 'overweight':
            return '超重';

          case 'embargo':
            return '禁运';
        }
      },

      /*时间格式转换*/
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
