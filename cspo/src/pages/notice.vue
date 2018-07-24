<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <!-- 操作行-->
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="公告标题">
            <el-input v-model="searchParams.noticeTitleQuery" placeholder="公告标题" clearable></el-input>
          </el-form-item>

          <el-form-item label="请选择公告类型">
            <el-select v-model="searchParams.noticeOs" clearable placeholder="请选择公告类型">
              <el-option v-for="item in formInline.optionsLX" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择公告状态">
            <el-select v-model="searchParams.noticeStatus" clearable placeholder="请选择公告状态">
              <el-option v-for="item in formInline.optionsZT" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="searchParams.userName" placeholder="创建人" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建开始时间">
            <el-date-picker v-model="this.searchParams.startTime" align="right" type="date" placeholder="创建开始时间" :picker-options="formInline.pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建结束时间">
            <el-date-picker v-model="this.searchParams.endTime" align="right" type="date" placeholder="创建结束时间" :picker-options="formInline.pickerOptions">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="时间">
            <el-date-picker
            v-model="rangeTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </el-form-item>
          

          <el-form-item>
            <el-button type="primary" @click="handleReset()">重置</el-button>
            <el-button type="primary" @click="doSearch()">搜索</el-button>
            <el-button type="primary" @click="dialogCheckVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40% v-bind:show-close = "false">
          <el-form :model="editTable">
            <el-form-item label="公告标题:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.noticeTitle" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公告类型:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-select v-model="editTable.dictName" clearable placeholder="请选择公告类型">
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
          <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
          <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogCheckVisible" width=40% v-bind:show-close = "false">
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
                <el-checkbox-group v-model="selectTable.createUser">
                  <el-checkbox label="1" onclick="return false">运营端</el-checkbox>
                  <el-checkbox label="2" onclick="return false">医生端</el-checkbox>
                  <el-checkbox label="3" onclick="return false">企业端</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-form>

          <div class="btn-row">
          <el-button size="small" type="primary" @click="dialogCheckVisible = false">返回</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40% v-bind:show-close = "false">
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
          <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAdd()">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column show-overflow-tooltip align="center" prop="noticeTitle" label="公告标题"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="dictName" label="类型" min-width="100%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="状态" width="100">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="info" v-if="scope.row.noticeStatus === 1">待发布</el-tag>
                  <el-tag size="medium" type="success" v-if="scope.row.noticeStatus === 2">已发布</el-tag>
                  <el-tag size="medium" type="warning" v-if="scope.row.noticeStatus === 3">已撤销</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="userName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="noticeOsName" label="接收端"></el-table-column>

            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="最后更新时间"></el-table-column>
            <el-table-column align="center" label="操作" width="290">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="scope.row.noticeStatus === 1||scope.row.noticeStatus === 3" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="success" v-if="scope.row.noticeStatus === 1||scope.row.noticeStatus === 3" @click="ReleaseMessage(scope.$index, scope.row)">发布</el-button>
                <el-button size="mini" type="danger" v-if="scope.row.noticeStatus === 1" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" type="info" v-if="scope.row.noticeStatus === 2" @click="RevokeMessage(scope.$index, scope.row)">撤销</el-button>
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
              <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"> -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </template>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>

</template>


<script>
import { getNoticeList,getNoticeInfo } from '@/api/api.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      rangeTime:"",//时间range
      formInline: {
        optionsLX: [
          {
            value: 'NOTICE_TYPE_VERSION_UPGRADES',
            label: '版本升级'
          },
          {
            value: 'NOTICE_TYPE_PRODUCT_PROMOTION',
            label: '产品推广'
          }
        ],
        optionsZT: [
          {
            value: '1',
            label: '待发布'
          },
          {
            value: '2',
            label: '已发布'
          },
          {
            value: '3',
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
      searchParams: {
        currentPage: 1,
        endTime: "",
        noticeOs: "",
        noticeStatus: "",
        noticeTitleQuery: "",
        pageSize: 10,
        selectedNoticeTypeQuery: "",
        startTime: "",
        userName: "",
      },
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      totalCount: 0,
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
      this.rangeTime="";
      this.searchParams = {
        currentPage: 1,
        endTime: "",
        noticeOs: "",
        noticeStatus: "",
        noticeTitleQuery: "",
        pageSize: 10,
        selectedNoticeTypeQuery: "",
        startTime: "",
        userName: "",
      }
      
    },
    doSearch() {
      this.searchParams.currentPage = 1
      this.getList()
    },
    handleSizeChange: function(size) {
      this.searchParams.pageSize = size
      this.getList()
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage = currentPage
      this.getList()
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
      let params = {
        id: row.sysNoticeId,
      }
      getNoticeInfo(params).then(response => {
        if (response.code == 1) {
          this.selectTable = response.data
        } else {
          console.log(response.msg)
        }

      })
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
    //获取公告列表
    getList() {
      this.searchParams.startTime=this.rangeTime ? this.rangeTime[0] :"";
      this.searchParams.endTime=this.rangeTime ? this.rangeTime[1] :"";
      let params = {
        currentPage: this.searchParams.currentPage,
        endTime: this.searchParams.endTime,
        noticeOs: this.searchParams.noticeOs,
        noticeStatus: this.searchParams.noticeStatus,
        noticeTitleQuery: this.searchParams.noticeTitleQuery,
        pageSize: this.searchParams.pageSize,
        selectedNoticeTypeQuery: this.searchParams.selectedNoticeTypeQuery,
        startTime: this.searchParams.startTime,
        userName: this.searchParams.userName,
      }
      getNoticeList(params).then(response => {
        if (response.code == 1) {
          // if (!response.data.list.length == 0) {
            this.tableData = []
            this.tableData = response.data.list
            this.totalCount = response.data.totalCount
          // } else {
          //   console.log(response,"tableData")
          // }
        } else {
          console.log(response.msg)
        }

      })
    }
  },
  activated: function() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
el-header el-mian el-footer{
  padding:0;
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
.btn-row {text-align: center;padding-top: 20px;}
.el-header,.el-main,.el-footer{
  padding:0;
}
</style>


