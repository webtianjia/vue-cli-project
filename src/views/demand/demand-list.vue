<template>
  <div>
    <el-card>
      <el-button type="primary" @click="create_demand">发布需求</el-button>
    </el-card>
    <el-card class="m-t">
      <el-form el-form :inline="true" :model="demandParams">
        <el-form-item>
          <el-date-picker
            style="width: 100%"
            v-model="demandParams.create_end_time"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select class="m-l-lg" v-model="demandParams.state" placeholder="请选择服务模式">
            <el-option label="新需求" value="new_demand"></el-option>
            <el-option label="已报价" value="make_offers"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="m-t">
      <el-table
        :data="demand_data"
        style="width: 100%">
        <el-table-column label="需求概述" width="600">
          <template slot-scope="scope">
            <div class="row">
              <div class="col-sm-4">
                <p>起运地： {{scope.row.provenance}}({{scope.row.provenance_code}})</p>
                <p>目的地： {{scope.row.destination}}({{scope.row.destination_code}})</p>
                <p>货物重量：{{scope.row.need_weight}}KG</p>
              </div>
              <div class="col-sm-4">
                <p><span class="tag">[{{scope.row.service_mode|service_mode}}]</span></p>
                <p><span class="label label-danger">{{scope.row.declaration_type|declaration_type}}</span></p>
              </div>
              <div class="col-sm-4">
                <p>{{scope.row.info_describe}}</p>
                <p>{{scope.row.require_remark}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p> {{ scope.row.create_time|formatDate }} <span class="tag">[发布需求]</span></p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p>{{scope.row.state|status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state=='make_offers'"
                       size="mini"
                       @click="show_scheme_quotation_Modal(scope.row.id)">查看报价
            </el-button>
            <el-button v-if="scope.row.state!='make_offers'&&scope.row.state!='is_confirm'"
                       size="mini"
                       @click="update_demand(scope.$index, scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.state!='cancel'"
                       size="mini"
                       type="danger"
                       @click="cancel_demand(scope.row.id)">取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block text-right m-t">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="demandParams.start"
          :page-sizes="demandParams.sizes"
          :page-size="demandParams.length"
          layout="total, sizes, prev, pager, next, jumper"
          :total="demandParams.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="发布需求" :visible.sync="createModal">
      <el-form :model="createForm" :rules="rules" ref="createForm" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="起运地：" prop="provenance_str">
              <el-select
                v-model="createForm.provenance_str"
                filterable
                remote
                reserve-keyword
                placeholder="请选择起运地"
                :remote-method="remoteMethod">
                <el-option
                  v-for="item in clientAirport"
                  :key="item.id"
                  :label="item.airpor_code +'('+item.airport_name_zh+')'"
                  :value="item.airport_name_zh+','+item.airpor_code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地：" prop="destination_str">
              <el-select
                v-model="createForm.destination_str"
                filterable
                remote
                reserve-keyword
                placeholder="请选择目的地"
                :remote-method="remoteMethod">
                <el-option
                  v-for="item in clientAirport"
                  :key="item.id"
                  :label="item.airpor_code +'('+item.airport_name_zh+')'"
                  :value="item.airport_name_zh+','+item.airpor_code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货物重量(KG)：" prop="need_weight">
              <el-input v-model="createForm.need_weight" style="width: 217px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务模式：" prop="service_mode">
              <el-select v-model="createForm.service_mode" placeholder="请选择服务模式">
                <el-option label="门对门" value="door_to_door"></el-option>
                <el-option label="港对港" value="port_to_door"></el-option>
                <el-option label="港对门" value="door_to_port"></el-option>
                <el-option label="门对港" value="port_to_port"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报关方式：" prop="declaration_type">
              <el-select v-model="createForm.declaration_type" placeholder="请选择服务模式">
                <el-option label="自主报关" value="autonomy"></el-option>
                <el-option label="委托报关" value="entrust"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="货物信息描述：" prop="info_describe">
          <el-input type="textarea" v-model="createForm.info_describe"></el-input>
        </el-form-item>
        <el-form-item label="特殊要求备注：" prop="require_remark">
          <el-input type="textarea" v-model="createForm.require_remark"></el-input>
        </el-form-item>
        <el-form-item label="提货信息：">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人：" prop="pick_up_name">
                    <el-input v-model="createForm.pick_up_name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话：" prop="pick_up_name">
                    <el-input v-model="createForm.pick_up_phone"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="详细地址：" prop="pick_up_address">
                    <el-input type="textarea" v-model="createForm.pick_up_address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_create('createForm')">确定</el-button>
        <el-button @click="createModal=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改需求" :visible.sync="updateModal">
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="起运地：" prop="provenance_str">
              <el-select
                @change="$set(updateForm,updateForm.provenance_str)"
                v-model="updateForm.provenance_str"
                filterable
                remote
                reserve-keyword
                placeholder="请选择起运地"
                :remote-method="remoteMethod">
                <el-option
                  v-for="item in clientAirport"
                  :key="item.id"
                  :label="item.airpor_code+'('+item.airport_name_zh+')'"
                  :value="item.airpor_code+','+item.airport_name_zh">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地：" prop="destination_str">
              <el-select
                @change="$set(updateForm,updateForm.destination_str)"
                v-model="updateForm.destination_str"
                filterable
                remote
                reserve-keyword
                placeholder="请选择目的地"
                :remote-method="remoteMethod">
                <el-option
                  v-for="item in clientAirport"
                  :key="item.id"
                  :label="item.airpor_code +'('+item.airport_name_zh+')'"
                  :value="(item.airport_name_zh+','+item.airpor_code)">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货物重量(KG)：" prop="need_weight">
              <el-input v-model="updateForm.need_weight" style="width: 217px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务模式：" prop="service_mode">
              <el-select v-model="updateForm.service_mode" placeholder="请选择服务模式">
                <el-option label="门对门" value="door_to_door"></el-option>
                <el-option label="港对港" value="port_to_door"></el-option>
                <el-option label="港对门" value="door_to_port"></el-option>
                <el-option label="门对港" value="port_to_port"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报关方式：" prop="declaration_type">
              <el-select v-model="updateForm.declaration_type" placeholder="请选择服务模式">
                <el-option label="自主报关" value="autonomy"></el-option>
                <el-option label="委托报关" value="entrust"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="货物信息描述：" prop="info_describe">
          <el-input type="textarea" v-model="updateForm.info_describe"></el-input>
        </el-form-item>
        <el-form-item label="特殊要求备注：" prop="require_remark">
          <el-input type="textarea" v-model="updateForm.require_remark"></el-input>
        </el-form-item>
        <el-form-item label="提货信息：">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人：" prop="pick_up_name">
                    <el-input v-model="updateForm.pick_up_name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话：" prop="pick_up_name">
                    <el-input v-model="updateForm.pick_up_phone"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="详细地址：" prop="pick_up_address">
                    <el-input type="textarea" v-model="updateForm.pick_up_address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_update('updateForm')">确定</el-button>
        <el-button @click="updateModal=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="方案报价" :visible.sync="scheme_quotation_Modal">
      <div class="form-horizontal">
        <el-row v-if="scheme_quotation_data&&scheme_quotation_data.needOrderEntity">
          <el-col :span="10">
            <div class="form-control-static text-center">
              <div>
                <span>起运地：{{scheme_quotation_data.needOrderEntity.provenance}}</span>
                <span class="m-l m-r">  -->></span>
                <span>目的地：{{scheme_quotation_data.needOrderEntity.destination}}</span>
              </div>
              <div>{{scheme_quotation_data.needOrderEntity.need_weight}}KG</div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="form-group">
              <label class="col-sm-8 control-label">服务模式：</label>
              <div class="col-sm-4">
                <div class="form-control-static">{{scheme_quotation_data.needOrderEntity.service_mode|service_mode}}
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="form-group">
              <label class="col-sm-8 control-label">报关方式：</label>
              <div class="col-sm-4">
                <div class="form-control-static">
                  {{scheme_quotation_data.needOrderEntity.declaration_type|declaration_type}}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-table v-if="scheme_quotation_data&&scheme_quotation_data.schemePriceList"
                  :data="scheme_quotation_data.schemePriceList"
                  style="width: 100%" slot="body">
          <el-table-column label="运输路线">
            <template slot-scope="scope">
              <p>
                {{scheme_quotation_data.needOrderEntity.provenance}}-{{scope.row.ransit}}-{{scheme_quotation_data.needOrderEntity.destination}}</p>
            </template>
          </el-table-column>
          <el-table-column label="空运价格">
            <template slot-scope="scope">
              <p> {{ scope.row.shipping_price}}{{scope.row.price_currency}}</p>
            </template>
          </el-table-column>
          <el-table-column label="燃油附加">
            <template slot-scope="scope">
              <p>{{scope.row.fuel_surcharge}}{{scope.row.price_currency}}</p>
            </template>
          </el-table-column>
          <el-table-column label="战争附加">
            <template slot-scope="scope">
              <p>{{scope.row.war_surcharge}}{{scope.row.price_currency}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="show_quotation_detail(scope.row)">报价详情
              </el-button>
              <el-button
                size="mini"
                @click="show_create_order(scope.row)">我要订舱
              </el-button>
            </template>

          </el-table-column>
        </el-table>
        <div class="block text-right m-t">
          <el-pagination
            @size-change="makeOfferspageSizeChange"
            @current-change="makeOfferspageCurrentChange"
            :current-page="makeOffersParams.start"
            :page-sizes="makeOffersParams.sizes"
            :page-size="makeOffersParams.length"
            layout="total, sizes, prev, pager, next, jumper"
            :total="makeOffersParams.total">
          </el-pagination>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="scheme_quotation_Modal=false">再看看</el-button>
      </div>
      <el-dialog title="方案详情" :visible.sync="quotation_detail_Modal" append-to-body>
        <el-table v-if="scheme_quotation_data && scheme_quotation_detail"
                  :data="scheme_quotation_detail"
                  style="width: 100%">
          <el-table-column label="币种">
            <template slot-scope="scope">
              <p>{{scope.row.price_currency}}</p>
            </template>
          </el-table-column>
          <el-table-column label="M">
            <template slot-scope="scope">
              <p>{{scope.row.min_freight}}</p>
            </template>
          </el-table-column>
          <el-table-column label="N">
            <template slot-scope="scope">
              <p>{{scope.row.zero_to_forty_five_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="+45KG">
            <template slot-scope="scope">
              <p>{{scope.row.forty_five_to_one_hun_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="+100KG">
            <template slot-scope="scope">
              <p>{{scope.row.one_hun_to_three_hun_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="+300KG">
            <template slot-scope="scope">
              <p>{{scope.row.three_hun_to_five_hun_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="+500KG">
            <template slot-scope="scope">
              <p>{{scope.row.five_hun_to_th_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="+1000KG">
            <template slot-scope="scope">
              <p>{{scope.row.th_above_price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="燃油附加">
            <template slot-scope="scope">
              <p>{{scope.row.fuel_surcharge}}</p>
            </template>
          </el-table-column>
          <el-table-column label="战争附加">
            <template slot-scope="scope">
              <p>{{scope.row.war_surcharge}}</p>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="m-t">
          <el-col :span="10">
            <el-card>
              <div slot="header">
                起运地杂费备注
              </div>
              <div v-if="scheme_quotation_detail[0]">
                {{scheme_quotation_detail[0].provenance_fees_remarks}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card class="m-l-lg">
              <div slot="header">
                目的地杂费备注
              </div>
              <div v-if="scheme_quotation_detail[0]">
                {{scheme_quotation_detail[0].destination_fees_remarks}}
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="quotation_detail_Modal=false">我知道了</el-button>
        </div>
      </el-dialog>
      <el-dialog title="订舱信息录入" :visible.sync="create_order_Modal" append-to-body>
        <div class="form-horizontal">
          <el-row v-if="scheme_quotation_data&&scheme_quotation_data.needOrderEntity">
            <el-col :span="10">
              <div class="form-control-static text-center">
                <div>
                  <span>起运地：{{scheme_quotation_data.needOrderEntity.provenance}}</span>
                  <span class="m-l m-r">  -->></span>
                  <span>目的地：{{scheme_quotation_data.needOrderEntity.destination}}</span>
                </div>
                <div>{{scheme_quotation_data.needOrderEntity.need_weight}}KG</div>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="form-group">
                <label class="col-sm-8 control-label">服务模式：</label>
                <div class="col-sm-4">
                  <div class="form-control-static">{{scheme_quotation_data.needOrderEntity.service_mode|service_mode}}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="form-group">
                <label class="col-sm-8 control-label">报关方式：</label>
                <div class="col-sm-4">
                  <div class="form-control-static">
                    {{scheme_quotation_data.needOrderEntity.declaration_type|declaration_type}}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

            <!--货物明细-->
          <el-form ref="create_order_data" :rules="orderRules"  :model="create_order_data" label-width="180px">
            <el-card>
              <div slot="header">货物明细</div>
              <el-table :data="create_order_data.goodsDetailList">
                <el-table-column label="中文名称">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.name_zh'"
                                  :rules="[{ required: true, message: '请输入中文名称', trigger: 'change'}]"
                    >
                      <el-input size="small" v-model="scope.row.name_zh"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="英文名称">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.name_en'"
                                  :rules="[{ required: true, message: '请输入英文名称', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.name_en"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="数量(件)">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.goods_num'"
                                  :rules="[{ required: true, message: '请输入数量', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.goods_num"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="总体积(CBM)">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.goods_volume'"
                                  :rules="[{ required: true, message: '请输入总体积', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.goods_volume"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="最大尺寸(长*宽*高)">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.goods_long'"
                                  :rules="[{ required: true, message: '请输入长', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.goods_long">
                      <template slot="prepend">长</template>
                    </el-input>
                    </el-form-item>
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.goods_width'"
                                  :rules="[{ required: true, message: '请输入宽', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.goods_width">
                      <template slot="prepend">宽</template>
                    </el-input>
                    </el-form-item>
                    <el-form-item label-width="0" :prop="'goodsDetailList.'+scope.$index+'.goods_height'"
                                  :rules="[{ required: true, message: '请输入高', trigger: 'change'}]"
                    >
                    <el-input size="small" v-model="scope.row.goods_height">
                      <template slot="prepend">高</template>
                    </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <p v-if="create_order_data.goodsDetailList.length>1">
                      <el-button size="mini" @click="delRow(index)" type="danger">删除</el-button>
                    </p>
                    <p v-if="scope.$index==create_order_data.goodsDetailList.length-1">
                      <el-button size="mini" @click="addRow" type="primary">新增</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <!--收发件人form-->
            <el-card class="m-t">
              <el-row slot="header">
                <el-col :span="12"> 收件人信息</el-col>
                <el-col :span="12" class="text-right">
                  <el-button type="primary" size="small" @click="createAddressee('createAddresseeANDsender')">新增收件人</el-button>
                </el-col>
              </el-row>
              <el-form-item label="选择收件人" prop="recipient_id">
                <el-select
                  v-model="create_order_data.recipient_id"
                  filterable
                  reserve-keyword
                  placeholder="请选择收件人">
                  <el-option
                    v-for="item in addresseeList"
                    :key="item.id"
                    :label="item.company_name +'('+item.person_phone+')'"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-card>
            <el-card class="m-t">
              <el-row slot="header">
                <el-col :span="12"> 发件人信息</el-col>
                <el-col :span="12" class="text-right">
                  <el-button type="primary" size="small" @click="createSender('createAddresseeANDsender')">新增发件人</el-button>
                </el-col>
              </el-row>
              <el-form-item label="选择发件人" prop="sender_id">
                <el-select
                  v-model="create_order_data.sender_id"
                  filterable
                  reserve-keyword
                  placeholder="请选择发件人">
                  <el-option
                    v-for="item in senderList"
                    :key="item.id"
                    :label="item.company_name +'('+item.person_phone+')'"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-card>
          </el-form>
        </div>
        <div slot="footer" class="text-center">
          <el-button type="primary" @click="submit_create_order('create_order_data')">帮我订舱</el-button>
          <el-button @click="create_order_Modal=false">我在看看</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增收发件人信息" :visible.sync="addresseeANDsenderModal" append-to-body>
        <el-form :model="createAddresseeANDsender" :rules="createAddresseeANDsenderrules" ref="createAddresseeANDsender"
                 label-width="140px">
          <el-form-item label="姓名：" prop="person_name">
            <el-input v-model="createAddresseeANDsender.person_name"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="person_phone">
            <el-input v-model="createAddresseeANDsender.person_phone"></el-input>
          </el-form-item>
          <el-form-item label="邮编：" prop="zip_code">
            <el-input v-model="createAddresseeANDsender.zip_code"></el-input>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input type="textarea" v-model="createAddresseeANDsender.address"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="company_name">
            <el-input type="textarea" v-model="createAddresseeANDsender.company_name"></el-input>
          </el-form-item>
          <el-form-item label="" prop="is_default">
            <el-checkbox v-model="createAddresseeANDsender.is_default_bool">设为默认</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="text-center">
          <el-button type="primary" @click="submit_createAddresseeANDaddressee('createAddresseeANDsender')">确定
          </el-button>
          <el-button @click="addresseeANDsenderModal=false">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>

  </div>
</template>
<script>
  import API from '../../api/demand/demand'
  import COMMON from '../../api/common'
  import {formatDate} from '../../assets/js/date'
  import addresseeAPI from '../../api/userData/address/addressee'
  import senderAPI from '../../api/userData/address/sender'
  import qs from 'qs'
  export default {
    name: "demand-list",
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        createModal: false,//发布需求弹框
        updateModal: false,//修改需求弹框
        createForm: {
          provenance_str: "",//起运地
          destination_str: '',//目的地
          need_weight: '',//货物需求重量
          service_mode: '',//服务模式
          info_describe: '',//货物信息描述
          require_remark: '',//特殊要求备注
          declaration_type: "",//报关方式
          pick_up_name: '',//联系人
          pick_up_phone: '',//联系电话
          pick_up_address: '',//详细地址
          id: 0
        },
        updateForm: {
          provenance_str: "",//起运地
          destination_str: '',//目的地
          need_weight: '',//货物需求重量
          service_mode: '',//服务模式
          info_describe: '',//货物信息描述
          require_remark: '',//特殊要求备注
          declaration_type: "",//报关方式
          pick_up_name: '',//联系人
          pick_up_phone: '',//联系电话
          pick_up_address: '',//详细地址
          id: 0
        },
        rules: {
          provenance_str: [
            {required: true, message: '请选择起运地', trigger: 'blur'}
          ],
          destination_str: [
            {required: true, message: '请选择目的地', trigger: 'blur'}
          ],
          need_weight: [
            {required: true, message: '请输入货物重量', trigger: 'blur'}
          ],
          service_mode: [
            {required: true, message: '请选择服务模式', trigger: 'blur'}
          ],
          info_describe: [
            {required: true, message: '请输入货物信息描述', trigger: 'blur'}
          ],
          require_remark: [
            {required: true, message: '请输入特殊要求备注', trigger: 'blur'}
          ],
          declaration_type: [
            {required: true, message: '请选择报关方式', trigger: 'blur'}
          ]
        },
        scheme_quotation_Modal: false,//方案报价弹框,
        quotation_detail_Modal: false,//报价详情弹框
        create_order_Modal: false,//订舱录入弹框
        create_order_data: {//订舱录入数据
          demandMsg: null,
          goodsDetailList: [
            {
              goods_height: '',//高
              goods_long: '',//长
              goods_num: '',//数量
              goods_volume: '',//体积
              goods_width: '',//宽
              name_en: '',//英文
              name_zh: ''//中文
            }
          ],
          need_order_id: null,//订单ID
          recipient_id: null,//收件人信息
          sender_id: null,//发件人信息
          scheme_price_id: null//方案报价ID
        },
        orderRules: {
          recipient_id: [
            {required: true, message: '请选择收件人', trigger: 'change'}
          ],
          sender_id: [
            {required: true, message: '请选择发件人', trigger: 'change'}
          ]
        },
        demand_data: null,//需求列表
        scheme_quotation_data: null,//方案报价
        scheme_quotation_detail: [],//方案详情
        demandParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          create_end_time: null,
          create_start_time: null,
          state: null
        },//需求列表分页
        makeOffersParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          id: null
        },//报价分页
        clientAirport: [],//起运地和目的地
        remoteMethodLoding: false,//远程搜索loading

        addresseeList: null,//收件人列表
        senderList: null,//发件人列表
        addresseeANDsenderModal: false,//添加收发件人弹框
        addresseeParamsANDsenderParams: {
          length: 100000,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          person_name: null,
          phone: null
        },//收发件人列表分页
        createAddresseeANDsender: {
          addType: "",
          person_name: '',
          person_phone: '',
          address: '',
          company_name: '',
          is_default_bool: false,
          zip_code: ''
        },//收发件人表单
        createAddresseeANDsenderrules: {
          person_name: [
            {required: true, message: '请输入姓名', trigger: 'change'}
          ],
          person_phone: [
            {required: true, message: '请输入电话', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请输入地址', trigger: 'change'}
          ],
          zip_code: [
            {required: true, message: '请输入邮编', trigger: 'change'}
          ],
          company_name: [
            {required: true, message: '请输入公司名称', trigger: 'change'}
          ]
        },//收发件人验证规则
      }
    },
    methods: {
      /*
      * 发布需求
      * */
      create_demand() {
        this.show_create_modal('createForm')
      },
      /*
      * 初始化发布需求
      * */
      show_create_modal(createForm) {
        this.createModal = true;
        this.resetForm(createForm)
      },
      /*
      * 提交新需求
      * */
      submit_create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API.addAndUpdateNeedOrder(this.createForm).then((response) => {
              if (response.code == 1) {
                this.$message.success(response.msg);
                this.createModal = false;
                this.getDemandList()
              }
            })
          }
        })
      },

      /*
      * 删除需求
      * */
      cancel_demand(id) {
        this.$confirm('确认取消？').then(_ => {
          API.cancelNeedOrder({
            ids: id
          }).then((response) => {
            if (response.code == 1) {
              this.$message.success(response.msg)
              this.getDemandList()
            }
          });
          done();
        }).catch(_ => {
        });
      },

      /*
         * 修改需求
         * */
      update_demand(index, row) {
        this.updateForm = row;
        this.updateForm.provenance_str = row.provenance_code + ',' + row.provenance;
        this.updateForm.destination_str = row.destination_code + ',' + row.destination;
        this.show_update_modal('updateForm')
      },

      /*
      * 初始化修改需求
      * */
      show_update_modal(updateForm) {
        this.updateModal = true;
        this.resetForm(updateForm)
      },
      /*
     * 提交修改
     * */
      submit_update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API.addAndUpdateNeedOrder(this.updateForm).then((response) => {
              if (response.code == 1) {
                this.$message.success(response.msg);
                this.updateModal = false;
                this.getDemandList()
              }
            })
          }
        })
      },

      /*
      * 表单重置
      * */
      resetForm(formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields();
        }
      },

      /*方案报价*/
      show_scheme_quotation_Modal(id) {
        this.scheme_quotation_Modal = true;
        this.getMakeOffers(id)
      },

      /*打开报价详情*/
      show_quotation_detail(row) {
        this.scheme_quotation_detail[0] = row;
        this.quotation_detail_Modal = true
      },

      /*打开我要订舱*/
      show_create_order(row) {
        this.create_order_Modal = true;
        this.create_order_data.demandMsg = row;//显示需求信息
        this.create_order_data.scheme_price_id = row.id;//报价id
        this.create_order_data.need_order_id = this.scheme_quotation_data.needOrderEntity.id;//需求订单id

        /*初始化重置*/
        this.create_order_data.goodsDetailList=[{
          goods_height: '',//高
          goods_long: '',//长
          goods_num: '',//数量
          goods_volume: '',//体积
          goods_width: '',//宽
          name_en: '',//英文
          name_zh: ''//中文
        }];
        this.resetForm("create_order_data")
      },
      /*添加一行货物*/
      addRow() {
        this.create_order_data.goodsDetailList.push({
          goods_height: '',//高
          goods_long: '',//长
          goods_num: '',//数量
          goods_volume: '',//体积
          goods_width: '',//宽
          name_en: '',//英文
          name_zh: ''//中文
        })
      },
      /*删除一行货物*/
      delRow(index) {
        this.$confirm('确认删除？').then(_ => {
          this.create_order_data.goodsDetailList.splice(index, 1)
          done();
        }).catch(_ => {
        });
      },
      /*提交订舱*/
      submit_create_order(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = this.create_order_data;
                data.goodsDetailList=JSON.stringify(data.goodsDetailList)
            API.booking(data).then((response) => {
              if (response.code == 1) {
                this.$message.success(response.msg)
                this.create_order_Modal = false
              }
            })
          }
        })

      },

      /*获取需求列表*/
      getDemandList() {//获取需求列表
        API.list(this.demandParams).then((response) => {
          if (response.code == 1) {
            this.demandParams.total = response.data.recordsTotal;
            this.demand_data = response.data.list
          }
        })
      },
      /*需求列表每页显示几条*/
      pageSizeChange(val) {
        this.demandParams.length = val;
        this.getDemandList()
      },
      /*需求列表当前第几页*/
      pageCurrentChange(val) {
        this.demandParams.start = (val - 1) * this.demandParams.length;
        this.getDemandList()
      },


      /*获取报价列表*/
      getMakeOffers(id) {
        if(id){
          this.makeOffersParams.id = id
        }
        API.getMakeOffers(this.makeOffersParams).then((response) => {
          if (response.code == 1) {
            this.makeOffersParams.total = response.data.recordsTotal
            this.scheme_quotation_data = response.data
          }
        })
      },
      /*报价列表每页显示几条*/
      makeOfferspageSizeChange(val) {
        this.makeOffersParams.length = val;
        this.getMakeOffers()
      },
      /*报价列表当前第几页*/
      makeOfferspageCurrentChange(val) {
        this.makeOffersParams.start = (val - 1) * this.makeOffersParams.length;
        this.getMakeOffers()
      },


      /*获取起运地&目的地*/
      getClientAirport() {
        COMMON.clientAirport().then((response) => {
          if (response.code == 1) {
            this.clientAirport = response.data.list
          }
        })
      },
      /*起运地目的地远程搜索 :todo 暂无*/
      remoteMethod(query) {//起运目的地远程搜索
        /*   if (query !== '') {
             this.remoteMethodLoding = true;
           } else {
             this.clientAirport = [];
           }*/
      },

      /*获取收件人列表*/
      getAddresseeList() {
        addresseeAPI.list(this.addresseeParamsANDsenderParams).then((response) => {
          if (response.code == 1) {
            this.addresseeList = response.data.list
          }
        })
      },
      /*获取发件人列表*/
      getSenderList() {
        senderAPI.list(this.addresseeParamsANDsenderParams).then((response) => {
          if (response.code == 1) {
            this.senderList = response.data.list
          }
        })
      },
      /*新建收件人*/
      createAddressee(createForm) {
        this.createAddresseeANDsender.addType = 'addressee';
        this.addresseeANDsenderModal = true;
        this.resetForm(createForm)
      },
      /*新建发件人*/
      createSender(createForm) {
        this.createAddresseeANDsender.addType = 'sender';
        this.addresseeANDsenderModal = true;
        this.resetForm(createForm)
      },
      /*提交新建收发件人*/
      submit_createAddresseeANDaddressee(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch (this.createAddresseeANDsender.addType) {
              case "addressee":
                return addresseeAPI.addAndEdit(this.createAddresseeANDsender).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.addresseeANDsenderModal = false;
                    this.getAddresseeList()
                  }
                });
              case 'sender':
                return senderAPI.addAndEdit(this.createAddresseeANDsender).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.addresseeANDsenderModal = false;
                    this.getSenderList()
                  }
                });
            }
          }
        })
      },
    },
    created() {
      this.getDemandList();
      this.getClientAirport()
      this.getAddresseeList();
      this.getSenderList();
    },
    filters: {
      /* 需求状态*/
      status(status) {
        switch (status) {
          case 'new_demand':
            return '新需求';
          case 'make_offers':
            return '已报价';
          case 'is_confirm':
            return '已确认';
          case 'cancel':
            return '已取消';
        }
      },
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
      /*时间格式转换*/
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

