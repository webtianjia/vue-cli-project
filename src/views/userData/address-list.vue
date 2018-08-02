<template>
  <div>
    <el-card>
      <el-button type="primary" @click="show_createModal('createForm')">新增地址</el-button>
    </el-card>

    <el-card class="m-t">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.person_name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="searchForm.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="m-t">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收件人地址" name="addressee">
          <el-table
            :data="addresseeList"
            style="width: 100%">
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <p>{{scope.row.person_name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                <p>{{scope.row.person_phone}}</p>
              </template>
            </el-table-column>
            <el-table-column label="详细地址">
              <template slot-scope="scope">
                <p>{{scope.row.address}}</p>
              </template>
            </el-table-column>
            <el-table-column label="公司名称">
              <template slot-scope="scope">
                <p>{{scope.row.company_name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                           @click="update_addressee(scope.row)">修改
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="del_addressee(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="发件人地址" name="sender">
          <el-table
            :data="senderList"
            style="width: 100%">
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <p>{{scope.row.person_name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                <p>{{scope.row.person_phone}}</p>
              </template>
            </el-table-column>
            <el-table-column label="详细地址">
              <template slot-scope="scope">
                <p>{{scope.row.address}}</p>
              </template>
            </el-table-column>
            <el-table-column label="公司名称">
              <template slot-scope="scope">
                <p>{{scope.row.company_name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                           @click="update_sender(scope.row)">修改
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="del_sender(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="block m-t text-right">
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
    <el-dialog title="新增收发件人信息" :visible.sync="createModal">
      <el-form :model="createForm" :rules="rules" ref="createForm" label-width="140px">
        <el-form-item label="新增：" prop="addType">
          <el-radio-group v-model="createForm.addType">
            <el-radio label="addressee">收件人</el-radio>
            <el-radio label="sender">发件人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名：" prop="person_name">
          <el-input v-model="createForm.person_name"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="person_phone">
          <el-input v-model="createForm.person_phone"></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="zip_code">
          <el-input v-model="createForm.zip_code"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input type="textarea" v-model="createForm.address"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="company_name">
          <el-input type="textarea" v-model="createForm.company_name"></el-input>
        </el-form-item>
        <el-form-item label="" prop="is_default">
          <el-checkbox v-model="createForm.is_default_bool">设为默认</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_create('createForm')">确定</el-button>
        <el-button @click="createModal=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改信息" :visible.sync="updateModal">
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="140px">
        <el-form-item label="姓名：" prop="person_name">
          <el-input v-model="updateForm.person_name"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="person_phone">
          <el-input v-model="updateForm.person_phone"></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="zip_code">
          <el-input v-model="updateForm.zip_code"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input type="textarea" v-model="updateForm.address"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="company_name">
          <el-input type="textarea" v-model="updateForm.company_name"></el-input>
        </el-form-item>
        <el-form-item label="" prop="is_default">
          <el-checkbox v-model="updateForm.is_default_bool">设为默认</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit_update('updateForm')">确定</el-button>
        <el-button @click="updateModal=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import addresseeAPI from '../../api/userData/address/addressee'
  import senderAPI from '../../api/userData/address/sender'

  export default {
    name: "addressList",
    data() {
      return {
        searchForm: {
          phone: '',
          person_name: ''
        },
        createModal: false,
        updateModal: false,
        activeName: 'addressee',
        addresseeList: null,
        senderList: null,
        createForm: {
          addType: "",
          person_name: '',
          person_phone: '',
          address: '',
          company_name: '',
          is_default_bool: false,
          zip_code: ''
        },
        updateForm: {
          updateType: "",
          person_name: '',
          person_phone: '',
          address: '',
          company_name: '',
          is_default_bool: '',
          zip_code: ''
        },
        rules: {
          addType: [
            {required: true, message: '请选择新增类型', trigger: 'change'}
          ],
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
        },
        pageParams: {
          length: 10,
          sizes: [10, 20, 50, 100],
          start: 0,
          total: 0,
          person_name: null,
          phone: null
        }
      }
    },
    methods: {
      /*表单重置*/
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      show_createModal(createForm) {
        this.createModal = true;
        if (this.$refs[createForm]) {
          this.resetForm(createForm)
        }
      },
      /*提交新建*/
      submit_create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch (this.createForm.addType) {
              case "addressee":
                return addresseeAPI.addAndEdit(this.createForm).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.createModal = false;
                    this.getAddresseeList()
                    this.activeName = 'addressee'
                  }
                });
              case 'sender':
                return senderAPI.addAndEdit(this.createForm).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.createModal = false;
                    this.getSenderList()
                    this.activeName = 'sender'
                  }
                });
            }
          }
        })
      },

      /*切换tab*/
      handleClick(tab, event) {
        switch (tab.name) {
          case 'sender':
            return this.getSenderList();
          case 'addressee':
            return this.getAddresseeList()
        }
      },

      /*更新收件人*/
      update_addressee(row) {
        this.updateForm = row;
        this.updateForm.updateType = 'addressee';
        this.show_updateModal('updateForm');
      },
      show_updateModal(updateForm) {
        this.updateModal = true;
        if (this.$refs[updateForm]) {
          this.resetForm(updateForm)
        }
      },

      /*提交更新*/
      submit_update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch (this.updateForm.updateType) {
              case "addressee":
                return addresseeAPI.addAndEdit(this.updateForm).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.updateModal = false;
                    this.getAddresseeList()
                    this.activeName = 'addressee'
                  }
                });
              case 'sender':
                return senderAPI.addAndEdit(this.updateForm).then((response) => {
                  if (response.code == 1) {
                    this.$message.success(response.msg);
                    this.updateModal = false;
                    this.getSenderList()
                    this.activeName = 'sender'
                  }
                });
            }
          }
        })
      },

      /*删除收件人*/
      del_addressee(id) {
        this.$confirm('确认删除？').then(_ => {
          addresseeAPI.del({
            id: id
          }).then((response) => {
            if (response.code == 1) {
              this.$message.success(response.msg)
              this.getAddresseeList()
            }
          });
          done();
        }).catch(_ => {
        });
      },
      /*获取收件人列表*/
      getAddresseeList() {
        addresseeAPI.list(this.pageParams).then((response) => {
          if (response.code == 1) {
            this.pageParams.total = response.data.recordsTotal;
            this.addresseeList = response.data.list
          }
        })
      },

      /*更新发件人*/
      update_sender(row) {
        this.updateForm = row;
        this.updateForm.updateType = 'sender';
        this.show_updateModal('updateForm');
      },
      /*删除发件人件人*/
      del_sender(id) {
        this.$confirm('确认删除？').then(_ => {
          senderAPI.del({
            id: id
          }).then((response) => {
            if (response.code == 1) {
              this.$message.success(response.msg);
              this.getSenderList()
            }
          });
          done();
        }).catch(_ => {
        });
      },
      /*获取发件人列表*/
      getSenderList() {
        senderAPI.list(this.pageParams).then((response) => {
          if (response.code == 1) {
            this.pageParams.total = response.data.recordsTotal;
            this.senderList = response.data.list
          }
        })
      },

      /*page*/
      /*每页显示几条*/
      pageSizeChange(val) {
        this.pageParams.length = val
        switch (this.activeName) {
          case 'addressee':
            return this.getAddresseeList();
          case 'sender':
            return this.getSenderList();
        }
      },
      /*当前第几页*/
      pageCurrentChange(val) {
        this.pageParams.start = (val - 1) * this.pageParams.length;
        switch (this.activeName) {
          case 'addressee':
            return this.getAddresseeList();
          case 'sender':
            return this.getSenderList();
        }
      }
    },
    created() {
      this.getAddresseeList();
    }
  }
</script>

<style scoped>

</style>
