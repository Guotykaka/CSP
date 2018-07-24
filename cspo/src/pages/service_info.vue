<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
          <el-form :model="searchParams" :inline="true" class="demo-form-inline">
            <el-col :span="8">
          <el-form-item label="服务名称：">
         <el-input v-model="searchParams.name" placeholder="服务名称" @keyup.enter.native="doSearch()" clearable class="inpwidth"></el-input>
          </el-form-item>
            </el-col>
             <el-col :span="8">
          <el-form-item label="请选择角色：">
              <el-select v-model="searchParams.role" clearable placeholder="请选择角色"  class="inpwidth">
                <el-option v-for="item in RoleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="doSearch()" class="m_l_15">搜索</el-button>
            
          </el-form-item>
          </el-col>
         
          </el-form>
          </el-row>
           <el-row>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-row>
        </el-header>

        <el-main>

          <!-- 列表 -->
          <template>
            <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" prop="serviceName" label="服务名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="roleNames" label="服务角色" min-width="100%"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="服务状态"  min-width="100%">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="success" v-if="scope.row.serviceStatus === 1">可用</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.serviceStatus === 0">不可用</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="commodityBinding" label="绑定商品"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip align="center" label="建议价格">
                <template slot-scope="scope">
                  <p>{{ scope.row.serviceMinPrice}}-{{ scope.row.serviceMaxPrice}}元/次</p>
                </template>
              </el-table-column> -->
              <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间"></el-table-column>
              <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" v-if="scope.row.serviceStatus === 1" @click="FalseStatus(scope.$index, scope.row)">不可用</el-button>
                  <el-button size="mini" type="success" v-if="scope.row.serviceStatus === 0" @click="TrueStatus(scope.$index, scope.row)">可用</el-button>
                  <el-button size="mini" type="warning" v-if="scope.row.serviceType === '10000'&scope.row.itemType === 'ITEM_PRODUCT_TYPE'" @click="GoodsMan()">商品管理</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-main>

        <el-footer height="30px">
          <el-row style="margin-top: 2%;">
            <el-col :span="24" :offset="8">
              <template>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                </el-pagination>
              </template>
            </el-col>
          </el-row>
        </el-footer>
      </div>


      <!-- 修改弹窗 -->
      <el-dialog title="修改" :visible.sync="dialogEditVisible" width=60% v-bind:show-close = "false">

        <el-form :model="editTable">
          <el-form-item class="is-required" label="服务名称:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model="editTable.serviceName" prop auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="服务描述:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model="editTable.serviceDesc" auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="商品类别:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input placeholder="服务" auto-complete="off" :disabled="true" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="服务类别:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input placeholder="平台服务" auto-complete="off" :disabled="true" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="参考价格:" :label-width="formLabelWidth">
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
                <el-option label="次" value="UNIT_SECOND"></el-option>
                <el-option label="小时" value="UNIT_HOUR"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="服务ICON:" :label-width="formLabelWidth">
            <el-col :span="3">
              <el-upload class="upload-demo" action="http://172.0.0.41:8117/cspo/csp/serviceInfo/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="onsuccess"  :multiple=false list-type="picture" :limit="1" :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
            <el-col :span="5" :offset="4">
              <div v-show="editTable.serviceIconUrl">
                <img :src="editTable.serviceIconUrl" style="width: 370px;height: 200px;">
              </div>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required" label="服务角色:" :label-width="formLabelWidth">
            <template slot-scope="scope">
              <el-checkbox-group v-model="editTable.serviceRole">
                <el-checkbox v-for="(item,index) in RoleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
          <el-form-item class="is-required" label="服务介绍" :label-width="formLabelWidth">
            <el-col :span="24">
              <!-- <el-input class="selector"  type="textarea" v-html="editTable.serviceIntroduce"></el-input> -->
              <quill-editor 
                v-model="editTable.serviceIntroduce" 
                ref="myQuillEditor" 
                :options="editorOption" 
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
              </quill-editor>
            </el-col>
          </el-form-item>
        </el-form>

       
        <div class="btn-row">
        <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
        <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
        </div>
      </el-dialog>
      <!-- 新增弹窗 -->
      <el-dialog title="新增" :visible.sync="dialogAddVisible" width=60% v-bind:show-close = "false">
        <el-form :model="addTable">
          <el-form-item class="is-required2" label="服务名称:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model="addTable.serviceName" prop auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="服务描述:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model="addTable.serviceDesc" auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="商品类别:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input placeholder="服务" auto-complete="off" :disabled="true" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="服务类别:" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input placeholder="平台服务" auto-complete="off" :disabled="true" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="参考价格:" :label-width="formLabelWidth">
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
          <el-form-item class="is-required2" label="服务ICON:" :label-width="formLabelWidth">
            <el-col :span="3">
              <el-upload class="upload-demo" :action="upImgurl" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="onsuccess"  :multiple=false list-type="picture" :limit="1" :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
            <el-col :span="5" :offset="4">
              <div v-show="addTable.serviceIconUrl">
                <img :src="addTable.serviceIconUrl" style="width: 370px;height: 200px;">
              </div>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="服务角色:" :label-width="formLabelWidth">
            <template slot-scope="scope">
              <el-checkbox-group v-model="addTable.serviceRole">
                <el-checkbox v-for="(item,index) in RoleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
          <el-form-item class="is-required2" label="服务介绍" :label-width="formLabelWidth">
            <el-col :span="24">
             <quill-editor 
                v-model="addTable.serviceIntroduce" 
                ref="myQuillEditor" 
                :options="editorOption" 
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
              </quill-editor>
            </el-col>
            <template>
              
          </template> 
          </el-form-item>
        </el-form>
       
        <div class="btn-row">
        <el-button size="small" type="primary" @click="_doAdd()">保存</el-button>
        <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>

</template>


<script>
import { GetServiceList,PostServiceStatus,PostServiceUpdate,getListWithNoParam,PostServiceSave } from '@/api/api.js'
import { API_UPDATE_IMG } from '@/config/env.js'
import { quillEditor } from 'vue-quill-editor'
import { getStore } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      title:"提示",//this.$alert的标题
      content:null,
      upImgurl:'',
      editorOption:{},
      AdminUserId: null,//userId
      serviceIconUrl:"",//serviceIconUrl
      RoleList: [],//角色列表
      searchParams: { name: '',role: '' },
      dialogImageUrl:
        'http://zhangshangtijian.b0.upaiyun.com/CSPO/DEV/z5o5rqJqcKhbMXBNDTgG89AvrZG5eIK1.png',
      dialogVisible: true,
      RoleData: [
        {
          roleId: 4,
          roleCode: '123',
          roleName: '医生角色',
          remark: '医生角色账号设置',
          deptId: 11,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-22 11:41:55',
          roleType: '0'
        },
        {
          roleId: 12,
          roleCode: null,
          roleName: '运营人员',
          remark: '运营人员',
          deptId: 9,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-07-02 16:36:51',
          roleType: '1'
        },
        {
          roleId: 29,
          roleCode: '003',
          roleName: '健管师',
          remark: '健管部门',
          deptId: 11,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-22 16:00:33',
          roleType: '1,0'
        },
        {
          roleId: 30,
          roleCode: '004',
          roleName: '医生主任',
          remark: '医生主任',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-20 17:01:31',
          roleType: '0'
        },
        {
          roleId: 31,
          roleCode: '产品',
          roleName: '产品',
          remark: '产品',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-05-23 12:00:20',
          roleType: '1'
        },
        {
          roleId: 32,
          roleCode: 'sy-js',
          roleName: '邵勇-角色',
          remark: '邵勇-角色',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-07-02 16:58:57',
          roleType: '0'
        },
        {
          roleId: 33,
          roleCode: '6',
          roleName: 'sai医生角色',
          remark: 'sai医生角色',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-07-02 16:34:23',
          roleType: '1'
        },
        {
          roleId: 34,
          roleCode: 'media',
          roleName: '媒体号',
          remark: '社媒',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-25 10:53:49',
          roleType: '1'
        },
        {
          roleId: 35,
          roleCode: 'content operator',
          roleName: '内容编辑',
          remark: '内容编辑',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-25 11:13:47',
          roleType: '1'
        },
        {
          roleId: 36,
          roleCode: 'scb',
          roleName: '市场部',
          remark: '市场部',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-27 14:18:42',
          roleType: '1'
        },
        {
          roleId: 37,
          roleCode: '564',
          roleName: '567',
          remark: '风帆股份给黑',
          deptId: null,
          deptName: null,
          menuIdList: null,
          deptIdList: null,
          createTime: '2018-06-29 09:31:33',
          roleType: '1,0'
        }
      ],
      DoctorData: [{
          value: 1,
          label: '赵医生'
        }, {
          value: 2,
          label: '钱医生'
        }, {
          value: 3,
          label: '孙医生'
        }, {
          value: 4,
          label: '李医生'
        }, {
          value: 5,
          label: '周医生'
        }],
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
      tableData_YYT: [], //一元厅列表数据
      selectTable: {}, //查看单个数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      editTable_YYT: {}, //修改一元厅单个数据
      editTableRoot_YYT: {},
      addTable: {
        serviceType: 'ITEM_PLATFORM_SERVICE',
        serviceDesc: '',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: [],
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '',
        serviceIconUrl:
          '',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '',
        serviceId: '8ab2b2f563822d260163822d26fd0000',
        serviceSort: 2,
        roleNames: [],
        createDate: '2018-05-21 18:09:47'
      }, //新增单个数据
      addTable_YYT: {
        "goodCode": 4231231,
        "firstType": "服务",
        "secondType": "一元听",
        "goodsName": "",
        "goodsWords": "",
        "goodsStatus": 0,
        "goodsPrice": 1,
        "audioStatus": 1,
        "serviceStatus": 1,
        "YYTgoods": 43,
        "YYTstatus": 1,
        "doctor": 2,
        "AbnormalKeywords": "",
        "goodsCopywriting": "",
        "createDate": "2018-05-21"
      }, //一元厅新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogEditVisible_YYT: false, //一元厅修改
      dialogAddVisible: false, //新增
      dialogAddVisible_YYT: false, //一元厅新增
      GoodsManVisible: false, //一元厅商品管理
      inde: null, //index flag
      inde_YYT: null, //一元厅index flag
      formLabelWidth: '120px',
      formLabelWidth2: '170px'
    }
  },
  methods: {
    onEditorBlur(){//失去焦点事件
    },
    onEditorFocus(){//获得焦点事件
    },
    onEditorChange(){//内容改变事件
    },
    doSearch() {
      let params = {
            "currentPage": 1,
            "pageSize": 1000,
            "queryServiceName": this.searchParams.name,
            "queryServiceRole": this.searchParams.role,
      }
      GetServiceList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
      })
    },
    // 上传方法
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    onsuccess(response, file, fileList) {
      this.$alert("上传成功!",this.title)
      console.log(typeof(response))
      console.log(response.data.src)
      this.serviceIconUrl =response.data.src
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
      let Str = ""
      Str = this.addTable.serviceRole.join(',')
      this.addTable.serviceRole = Str
      let code = ""
      code = encodeURIComponent(this.addTable.serviceIntroduce)
      this.addTable.serviceIntroduce= ""
      this.addTable.serviceIntroduce= code
      let params ={
          "itemType": this.addTable.itemType,
          "serviceDesc": this.addTable.serviceDesc,
          "serviceIconUrl": this.serviceIconUrl,
          "serviceId": this.addTable.serviceId,
          "serviceIntroduce": this.addTable.serviceIntroduce,
          "serviceMaxPrice": this.addTable.serviceMaxPrice,
          "serviceMinPrice": this.addTable.serviceMinPrice,
          "serviceName": this.addTable.serviceName,
          "serviceRole": this.addTable.serviceRole,
          "serviceSort": this.addTable.serviceSort,
          "serviceType": this.addTable.serviceType,
          "serviceUnit": this.addTable.serviceUnit,
          "userId": this.AdminUserId
      }
      PostServiceSave(params).then(response => {
        if (response.code == 1) {
          this.$alert(response.msg,this.title)
          this.getList()
        } else {
          this.$alert(response.msg,this.title)
          this.getList()
        }
        
      })
      // this.tableData.push(this.addTable)
      this.dialogAddVisible = false
      this.addTable = {
        serviceType: 'ITEM_PLATFORM_SERVICE',
        serviceDesc: '',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: [],
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '',
        serviceIconUrl:
          '',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '',
        serviceSort: 2,
        roleNames: [],
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
        serviceDesc: '',
        itemType: 'ITEM_SERVICE_TYPE',
        serviceUnitName: '次',
        serviceMaxPrice: 99.0,
        serviceRole: [],
        serviceSuggestedPrice: '1.0-99.0元/次',
        serviceName: '',
        serviceIconUrl:
          '',
        serviceMinPrice: 1.0,
        serviceUnit: 'UNIT_SECOND',
        serviceStatus: 1,
        serviceIntroduce:
          '',
        serviceId: '8ab2b2f563822d260163822d26fd0000',
        serviceSort: 2,
        roleNames: [],
        createDate: '2018-05-21 18:09:47'
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    GoodsMan() {//一元听商品管理路由跳转
      this.$router.push({ path: "/listenList"})
    },
    // 修改
    handleEdit(index, row) {
      let Arr =[]
      let code = ""
      row.serviceRole = row.serviceRole.split(',')
      for (var i = 0; i < row.serviceRole.length; i++) {
          Arr.push(Number.parseInt(row.serviceRole[i]));
      }
      row.serviceRole = []
      row.serviceRole = Arr//转换数组类型从string为整数
      
      code = decodeURIComponent(row.serviceIntroduce)
      row.serviceIntroduce = ""
      row.serviceIntroduce = code
      console.log(row.serviceIntroduce)
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      // this.editTable.serviceRole =this.editTable.serviceRole.split(',')
      console.log(typeof(this.editTable.serviceRole),"type1")
      console.log(this.editTable.serviceRole)
      this.dialogEditVisible = true
      
    },
    //确定修改
    _doHandleEdit() {
      let Str = ""
      Str = this.editTable.serviceRole.join(',')
      this.editTable.serviceRole = Str
      let code = ""
      code = encodeURIComponent(this.editTable.serviceIntroduce)
      this.editTable.serviceIntroduce= ""
      this.editTable.serviceIntroduce= code
      console.log(typeof(this.editTable.serviceRole),"type2")
      console.log(this.editTable.serviceRole)
      let params ={
          "itemType": this.editTable.itemType,
          "serviceDesc": this.editTable.serviceDesc,
          "serviceIconUrl": this.serviceIconUrl,
          "serviceId": this.editTable.serviceId,
          "serviceIntroduce": this.editTable.serviceIntroduce,
          "serviceMaxPrice": this.editTable.serviceMaxPrice,
          "serviceMinPrice": this.editTable.serviceMinPrice,
          "serviceName": this.editTable.serviceName,
          "serviceRole": this.editTable.serviceRole,
          "serviceSort": this.editTable.serviceSort,
          "serviceType": this.editTable.serviceType,
          "serviceUnit": this.editTable.serviceUnit,
          "userId": this.AdminUserId
      }
      PostServiceUpdate(params).then(response => {
        this.$alert(response.msg,this.title)
        this.getList()
      })
      this.dialogEditVisible = false
    },
    //取消修改
    _doCancel() {
      let Str = ""
      Str = this.editTableRoot.serviceRole.join(',')
      this.editTableRoot.serviceRole = Str
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      console.log(this.editTableRoot.serviceRole)
      // this.getList()
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
          this.tableData_YYT.splice(
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
          let params = {
            "serviceId": row.serviceId,
            "serviceStatus": 1
          }
          PostServiceStatus(params).then(response => {
            if (response.code == 1) {
              this.$alert('成功!',this.title)
              this.getList()
            } else {
              $alert(response.msg)
              this.getList()
            }
          })
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
          let params = {
            "serviceId": row.serviceId,
            "serviceStatus": 0
          }
          PostServiceStatus(params).then(response => {
            if (response.code == 1) {
              this.$alert('成功!',this.title)
              this.getList()
            } else {
              $alert(response.msg)
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改服务状态'
          })
        })
    },
    //获取列表
    getList() {
        let params = {
            "currentPage": 1,
            "pageSize": 1000,
            "queryServiceName": "",
            "queryServiceRole": "",
      }
      GetServiceList(params).then(response => {
        this.tableData = []
        this.tableData = response.data.list
        this.totalCount = response.data.totalCount
        console.log(this.tableData)
      })
      let partthis = getStore('userMesage')
      this.AdminUserId = JSON.parse(partthis).userId
    },
    getRoleList() {//获取角色列表
      let params = {
        }
      getListWithNoParam(params).then(response => {
        this.RoleList = []
        this.RoleList = response.data
      })
    }
  },
  activated: function() {
    this.upImgurl = API_UPDATE_IMG
    this.getList()
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>

.el-checkbox {
  margin-left: 10px;
}
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
.wordsnum{
    height: 117px;
    /* vertical-align: middle; */
    text-align: center;
    line-height: 117px;

}
.m_l_15{
  margin-left: 15px;
}
.btn-row {text-align: center;padding-top: 20px;}
.el-header,.el-main,.el-footer{
  padding-left:0;
}
</style>
<style lang="less">
 .inpwidth .el-input__inner{
   width: 200%;
 }
.el-form-item {
  &.is-required2 {
    .el-form-item__label {
      &:after {
        content: "*";
        color: #f56c6c;
        margin-left: 4px;
      }
    }
  }
}
.selector img{
    width: 150%;
}
</style>

