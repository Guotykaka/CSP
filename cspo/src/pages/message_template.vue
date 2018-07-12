<template>
    <div class="page-wrapper">
        <header-top></header-top>
        <div class="page-container">
            <template>
                <el-tabs v-model="activeName" @tab-click="">
                    <el-tab-pane label="短信模板" name="first">
                        <el-header height="30">
                            <el-row :gutter="20" class="m_b_15">
                                <el-col :span="6" class="minwidth">
                                    <el-input v-model="formInline.valueSS" placeholder="用户名"></el-input>
                                </el-col>
                                <el-col :span="6" class="minwidth">
                                    <el-button type="primary">查询</el-button>
                                    <el-button type="primary" @click="handleAdd()">新增</el-button>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-main>
                            <!-- 列表 -->
                            <template>
                                <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
                                    <el-table-column show-overflow-tooltip align="center" type="index" prop="" label=""></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="messageTemplateName" label="短信模板名称"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="messageTemplateContent" label="短信模板内容"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="updateDate" label="最后修改时间"></el-table-column>
                                    <el-table-column align="center" label="操作" min-width="152">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                            <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!-- 修改 -->
                            <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40%>
                                <el-form :model="editTable">
                                    <el-form-item label="短信模板名称:" :label-width="formLabelWidth">
                                        <el-col :span="16">
                                            <el-input v-model="editTable.messageTemplateName" auto-complete="off" el placeholder="短信模板名称"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="短信模板内容:" :label-width="formLabelWidth">
                                        <el-col :span="16">
                                            <el-input v-model="editTable.messageTemplateContent" auto-complete="off" el placeholder="短信模板内容"></el-input>
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
                                    <el-form-item label="短信模板名称:" :label-width="formLabelWidth">
                                        <el-col :span="16">
                                            <el-input v-model="addTable.messageTemplateName" auto-complete="off" el placeholder="短信模板名称"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="短信模板内容:" :label-width="formLabelWidth">
                                        <el-col :span="16">
                                            <el-input v-model="addTable.messageTemplateContent" auto-complete="off" el placeholder="短信模板内容"></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="_doAddCancel()">取 消</el-button>
                                    <el-button type="primary" @click="_doAdd()">确 定</el-button>
                                </div>
                            </el-dialog>
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
                    </el-tab-pane>
                    <el-tab-pane label="手机推送模板" name="second">
                        <el-header height="30">
                            <el-row :gutter="20" class="m_b_15">
                                <el-col :span="6" class="minwidth">
                                    <el-input v-model="formInline.valueSS" placeholder="用户名"></el-input>
                                </el-col>
                                <el-col :span="6" class="minwidth">
                                    <el-button type="primary">查询</el-button>
                                    <el-button type="primary" @click="handleAdd2()">新增</el-button>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-main>
                            <!-- 列表 -->
                            <template>
                                <el-table :data="tableData2.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
                                    <el-table-column show-overflow-tooltip align="center" type="index" prop="" label=""></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="messageTemplateName" label="手机推送模板名称"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="messageTemplateContent" label="手机推送模板内容"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="createDate" label="创建时间"></el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="updateDate" label="最后修改时间"></el-table-column>
                                    <el-table-column align="center" label="操作" min-width="152">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary" @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
                                            <el-button size="mini" type="danger" @click="deleteMessage2(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!-- 编辑 -->
                            <el-dialog title="编辑" :visible.sync="dialogEditVisible2" width=40%>
                                <el-form :model="editTable2">
                                    <el-form-item label="手机推送模板名称:" :label-width="formLabelWidth2">
                                        <el-col :span="16">
                                            <el-input v-model="editTable2.messageTemplateName" auto-complete="off" el placeholder="手机推送模板名称"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="手机推送模板内容:" :label-width="formLabelWidth2">
                                        <el-col :span="16">
                                            <el-input v-model="editTable2.messageTemplateContent" auto-complete="off" el placeholder="手机推送模板内容"></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="_doCancel2()">取 消</el-button>
                                    <el-button type="primary" @click="_doHandleEdit2()">确 定</el-button>
                                </div>
                            </el-dialog>
                            <!-- 新增 -->
                            <el-dialog title="新增" :visible.sync="dialogAddVisible2" width=40%>
                                <el-form :model="addTable2">
                                    <el-form-item label="手机推送模板名称:" :label-width="formLabelWidth2">
                                        <el-col :span="16">
                                            <el-input v-model="addTable2.messageTemplateName" auto-complete="off" el placeholder="手机推送模板名称"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="手机推送模板内容:" :label-width="formLabelWidth2">
                                        <el-col :span="16">
                                            <el-input v-model="addTable2.messageTemplateContent" auto-complete="off" el placeholder="手机推送模板内容"></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="_doAddCancel2()">取 消</el-button>
                                    <el-button type="primary" @click="_doAdd2()">确 定</el-button>
                                </div>
                            </el-dialog>
                        </el-main>
                        <el-footer height="30px">
                            <el-row style="margin-top: 2%;">
                                <el-col :span="24" :offset="8">
                                    <template>
                                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData2.length">
                                        </el-pagination>
                                    </template>
                                </el-col>
                            </el-row>
                        </el-footer>
                    </el-tab-pane>
                </el-tabs>
            </template>
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
      activeName: 'first',
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //短信模板数据
      tableData2: [], //手机推送模板数据
      editTable: {}, //修改单个数据
      editTable2: {}, //修改单个数据
      editTableRoot: {},
      editTableRoot2: {},
      addTable: {
        //新增单个数据
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 0,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }, //新增单个数据
      addTable2: {
        //新增单个数据
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 1,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //编辑
      dialogEditVisible2: false, //编辑
      dialogAddVisible: false, //新增
      dialogAddVisible2: false, //新增
      inde: null, //index flag
      inde2: null, //index flag
      formLabelWidth: '120px',
      formLabelWidth2: '140px',
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
    // 新增
    handleAdd2() {
      this.dialogAddVisible2 = true
    },
    // 确定新增
    _doAdd2() {
      this.tableData2.push(this.addTable2)
      this.addTable2 = {
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 1,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }
      this.dialogAddVisible2 = false
      this.$message({
        type: 'success',
        message: '新增手机推送模板成功!'
      })
    },
    // 确定新增
    _doAdd() {
      this.tableData.push(this.addTable)
      this.addTable = {
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 0,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'success',
        message: '新增短息模板成功!'
      })
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 0,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }
      this.dialogAddVisible = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    //取消新增
    _doAddCancel2() {
      this.addTable2 = {
        //重置新增数据为空
        messageTemplateName: '',
        messageTemplateState: 0,
        updateDate: '2018-06-27 11:35:16',
        messageTemplateContent: '',
        messageTemplateType: 1,
        updateUser: 'admin',
        createUser: 'admin',
        messageTemplateId: '',
        createDate: '2018-06-27 11:35:16'
      }
      this.dialogAddVisible2 = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable = row //复制单列数据
      this.dialogEditVisible = true
    },
    // 编辑
    handleEdit2(index, row) {
      this.inde2 = index + (this.currentPage - 1) * this.pagesize //计算分页后列表下标
      this.editTableRoot2 = JSON.parse(JSON.stringify(row)) //深拷贝出原始数据
      this.editTable2 = row //复制单列数据
      this.dialogEditVisible2 = true
    },
    //确定编辑
    _doHandleEdit() {
      this.dialogEditVisible = false
      this.$message({
        type: 'success',
        message: '编辑成功!'
      })
    },
    //确定编辑
    _doHandleEdit2() {
      this.dialogEditVisible2 = false
      this.$message({
        type: 'success',
        message: '编辑成功!'
      })
    },
    //取消编辑
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
      this.$message({
        type: 'warning',
        message: '取消编辑'
      })
    },
    //取消编辑
    _doCancel2() {
      this.tableData2.splice(this.inde2, 1, this.editTableRoot2) //删除修改的数据并替换为原始数据
      this.dialogEditVisible2 = false
      this.$message({
        type: 'warning',
        message: '取消编辑'
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
    // 删除提示
    deleteMessage2(index, row) {
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
          this.tableData2.splice(
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
    //获取消息模板列表
    getMessageTemplateList() {
      this.$http
        .post('http://localhost:8080/api/message_template1')
        .then(response => {
          this.tableData = []
          this.tableData = this.tableData.concat(response.data.data)
        })
      this.$http
        .post('http://localhost:8080/api/message_template2')
        .then(response => {
          this.tableData2 = []
          this.tableData2 = this.tableData2.concat(response.data.data)
        })
    }
  },
  created: function() {
    this.getMessageTemplateList()
  }
}
</script>

<style scoped>
</style>

