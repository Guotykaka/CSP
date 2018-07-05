<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6">
            <el-input v-model="formInline.valueSS" placeholder="用户名"></el-input>
          </el-col>

          <el-col :span="6">
            <el-button type="primary">清空</el-button>
            <el-button type="primary">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-button class="right m_r_10" type="primary" @click="handleAdd()">新增</el-button>
            <el-button class="right m_r_10" type="success" @click="order()">顺序调整</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <!-- 顺序 -->
        <el-dialog title="顺序调整" :visible.sync="dialogOrderVisible" width=30%>
          <template class="my-table">
            <el-table :data="tableData" border style="width: 100%" id="app" :header-cell-style="getRowClass">
              <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
              <el-table-column align="center" prop="reportLabelName" label="分组名称"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" icon="el-icon-caret-top" @click="toTop(scope.$index, scope.row)" v-if="scope.$index!=0" circle></el-button>
                  <el-button type="success" size="mini" icon="el-icon-arrow-up" @click="prev(scope.$index, scope.row)" v-if="scope.$index!=0" circle></el-button>
                  <el-button type="success" size="mini" icon="el-icon-arrow-down" @click="next(scope.$index, scope.row)" v-if="scope.$index!=tableData.length-1" circle></el-button>
                  <el-button type="success" size="mini" icon="el-icon-caret-bottom" @click="toBottom(scope.$index, scope.row)" v-if="scope.$index!=tableData.length-1" circle></el-button>
                 
                </template>
              </el-table-column>
            </el-table>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doOrderCancel()">取 消</el-button>
            <el-button type="primary" @click="dialogOrderVisible=false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="dialogEditVisible" width=40%>
          <el-form :model="editTable">
            <el-form-item label="分组名称:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.reportLabelName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.reportLabelDesc" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doCancel()">取 消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <el-form :model="addTable">
            <el-form-item label="分组名称:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.reportLabelName" auto-complete="off" placeholder="请输入分组名称" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.reportLabelDesc" auto-complete="off" placeholder="请输入" el></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doAddCancel()">取 消</el-button>
            <el-button type="primary" @click="_doAdd()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column align="center" prop="reportLabelName" label="分组名称"></el-table-column>
            <el-table-column align="center" prop="reportLabelDesc" label="描述"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.reportLabelState === 1">使用中</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.reportLabelState === 0">已下线</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createDate" label="操作时间"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="success" v-if="scope.row.reportLabelState === 0" @click="_online(scope.$index, scope.row)">上线</el-button>
                <el-button size="mini" type="danger" v-if="scope.row.reportLabelState === 1" @click="_downline(scope.$index, scope.row)">下线</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <el-row style="margin-top: 2%;">
          <el-col :span="24" :offset="6">
            <template>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[3, 5, 10,30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
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
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      orderData:[],//排序数据
      editTable: {}, //编辑弹窗 单列数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        medicineGroupId: 'b31d63ea802611e88a1a000c29466fd7',
        reportLabelName: '',
        medicineGroupSort: 0,
        reportLabelDesc: '',
        reportLabelState: 0,
        createDate: '2018-07-05 15:40:51',
        createUser: 'admin',
        updateDate: '2018-07-05 15:40:51',
        updateUser: 'admin'
      }, //新增弹窗 单列数据
      dialogEditVisible: false, //编辑
      dialogAddVisible: false, //新增
      dialogOrderVisible: false, //顺序
      inde: null, //index flag
      formLabelWidth: '120px'
    }
  },
  methods: {
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
      this.addTable = {
        //重置新增数据为空
        medicineGroupId: 'b31d63ea802611e88a1a000c29466fd7',
        reportLabelName: '',
        medicineGroupSort: 0,
        reportLabelDesc: '',
        reportLabelState: 0,
        createDate: '2018-07-05 15:40:51',
        createUser: 'admin',
        updateDate: '2018-07-05 15:40:51',
        updateUser: 'admin'
      }
      this.dialogAddVisible = false
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        medicineGroupId: 'b31d63ea802611e88a1a000c29466fd7',
        reportLabelName: '',
        medicineGroupSort: 0,
        reportLabelDesc: '',
        reportLabelState: 0,
        createDate: '2018-07-05 15:40:51',
        createUser: 'admin',
        updateDate: '2018-07-05 15:40:51',
        updateUser: 'admin'
      }
      this.dialogAddVisible = false
    },
    // 修改
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
      console.log(this.editTable)
      console.log(this.editTable.roleType)
    },
    //确定修改
    _doHandleEdit() {
      this.dialogEditVisible = false
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除编辑弹窗的数据并替换为原始数据
      this.dialogEditVisible = false
    },
    // 上线提示
    _online(index, row) {
      this.$confirm('是否上线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '上线成功!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].reportLabelState = 1 //给medicineGroupState赋值为1
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消上线'
          })
        })
    },
    // 下线提示
    _downline(index, row) {
      this.$confirm('是否下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '下线成功!'
          })
          this.tableData[
            index + (this.currentPage - 1) * this.pagesize
          ].reportLabelState = 0 //给medicineGroupState赋值为0
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消下线'
          })
        })
    },

    //排序
    order() {
      this.orderData = JSON.parse(JSON.stringify(this.tableData))
      console.log(this.orderData)
      this.dialogOrderVisible=true
    },
    //取消排序
    _doOrderCancel() {
      this.tableData = JSON.parse(JSON.stringify(this.orderData))
      this.dialogOrderVisible=false
    },
    //设置表格第一行的颜色
			getRowClass({ row, column, rowIndex, columnIndex }) {
				if (rowIndex == 0) {
					return 'background-color: #58CD8A;color: #ffffff;'
				} else {
					return ''
				}
      },
      
     toTop(index, row){//置顶
            //将当前和顶部元素替换
           

            var temp = this.tableData[index];
            this.$set(this.tableData, index, this.tableData[0])
            this.$set(this.tableData, 0, temp);
        },
    toBottom(index, row){//置顶
            //将当前和底部元素替换
            var temp = this.tableData[index];
            this.$set(this.tableData, index, this.tableData[this.tableData.length-1])
            this.$set(this.tableData, this.tableData.length-1, temp);
        },
    prev(index, row){//往前
            //将当前元素和上个元素替换
            var temp = this.tableData[index];
            this.$set(this.tableData, index, this.tableData[index-1])
            this.$set(this.tableData, index-1, temp);
        },
    next(index, row){//往后
            //将当前元素和下个元素替换
            var temp = this.tableData[index];
            this.$set(this.tableData, index, this.tableData[index+1])
            this.$set(this.tableData, index+1, temp);
        },



    //获取用户列表
    getMedicineGroupList() {
      this.$http
        .post('http://localhost:8080/api/report_label')
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
    this.getMedicineGroupList()
  }
}
</script>

<style lang="less" scoped>
.dot {
  width: 100%;
}
.el-select {
  width: 100%;
}
.m_r_10 {
  margin-right: 10px;
}

</style>