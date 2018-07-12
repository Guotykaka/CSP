<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      

      <!-- 一元听商品管理页面 -->
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
          <!--一元听新增按钮-->
          <el-row class="m_b_15">
            <el-button type="primary" @click="handleAdd_YYT()">新增</el-button>
          </el-row>

        </el-header>

        <el-main>
          <el-table :data="tableData_YYT.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column show-overflow-tooltip align="center" prop="goodCode" label="商品编号"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="firstType" label="商品一级分类"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="secondType" label="商品二级分类"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="goodsCopywriting" label="商品文案" min-width="100%"></el-table-column>
            <el-table-column align="center" label="商品状态" width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.goodsStatus === 1">下架</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.goodsStatus === 0">上架</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="YYTgoods" label="绑定商品"></el-table-column>
            <el-table-column align="center" label="建议价格">
              <template slot-scope="scope">
                <p>￥{{ scope.row.goodsPrice}}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createDate" label="音频" width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.audioStatus === 1">已添加</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.audioStatus === 0">未添加</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" v-if="scope.row.goodsStatus === 1" @click="FalseStatus_YYT(scope.$index, scope.row)">上架</el-button>
                  <el-button size="mini" type="success" v-if="scope.row.goodsStatus === 0" @click="TrueStatus_YYT(scope.$index, scope.row)">下架</el-button>
                  <el-button size="mini" type="primary" @click="handleEdit_YYT(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                  
                </template>
            </el-table-column>
          </el-table>
        </el-main>

        <el-footer height="30px">
          <el-row style="margin-top: 2%;">
            <el-col :span="24" :offset="8">
              <template>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData_YYT.length">
                </el-pagination>
              </template>
            </el-col>
          </el-row>
        </el-footer>



     
    
      <!-- 一元听编辑弹窗 -->
      <el-dialog title="编辑" :visible.sync="dialogEditVisible_YYT" width=40%>

        <el-form :model="editTable_YYT">
          <el-form-item class="is-required2" label="商品名称" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.goodsName" prop auto-complete="off" el readonly></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="绑定医生"  :label-width="formLabelWidth2">
            <template slot-scope="scope">
            <el-col :span="16">
              <el-select v-model="editTable_YYT.doctor" clearable placeholder="请绑定医生">
                <el-option v-for="item in DoctorData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            </template>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文件" :label-width="formLabelWidth2">
            <el-col :span="3">
              <el-upload class="upload-demo" action="editTable_YYT.qrCodeUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :multiple=false list-type="picture" :limit="1" :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
          </el-form-item>
          
          <el-form-item class="is-required2" label="异常指标关键词" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.AbnormalKeywords"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="相关指标" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="editTable_YYT.AbnormalKeywords"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文案" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input type="textarea" maxlength="50" resize="none" :rows="5" v-model="editTable_YYT.goodsCopywriting"></el-input>
            </el-col>
            <el-col :span="4" class="wordsnum">50字内</el-col>
            
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="_doCancel_YYT()">取消</el-button>
          <el-button type="primary" @click="_doHandleEdit_YYT()">保存</el-button>
        </div>
      </el-dialog>

      <!-- 一元听新增弹窗 -->
      <el-dialog title="新增" :visible.sync="dialogAddVisible_YYT" width=40%>
       <el-form :model="addTable_YYT">
          <el-form-item class="is-required2" label="商品名称" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.goodsName" prop auto-complete="off" el></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="绑定医生"  :label-width="formLabelWidth2">
            <template slot-scope="scope">
            <el-col :span="16">
              <el-select v-model="addTable_YYT.doctor" clearable placeholder="请绑定医生">
                <el-option v-for="item in DoctorData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            </template>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文件" :label-width="formLabelWidth2">
            <el-col :span="3">
              <el-upload class="upload-demo" action="addTable_YYT.qrCodeUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :multiple=false list-type="picture" :limit="1" :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
          </el-form-item>
          
          <el-form-item class="is-required2" label="异常指标关键词" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.AbnormalKeywords"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="相关指标" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input v-model="addTable_YYT.AbnormalKeywords"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="is-required2" label="商品文案" :label-width="formLabelWidth2">
            <el-col :span="16">
              <el-input type="textarea" maxlength="50" resize="none" :rows="5" v-model="addTable_YYT.goodsCopywriting"></el-input>
            </el-col>
            <el-col :span="4" class="wordsnum">50字内</el-col>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="_doAddCancel_YYT()">取消</el-button>
          <el-button type="primary" @click="_doAdd_YYT()">保存</el-button>
        </div>
      </el-dialog>
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
       
        valueBT: '',
        valueCJR: '',
        valueLX: '',
        valueZT: '',
        valueKS: '',
        valueJS: ''
      },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData_YYT: [], //一元厅列表数据
      editTable_YYT: {}, //编辑一元厅单个数据
      editTableRoot_YYT: {},
      addTable_YYT: {
        "goodCode": 4231231,
        "firstType": "服务",
        "secondType": "一元听",
        "goodsName": "",
        "goodsWords": "",
        "goodsStatus": 1,
        "goodsPrice": 1,
        "audioStatus": 0,
        "serviceStatus": 1,
        "YYTgoods": 43,
        "YYTstatus": 1,
        "doctor": 2,
        "AbnormalKeywords": "",
        "goodsCopywriting": "",
        "createDate": "2018-05-21"
      }, //一元听新增单个数据
      dialogEditVisible_YYT: false, //一元厅编辑
      dialogAddVisible_YYT: false, //一元厅新增
      GoodsManVisible: false, //一元厅商品管理
      inde_YYT: null, //一元厅index flag
      formLabelWidth: '120px',
      formLabelWidth2: '170px'
    }
  },
  methods: {
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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

   
    // 删除提示
    deleteMessage(index, row) {
      if (row.goodsStatus === 0) {
        this.$message({
            type: 'error',
            message: '请先将商品下架！'
          })
      } else {
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
            type: 'warning',
            message: '已取消删除'
          })
        })
      }
      
  
    },

    // 一元厅下架
    TrueStatus_YYT(index, row) {
      this.$confirm('确定下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '已下架!'
          })
          this.tableData_YYT[
            index + (this.currentPage - 1) * this.pagesize
          ].goodsStatus = 1 //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改'
          })
        })
    },
    // 一元厅上架
    FalseStatus_YYT(index, row) {
      this.$confirm('确定上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '已上架!'
          })
          this.tableData_YYT[
            index + (this.currentPage - 1) * this.pagesize
          ].goodsStatus = 0 //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消更改'
          })
        })
    },
    //一元厅商品管理页面
    GoodsMan() {
      this.GoodsManVisible = true
    },
    // 一元厅编辑
    handleEdit_YYT(index, row) {
      this.inde_YYT = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot_YYT = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable_YYT = row //复制单列数据
      this.dialogEditVisible_YYT = true
    },
    // 一元厅取消编辑
    _doCancel_YYT() {
      this.tableData_YYT.splice(this.inde_YYT, 1, this.editTableRoot_YYT) //删除编辑的数据并替换为原始数据
      this.dialogEditVisible_YYT = false
      this.$message({
        type: 'warning',
        message: '取消编辑'
      })
    },
    // 一元厅确定编辑
    _doHandleEdit_YYT() {
      this.dialogEditVisible_YYT = false
      this.$message({
        type: 'success',
        message: '编辑成功!'
      })
    },
    // 一元厅新增
    handleAdd_YYT() {
      this.dialogAddVisible_YYT = true
    },
    // 一元厅确定新增
    _doAdd_YYT() {
      this.tableData_YYT.push(this.addTable_YYT)
      this.dialogAddVisible_YYT = false
      this.addTable_YYT = {
        "goodCode": 4231231,
        "firstType": "服务",
        "secondType": "一元听",
        "goodsName": "",
        "goodsWords": "",
        "goodsStatus": 1,
        "goodsPrice": 1,
        "audioStatus": 1,
        "serviceStatus": 1,
        "YYTgoods": 43,
        "YYTstatus": 1,
        "doctor": 2,
        "AbnormalKeywords": "",
        "goodsCopywriting": "",
        "createDate": "2018-05-21"
      }
      this.$message({
        type: 'success',
        message: '新增服务成功!'
      })
    },
    // 一元厅取消新增
    _doAddCancel_YYT() {
      this.addTable_YYT = {
        //重置新增数据为空
        "goodCode": 4231231,
        "firstType": "服务",
        "secondType": "一元听",
        "goodsName": "",
        "goodsWords": "",
        "goodsStatus": 1,
        "goodsPrice": 1,
        "audioStatus": 1,
        "serviceStatus": 1,
        "YYTgoods": 43,
        "YYTstatus": 1,
        "doctor": 2,
        "AbnormalKeywords": "",
        "goodsCopywriting": "",
        "createDate": "2018-05-21"
      }
      this.dialogAddVisible_YYT = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    //获取一元听列表
    getListenList() {
      this.$http
        .post('http://localhost:8080/api/yiyuanting')
        .then(response => {
          this.tableData_YYT = []
          this.tableData_YYT = this.tableData_YYT.concat(response.data.data)
          // response.data.data.forEach(item => {
          //   const tableData = {}
          //   tableData.username = item.username
          //   this.tableDataYYT.push(tableData)
          // })
        })
    }
  },
  created: function() {
    this.getListenList()
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
.wordsnum{
    height: 117px;
    /* vertical-align: middle; */
    text-align: center;
    line-height: 117px;

}
</style>
<style lang="less">
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
</style>

