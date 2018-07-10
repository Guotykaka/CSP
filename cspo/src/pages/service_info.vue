<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <!-- 操作行-->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="formInline.valueBT" placeholder="服务名称" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.valueLX" clearable placeholder="请选择角色">
              <el-option v-for="item in RoleData" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary">搜索</el-button>
          </el-col>
        </el-row>
        <!--新增按钮-->
        <el-row class="m_b_15">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-row>

      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=60%>

              <el-form :model="editTable">
                <el-form-item label="服务名称:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="editTable.serviceName" prop auto-complete="off" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务描述:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="editTable.serviceDesc" auto-complete="off" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="商品类别:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input placeholder="服务" auto-complete="off" :disabled="true" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务类别:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input placeholder="平台服务" auto-complete="off" :disabled="true" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="参考价格:" :label-width="formLabelWidth">
                  <el-col :span="5">
                    <el-input v-model="editTable.serviceMinPrice" auto-complete="off" el></el-input>
                  </el-col>
                  <el-col :span="1">
                    <div style="text-align:center">--</div>
                  </el-col>
                  <el-col :span="5">
                    <el-input v-model="editTable.serviceMaxPrice" auto-complete="off" el></el-input>
                  </el-col>
                  <el-col :span="1">
                    <div style="text-align:center">元</div>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="editTable.serviceUnit" clearable placeholder="请选择单位">
                      <el-option label="次" value ="UNIT_SECOND"></el-option>
                      <el-option label="小时" value ="UNIT_HOUR"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务ICON:" :label-width="formLabelWidth">
                  <el-col :span="3">
                    <el-upload
                      class="upload-demo"
                      action="editTable.qrCodeUrl"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :multiple= false
                      list-type= "picture"
                      :limit="1"
                      :on-exceed="handleExceed"
                      >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                  </el-col>
                  <el-col :span="5" :offset="4">
                    <div v-show="dialogVisible">
                        <img :src="editTable.serviceIconUrl" style="width: 370px;height: 200px;">
                    </div>
                  </el-col>
                </el-form-item>
                <el-form-item label="接收端:" :label-width="formLabelWidth">
                  <template slot-scope="scope">
                    <el-checkbox-group  v-model="editTable.roleNames">
                      <el-checkbox v-for="(item,index) in RoleData" :label="item.roleName" :key="item.roleId"></el-checkbox>
                    </el-checkbox-group>
                  </template>
                </el-form-item>
                <el-form-item label="服务介绍"  :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="editTable.roleNames"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="_doCancel()">取消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">保存</el-button>
          </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogCheckVisible" width=40%>
          <el-form :model="selectTable">
            <el-form-item label="公告标题:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.noticeTitle" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公告类型:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.dictName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公告内容:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input type="textarea" :rows="4" v-model="selectTable.noticeContent" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="接收端:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-checkbox-group v-model="selectTable.noticeOsName">
                  <el-checkbox label="运营端" onclick="return false"></el-checkbox>
                  <el-checkbox label="医生端" onclick="return false"></el-checkbox>
                  <el-checkbox label="企业端" onclick="return false"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="dialogCheckVisible = false">返回</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <el-form :model="addTable">
                <el-form-item label="服务名称:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="addTable.serviceName" prop auto-complete="off" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务描述:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="addTable.serviceDesc" auto-complete="off" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="商品类别:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input placeholder="服务" auto-complete="off" :disabled="true" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务类别:" :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input placeholder="平台服务" auto-complete="off" :disabled="true" el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="参考价格:" :label-width="formLabelWidth">
                  <el-col :span="5">
                    <el-input v-model="addTable.serviceMinPrice" auto-complete="off" el></el-input>
                  </el-col>
                  <el-col :span="1">
                    <div style="text-align:center">--</div>
                  </el-col>
                  <el-col :span="5">
                    <el-input v-model="addTable.serviceMaxPrice" auto-complete="off" el></el-input>
                  </el-col>
                  <el-col :span="1">
                    <div style="text-align:center">元</div>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="addTable.serviceUnit" clearable placeholder="请选择单位">
                      <el-option label="次" value="UNIT_SECOND"></el-option>
                      <el-option label="小时" value="UNIT_HOUR"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="服务ICON:" :label-width="formLabelWidth">
                  <el-col :span="3">
                    <el-upload
                      class="upload-demo"
                      action="addTable.qrCodeUrl"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :multiple= false
                      list-type= "picture"
                      :limit="1"
                      :on-exceed="handleExceed"
                      >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                  </el-col>
                  <el-col :span="5" :offset="4">
                    <div v-show="dialogVisible">
                        <img :src="dialogImageUrl" style="width: 370px;height: 200px;">
                    </div>
                  </el-col>
                </el-form-item>
                <el-form-item label="接收端:" :label-width="formLabelWidth">
                  <template slot-scope="scope">
                    <el-checkbox-group  v-model="addTable.roleNames">
                      <el-checkbox v-for="(item,index) in RoleData" :label="item.roleName" :key="item.roleId"></el-checkbox>
                    </el-checkbox-group>
                  </template>
                </el-form-item>
                <el-form-item label="服务介绍"  :label-width="formLabelWidth">
                  <el-col :span="16">
                    <el-input v-model="addTable.roleNames"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="_doAddCancel()">取消</el-button>
            <el-button type="primary" @click="_doAdd()">保存</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column align="center" prop="serviceName" label="服务名称"></el-table-column>
            <el-table-column align="center" prop="roleNames" label="服务角色" width="350"></el-table-column>
            <el-table-column align="center" label="服务状态" width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.serviceStatus === 1">可用</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.serviceStatus === 0">不可用</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="建议价格">
              <template slot-scope="scope">
                <p>{{ scope.row.serviceMinPrice}}-{{ scope.row.serviceMaxPrice}}元/次</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createDate" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="290">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" v-if="scope.row.serviceStatus === 1" @click="FalseStatus(scope.$index, scope.row)">不可用</el-button>
                <el-button size="mini" type="success" v-if="scope.row.serviceStatus === 0" @click="TrueStatus(scope.$index, scope.row)">可用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="6">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import { getUserlistData } from '@/api/getData.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      dialogImageUrl: 'http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/z5o5rqJqcKhbMXBNDTgG89AvrZG5eIK1.png',
      dialogVisible: true,
      RoleData:[{"roleId":4,"roleCode":"123","roleName":"医生角色","remark":"医生角色账号设置","deptId":11,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-22 11:41:55","roleType":"0"},{"roleId":12,"roleCode":null,"roleName":"运营人员","remark":"运营人员","deptId":9,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-07-02 16:36:51","roleType":"1"},{"roleId":29,"roleCode":"003","roleName":"健管师","remark":"健管部门","deptId":11,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-22 16:00:33","roleType":"1,0"},{"roleId":30,"roleCode":"004","roleName":"医生主任","remark":"医生主任","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-20 17:01:31","roleType":"0"},{"roleId":31,"roleCode":"产品","roleName":"产品","remark":"产品","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-05-23 12:00:20","roleType":"1"},{"roleId":32,"roleCode":"sy-js","roleName":"邵勇-角色","remark":"邵勇-角色","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-07-02 16:58:57","roleType":"0"},{"roleId":33,"roleCode":"6","roleName":"sai医生角色","remark":"sai医生角色","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-07-02 16:34:23","roleType":"1"},{"roleId":34,"roleCode":"media","roleName":"媒体号","remark":"社媒","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-25 10:53:49","roleType":"1"},{"roleId":35,"roleCode":"content operator","roleName":"内容编辑","remark":"内容编辑","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-25 11:13:47","roleType":"1"},{"roleId":36,"roleCode":"scb","roleName":"市场部","remark":"市场部","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-27 14:18:42","roleType":"1"},{"roleId":37,"roleCode":"564","roleName":"567","remark":"风帆股份给黑","deptId":null,"deptName":null,"menuIdList":null,"deptIdList":null,"createTime":"2018-06-29 09:31:33","roleType":"1,0"}],
      formInline: {
        optionsLX: [
          {
            value: '选项1',
            label: '版本升级'
          },
          {
            value: '选项2',
            label: '产品推广'
          }
        ],
        optionsZT: [
          {
            value: '选项1',
            label: '待发布'
          },
          {
            value: '选项2',
            label: '已发布'
          },
          {
            value: '选项3',
            label: '已撤销'
          }
        ],
        pickerOptions: {
          disabledDate(time) {
            // return time.getTime() < Date.now();
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        valueBT: '',
        valueCJR: '',
        valueLX: '',
        valueZT: '',
        valueKS: '',
        valueJS: ''
      },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      selectTable: {}, //查看单个数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        serviceType: 'ITEM_PLATFORM_SERVICE',
        serviceDesc: '平台服务-图文咨询',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: '4,29,30',
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '图文咨询',
        serviceIconUrl:
          'http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/O8PUbufKOX6vkmKZhHhNZ3nOQ4sWGrvK.png',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FN2kgWlbMB1j1paBVu1n1DCGD6ymKc3FO.png%22%20alt%3D%22file%22%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E5%A4%A7%E5%A4%A7%E5%A4%A7%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%3C%2Fp%3E',
        serviceId: '8ab2b2f563822d260163822d26fd0000',
        serviceSort: 2,
        roleNames: ["医生角色","运营人员","医生主任"],
        createDate: '2018-05-21 18:09:47'
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
      // 上传方法
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    handleReset() {
      //重置按钮
      this.formInline.valueCJR = ''
      this.formInline.valueBT = ''
      this.formInline.valueLX = ''
      this.formInline.valueZT = ''
      this.formInline.valueKS = ''
      this.formInline.valueJS = ''
      return false
    },
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(`每页 ${size} 条`)
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(`当前页: ${currentPage}`)
    },

    // 新增
    handleAdd() {
      this.dialogAddVisible = true
    },
    // 确定新增
    _doAdd() {
      this.tableData.push(this.addTable)
      this.dialogAddVisible = false
      this.addTable = {
        serviceType: 'ITEM_PLATFORM_SERVICE',
        serviceDesc: '平台服务-图文咨询',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: '4,29,30',
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '图文咨询',
        serviceIconUrl:
          'http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/O8PUbufKOX6vkmKZhHhNZ3nOQ4sWGrvK.png',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FN2kgWlbMB1j1paBVu1n1DCGD6ymKc3FO.png%22%20alt%3D%22file%22%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E5%A4%A7%E5%A4%A7%E5%A4%A7%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%3C%2Fp%3E',
        serviceId: '8ab2b2f563822d260163822d26fd0000',
        serviceSort: 2,
        roleNames: ["医生角色","运营人员","医生主任"],
        createDate: '2018-05-21 18:09:47'
      }
      this.$message({
        type: 'success',
        message: '新增服务成功!'
      })
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        serviceType: 'ITEM_PLATFORM_SERVICE',
        serviceDesc: '平台服务-图文咨询',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: '4,29,30',
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '图文咨询',
        serviceIconUrl:
          'http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/O8PUbufKOX6vkmKZhHhNZ3nOQ4sWGrvK.png',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2Fzhangshangtijian.b0.upaiyun.com%2FCSPO%2FDEV%2FN2kgWlbMB1j1paBVu1n1DCGD6ymKc3FO.png%22%20alt%3D%22file%22%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6%E5%A4%A7%E5%A4%A7%E5%A4%A7%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%E5%A4%9A%3C%2Fp%3E',
        serviceId: '8ab2b2f563822d260163822d26fd0000',
        serviceSort: 2,
        roleNames: ["医生角色","运营人员","医生主任"],
        createDate: '2018-05-21 18:09:47'
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 查看
    handleCheck(index, row) {
      this.selectTable = row
      this.dialogCheckVisible = true
    },
    // 修改
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
    },
    //确定修改
    _doHandleEdit() {
      this.dialogEditVisible = false
      this.$message({
        type: 'success',
        message: '修改成功!'
      })
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      this.$message({
        type: 'warning',
        message: '取消修改'
      })
    },
    // 删除提示
    deleteMessage(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.tableData.splice(
            index + (this.currentPage - 1) * this.pagesize,
            1
          ) //删除
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          })
        })
    },
    // 可用
    TrueStatus(index, row) {
      this.$confirm('此操作将更改服务状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '服务状态改为可用!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].serviceStatus = 1 //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改服务状态'
          })
        })
    },
    // 不可用
    FalseStatus(index, row) {
      this.$confirm('此操作将更改服务状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '服务状态改为不可用!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].serviceStatus = 0 //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改服务状态'
          })
        })
    },
    //获取用户列表
    getNoticeList() {
      this.$http
        .post('http://localhost:8080/api/service_info')
        .then(response => {
          this.tableData = []
          this.tableData = this.tableData.concat(response.data.data)
          // response.data.data.forEach(item => {
          //   const tableData = {}
          //   tableData.username = item.username
          //   this.tableData.push(tableData)
          // })
        })
    }
  },
  created: function() {
    this.getNoticeList()
  }
}
</script>

<style lang="less" scoped>
.dot {
  width: 100%;
}
.el-select {
  display: block;
}
.el-date-editor {
  width: 100%;
}
.el-input {
  margin-bottom: 15px;
}
.link-line {
  position: absolute;
  top: 0;
  right: 70%;
  line-height: 34px;
  width: 25px;
  text-align: center;
}
// .el-form-item {margin-bottom: 0}
// .el-checkbox+.el-checkbox{margin: 0}
.el-checkbox {margin-left: 10px}
</style>
