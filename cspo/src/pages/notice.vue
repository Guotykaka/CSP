<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <!-- 操作行-->
        <!-- <el-form :model="formInline" ref="formInline" label-width="80px" :inline="true">
            <el-form-item label="公告标题">
              <el-input v-model="formInline.valueBT" placeholder="公告标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="公告类型">
              <el-select v-model="formInline.valueLX" clearable placeholder="请选择公告类型">
                <el-option v-for="item in formInline.optionsLX" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公告状态">
              <el-select v-model="formInline.valueZT" clearable placeholder="请选择公告状态">
                <el-option v-for="item in formInline.optionsZT" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建人">
              <el-input v-model="formInline.valueCJR" placeholder="创建人" clearable></el-input>
            </el-form-item>
        </el-form> -->

        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="formInline.valueBT" placeholder="公告标题" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.valueLX" clearable placeholder="请选择公告类型">
              <el-option v-for="item in formInline.optionsLX" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.valueZT" clearable placeholder="请选择公告状态">
              <el-option v-for="item in formInline.optionsZT" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-input v-model="formInline.valueCJR" placeholder="创建人" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="formInline.valueKS" align="right" type="date" placeholder="创建开始时间" :picker-options="formInline.pickerOptions">
            </el-date-picker>
          </el-col>

          <el-col :span="6">
            <el-date-picker v-model="formInline.valueJS" align="right" type="date" placeholder="创建结束时间" :picker-options="formInline.pickerOptions">
            </el-date-picker>
          </el-col>

          <el-col :span="6">
            <el-button type="primary">搜索</el-button>
            <el-button type="primary" @click="handleReset()">重置</el-button>
          </el-col>

        </el-row>

        <!--新增按钮-->
        <el-row class="m_b_15">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-row>

      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40%>
          <el-form :model="editTable">
            <el-form-item label="公告标题:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.noticeTitle" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公告类型:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-select v-model="editTable.dictName" clearable placeholder="请选择公告状态">
                  <el-option label="产品推广" value="1"></el-option>
                  <el-option label="版本升级" value="2"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="公告内容:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input type="textarea" :rows="4" v-model="editTable.noticeContent" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="接收端:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-checkbox-group v-model="editTable.noticeOsName">
                  <el-checkbox label="运营端"></el-checkbox>
                  <el-checkbox label="医生端"></el-checkbox>
                  <el-checkbox label="企业端"></el-checkbox>
                </el-checkbox-group>
              </template>
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
            <el-form-item label="公告标题:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.noticeTitle" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公告类型:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-select v-model="addTable.dictName" clearable placeholder="请选择公告状态">
                  <el-option label="产品推广" value="1"></el-option>
                  <el-option label="版本升级" value="2"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="公告内容:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input type="textarea" :rows="4" v-model="addTable.noticeContent" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="接收端:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-checkbox-group v-model="addTable.noticeOsName">
                  <el-checkbox label="运营端"></el-checkbox>
                  <el-checkbox label="医生端"></el-checkbox>
                  <el-checkbox label="企业端"></el-checkbox>
                </el-checkbox-group>
              </template>
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
            <el-table-column show-overflow-tooltip align="center" prop="noticeTitle" label="公告标题"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="noticeType" label="类型" min-width="100%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="状态" width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="info" v-if="scope.row.noticeStatus === '1'">待发布</el-tag>
                  <el-tag size="medium" type="success" v-if="scope.row.noticeStatus === '2'">已发布</el-tag>
                  <el-tag size="medium" type="warning" v-if="scope.row.noticeStatus === '3'">已撤销</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="userName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="noticeOsName" label="接收端"></el-table-column>

            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="最后更新时间"></el-table-column>
            <el-table-column align="center" label="操作" width="290">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="scope.row.noticeStatus === '1'||scope.row.noticeStatus === '3'" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="success" v-if="scope.row.noticeStatus === '1'||scope.row.noticeStatus === '3'" @click="ReleaseMessage(scope.$index, scope.row)">发布</el-button>
                <el-button size="mini" type="danger" v-if="scope.row.noticeStatus === '1'" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" type="info" v-if="scope.row.noticeStatus === '2'" @click="RevokeMessage(scope.$index, scope.row)">撤销</el-button>
                <el-button size="mini" type="warning" @click="handleCheck(scope.$index, scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="8">
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
        noticeOs: '',
        releaseTime: null,
        sysNoticeId: '',
        noticeType: '新增',
        userName: '新增',
        noticeTitle: '',
        noticeOsName: [],
        noticeContent: '',
        createTime: '',
        noticeStatus: '1',
        createUser: '新增',
        dictName: '',
        lastUpdateTime: ''
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
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
        noticeOs: '',
        releaseTime: null,
        sysNoticeId: '',
        noticeType: '新增',
        userName: '新增',
        noticeTitle: '',
        noticeOsName: [],
        noticeContent: '',
        createTime: '新增',
        noticeStatus: '1',
        createUser: '',
        dictName: '',
        lastUpdateTime: ''
      }
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        noticeOs: '',
        releaseTime: null,
        sysNoticeId: '',
        noticeType: '新增',
        userName: '新增',
        noticeTitle: '',
        noticeOsName: [],
        noticeContent: '',
        createTime: '新增',
        noticeStatus: '1',
        createUser: '',
        dictName: '',
        lastUpdateTime: ''
      }
      this.dialogAddVisible = false
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
    // 发布
    ReleaseMessage(index, row) {
      this.$confirm('此操作将发布此公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '发布公告成功!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].noticeStatus =
            '2' //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消发布公告'
          })
        })
    },
    // 撤销发布
    RevokeMessage(index, row) {
      this.$confirm('此操作将撤销发布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '撤销发布成功!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].noticeStatus =
            '3' //更改发布状态
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消撤销发布'
          })
        })
    },
    //获取用户列表
    getNoticeList() {
      this.$http.post('http://localhost:8080/api/noticeList').then(response => {
        this.tableData = []
        this.tableData = this.tableData.concat(response.data.data)
        // response.data.data.forEach(item => {
        //   const tableData = {}
        //   tableData.username = item.username
        //   tableData.email = item.email
        //   tableData.deptName = item.deptName
        //   tableData.deptId = item.deptId
        //   tableData.mobile = item.mobile
        //   tableData.userId = item.userId
        //   tableData.status = item.status
        //   tableData.roleIdList = item.roleIdList
        //   tableData.createTime = item.createTime
        //   tableData.userType = item.userType
        //   tableData.checkList = item.checkList
        //   tableData.password = item.password
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
</style>
