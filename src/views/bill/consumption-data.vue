<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="pageParams" >
        <el-form-item label="出货">
          <el-date-picker
            style="width: 100%"
            v-model="pageParams.in_house_endTime"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入仓">
          <el-date-picker
            style="width: 100%"
            v-model="pageParams.in_house_startTime"
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
          <el-button type="primary" >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="m-t">
      <el-table
        :data="consumption"
        style="width: 100%">
        <el-table-column label="消费流水号">
          <template slot-scope="scope">
            <p>{{scope.row.order_no}} <span class="tag">[订单号]</span></p>
            <p>{{scope.row.pay_no}} <span class="tag">[消费单号]</span></p>
          </template>
        </el-table-column>
        <el-table-column label="预估金额">
          <template slot-scope="scope">
            <p>{{scope.row.amount}} {{scope.row.currency}}</p>
          </template>
        </el-table-column>
        <el-table-column label="消费类型">
          <template slot-scope="scope">
            <p>{{scope.row.fees_type|fees_type}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="getDetail(scope.row.id)">查看明细
            </el-button>
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
    <el-dialog title="费用记录" :visible.sync="detailModal">
      <div class="form-horizontal">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">消费流水号：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.pay_no}}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">订单号：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.order_no}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">消费金额：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.amount}} {{detailData.currency}}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">消费类型：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.fees_type|fees_type}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="detailData.orderPrice">
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">空运单价：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.orderPrice.shipping_price}} {{detailData.orderPrice.price_currency}}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">燃油附加费：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.orderPrice.fuel_surcharge}} {{detailData.orderPrice.price_currency}}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <div class="control-label col-sm-5">战争附加费：</div>
              <div class="col-sm-7">
                <div class="form-control-static">{{detailData.orderPrice.war_surcharge}} {{detailData.orderPrice.price_currency}}</div>
              </div>
            </div>
          </div>
        </div>
        <p>消费明细</p>
        <el-table :data="[0]">
          <el-table-column label="入仓重量">
            <template slot-scope="scope">
              <p>{{detailData.in_house_weight}}</p>
            </template>
          </el-table-column>
          <el-table-column label="订单体积CM">
            <template slot-scope="scope">
            <p>{{detailData.bale_long}}*{{detailData.bale_width}}*{{detailData.bale_height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="计费重量KG">
            <template slot-scope="scope">
              <p>{{detailData.rough_weight}}</p>
            </template>
          </el-table-column>
          <el-table-column label="空运运费">
            <template slot-scope="scope">
              <p>{{detailData.shipping_fees}}</p>
            </template>
          </el-table-column>
          <el-table-column label="燃油附加费">
            <template slot-scope="scope">
              <p>{{detailData.fuel_fees}}</p>
            </template>
          </el-table-column>
          <el-table-column label="战争附加费">
            <template slot-scope="scope">
              <p>{{detailData.war_fees}}</p>
            </template>
          </el-table-column>
          <el-table-column label="总计金额">
            <template slot-scope="scope">
            <p>{{detailData.amount}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="detailModal=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/bill/consumption-data'

  export default {
    name: "consumption-data",
    data(){
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
        pageParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          in_house_endTime:null,//入仓结束时间
          in_house_startTime:null,//入仓开始时间
          shipment_endTime:null,//出货结束时间
          shipment_startTime:null,//出货开始时间
        },
        consumption:null,
        detailModal:false,
        detailData:''
      }
    },
    methods:{
      getConsumptionList(){
        API.list(this.pageParams).then((response=>{
          if(response.code==1){
            this.pageParams.total = response.data.recordsTotal;
            this.consumption=response.data.list
          }
        }))
      },
      getDetail(id){
        API.getDetail({pay_id:id}).then((response=>{
          if(response.code==1){
            this.detailModal=true;
            this.detailData=response.data
            console.log(response)
          }
        }))
      },
      /*page*/
      /*每页显示几条*/
      pageSizeChange(val) {
        this.pageParams.length = val
        this.getConsumptionList()
      },
      /*当前第几页*/
      pageCurrentChange(val) {
        this.pageParams.start = (val - 1) * this.pageParams.length;
        this.getConsumptionList()
      }
    },
    created(){
      this.getConsumptionList()
    },
    filters:{
      fees_type(fees_type){
        switch (fees_type){
          case 'dappend_fees':
            return '订单附加费';

          case 'blend_fees':
            return '订单杂费';

          case 'transport_fees':
            return '订单运输费';

        }
      }
    }
  }
</script>

<style scoped>

</style>
