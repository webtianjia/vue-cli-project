<template>
  <div>
    <v-panel :head="true">
      <button slot="head" class="btn btn-main" @click="addModal=true">发布需求</button>
    </v-panel>
    <v-panel :body="true">
      <div class="form-horizontal" slot="body">
        <div class="form-group">
          <div class="col-md-6 col-lg-4">
            <div class="input-group">
              <input class="form-control" type="text" placeholder="需求新增时间">
              <span class="input-group-addon">
                  To
                </span>
              <input type="text" class="form-control" placeholder="需求新增时间">
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <select class="form-control">
              <option value="0">需求状态</option>
              <option value="1">新需求</option>
              <option value="0">已报价</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-12">
            <button class="btn btn-main" type="button">查询</button>
          </div>
        </div>
      </div>
    </v-panel>
    <v-panel :body="true">
      <table class="table" slot="body">
        <thead>
        <tr>
          <th>需求概述</th>
          <th>时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <div class="row">
              <div class="col-sm-4">
                <p>起运地： 深圳(SZx)</p>
                <p>目的地： 布拉格(RPG)</p>
                <p>货物重量： 99.99Kg</p>
              </div>
              <div class="col-sm-4">
                <p><span class="tag">[门对门]</span></p>
                <p><span class="label label-danger">自主报关</span></p>
              </div>
              <div class="col-sm-4">
                <p>手表  10件</p>
                <p>包机</p>
              </div>
            </div>
          </td>
          <td>
            <p>2017-05-01 15:20:30 <span class="tag">[发布需求]</span></p>
            <p>2017-05-01 15:20:30 <span class="tag">[反馈报价]</span></p>
          </td>
          <td>
            <p>新需求</p>
          </td>
          <td>
            <p><button class="btn btn-sm btn-outline">修改需求</button></p>
            <p><button class="btn btn-sm btn-outline">取消</button></p>
          </td>
        </tr>
        </tbody>
      </table>
    </v-panel>
    <v-modal title="发布需求" v-model="addModal">
      <div slot="body" class="panel">
        <div class="panel-body">
          <div class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-4 control-label">起运地：</label>
              <div class="col-sm-5">
                <input type="text" class="form-control" name="provenance">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">目的地：</label>
              <div class="col-sm-5">
                <input type="text" class="form-control" name="destination">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">货物重量(KG)：</label>
              <div class="col-sm-5">
                <input type="text" class="form-control" name="need_weight">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">服务模式：</label>
              <div class="col-sm-5">
                <select class="form-control" name="service_mode">
                  <option value="-1">请选择服务模式</option>
                  <option value="0">门对门</option>
                  <option value="1">港对港</option>
                  <option value="2">港对门</option>
                  <option value="3">门对港</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">报关方式：</label>
              <div class="col-sm-5">
                <select class="form-control" name="">
                  <option value="-1">请选择报关方式</option>
                  <option value="0">自主报关</option>
                  <option value="1">委托报关</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">货物信息描述：</label>
              <div class="col-sm-5">
                <textarea class="form-control" name="info_describe"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">特殊要求备注：</label>
              <div class="col-sm-5">
                <textarea class="form-control" name="require_remark"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button type="button"  class="btn btn-main" @click="addNeeds">确定</button>
        <button type="button"  class="btn btn-text" @click="closeModal">取消</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import panel from "../../components/panel"
  import modal from "../../components/modal"
  export default {
    name: "needs-list",
    data(){
      return {
        addModal:false
      }
    },
    methods:{
      addNeeds(){
        if($("#add-form").valid()){

        }
      },
      closeModal(){
        this.addModal=false
      }
    },
    mounted(){
      $("#add-form").validate({
        rules: {
          provenance: {
            required: true
          },
          destination:{
            required:true
          },
          need_weight:{
            required:true,
            number:true
          },
          service_mode:{
            required:true
          },

        },
        messages:{
          brandName:{
            required:"品牌主名称不得为空",
            remote:"品牌已存在，请重新输入"
          }
        }
      });
    },
    components:{
      vPanel:panel,
      vModal:modal
    }
  }
</script>

<style scoped>

</style>
