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
                  <el-input v-model="searchParams.username" placeholder="短信模板名称" @keyup.enter.native="doSearche()" clearable></el-input>
                </el-col>
                <el-col :span="6" class="minwidth">
                  <el-button type="primary" @click="doSearche()">查询</el-button>
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
              <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40% v-bind:show-close = "false">
                <el-form :model="editTable">
                  <el-form-item label="短信模板名称:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="editTable.messageTemplateName" auto-complete="off" el placeholder="短信模板名称"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="短信模板内容:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="editTable.messageTemplateContent" auto-complete="off"  type="textarea" resize="none" :rows="5" el placeholder="短信模板内容"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="btn-row">
                <el-button size="small" type="primary" @click="_doHandleEdit()">确定</el-button>
                <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
                </div>
              </el-dialog>
              <!-- 新增 -->
              <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40% v-bind:show-close = "false">
                <el-form :model="addTable">
                  <el-form-item label="短信模板名称:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.messageTemplateName" auto-complete="off" el placeholder="短信模板名称"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="短信模板内容:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.messageTemplateContent"type="textarea" resize="none" :rows="5" auto-complete="off" el placeholder="短信模板内容"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="btn-row">
                <el-button size="small" type="primary" @click="_doAdd()">确定</el-button>
                <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
                </div>
              </el-dialog>
            </el-main>
            <div class="self-page-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                    </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="手机推送模板" name="second">
            <el-header height="30">
              <el-row :gutter="20" class="m_b_15">
                <el-col :span="6" class="minwidth">
                  <el-input v-model="searchParams2.username" placeholder="手机推送模板名称" @keyup.enter.native="doSearche2()" clearable></el-input>
                </el-col>
                <el-col :span="6" class="minwidth">
                  <el-button type="primary" @click="doSearche2()">查询</el-button>
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
                      <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 编辑 -->
              <el-dialog title="编辑" :visible.sync="dialogEditVisible2" width=40% v-bind:show-close = "false">
                <el-form :model="editTable2">
                  <el-form-item label="手机推送模板名称:" :label-width="formLabelWidth2">
                    <el-col :span="16">
                      <el-input v-model="editTable2.messageTemplateName" auto-complete="off" el placeholder="手机推送模板名称"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="手机推送模板内容:" :label-width="formLabelWidth2">
                    <el-col :span="16">
                      <el-input type="textarea" resize="none" :rows="5" v-model="editTable2.messageTemplateContent" auto-complete="off" el placeholder="手机推送模板内容"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="btn-row">
                <el-button size="small" type="primary" @click="_doHandleEdit2()">确定</el-button>
                <el-button size="small" type="primary" @click="_doCancel2()">取消</el-button>
                </div>
              </el-dialog>
              <!-- 新增 -->
              <el-dialog title="新增" :visible.sync="dialogAddVisible2" width=40% v-bind:show-close = "false">
                <el-form :model="addTable2">
                  <el-form-item label="手机推送模板名称:" :label-width="formLabelWidth2">
                    <el-col :span="16">
                      <el-input v-model="addTable2.messageTemplateName" auto-complete="off" el placeholder="手机推送模板名称"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="手机推送模板内容:" :label-width="formLabelWidth2">
                    <el-col :span="16">
                      <el-input type="textarea" resize="none" :rows="5" v-model="addTable2.messageTemplateContent" auto-complete="off" el placeholder="手机推送模板内容"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="btn-row">
                <el-button size="small" type="primary" @click="_doAdd2()">确定</el-button>
                <el-button size="small" type="primary" @click="_doAddCancel2()">取消</el-button>
                </div>
              </el-dialog>
            </el-main>
            <div class="self-page-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData2.length">
                    </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import {
  ERR_OK,
  PostTemplateList,
  PostTemplateUpdate,
  PostTemplateSave,
  PostTemplateDelete
} from '@/api/api.js'
import { getStore,EncodeUserId } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {
      title:"提示",//this.$alert的标题
      AdminUserId: '', //userId
      activeName: 'first',
      searchParams: { username: '' },
      searchParams2: { username: '' },
      currentPage: 1, //分页初始页码
      totalCount: 0,
      pagesize: 10, //分页初始显示条数
      tableData: [], //短信模板数据
      tableData2: [], //手机推送模板数据
      editTable: {}, //修改单个数据
      editTable2: {}, //修改单个数据
      editTableRoot: {},
      editTableRoot2: {},
      addTable: {
        //新增单个数据
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 0
      }, //新增单个数据
      addTable2: {
        //新增单个数据
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 1
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //编辑
      dialogEditVisible2: false, //编辑
      dialogAddVisible: false, //新增
      dialogAddVisible2: false, //新增
      inde: null, //index flag
      inde2: null, //index flag
      formLabelWidth: '120px',
      formLabelWidth2: '140px'
    }
  },
  methods: {
    doSearche() {
      let date = Date.parse(new Date());
      let params = {
        currentPage: 1,
        pageSize: 1000,
        timespan: date,
        messageTemplateName: this.searchParams.username,
        messageTemplateType: '0'
      };
      PostTemplateList(params).then(res => {
        this.tableData = [];
        if(res.code===ERR_OK){
          this.tableData = res.data.list
        }else{
          this.$alert(res.msg,'提示')
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      })
    },
    doSearche2() {
      let date = Date.parse(new Date());
      let params = {
        currentPage: 1,
        pageSize: 1000,
        timespan: date,
        messageTemplateName: this.searchParams2.username,
        messageTemplateType: '1'
      };
      PostTemplateList(params).then(res => {
        this.tableData2 = [];
        if(res.code===ERR_OK){
          this.tableData2 = res.data.list
        }else{
          this.$alert(res.msg,'提示')
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      })
    },
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
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
      let params = {
        messageTemplateContent: this.addTable2.messageTemplateContent,
        messageTemplateName: this.addTable2.messageTemplateName,
        messageTemplateState: this.addTable2.messageTemplateState,
        messageTemplateType: this.addTable2.messageTemplateType,
        userId: this.AdminUserId
      };
      PostTemplateSave(params).then(response => {
        if (response.code === ERR_OK) {
          this.$alert('新增手机推送模板成功!');
          this.tableData2.push(this.addTable2);
          this.getMessageTemplateList()
        } else {
          this.$alert(response.msg,this.title)
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      this.addTable2 = {
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 1
      };
      this.dialogAddVisible2 = false
    },
    // 确定新增
    _doAdd() {
      let params = {
        messageTemplateContent: this.addTable.messageTemplateContent,
        messageTemplateId: 0,
        messageTemplateName: this.addTable.messageTemplateName,
        messageTemplateState: this.addTable.messageTemplateState,
        messageTemplateType: this.addTable.messageTemplateType,
        userId: this.AdminUserId
      };
      PostTemplateSave(params).then(response => {
        if (response.code === ERR_OK) {
          this.$alert('新增短息模板成功!',this.title);
          this.tableData.push(this.addTable);
          this.getMessageTemplateList()
        } else {
          this.$alert(response.msg,this.title)
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      this.addTable = {
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 0
      };
      this.dialogAddVisible = false
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 0
      };
      this.dialogAddVisible = false;
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    //取消新增
    _doAddCancel2() {
      this.addTable2 = {
        //重置新增数据为空
        messageTemplateContent: '',
        messageTemplateName: '',
        messageTemplateState: 0,
        messageTemplateType: 1
      };
      this.dialogAddVisible2 = false
      this.$message({
        type: 'warning',
        message: '取消新增'
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.inde = index + (this.currentPage - 1) * this.pagesize; //计算分页后列表下标
      this.editTableRoot = JSON.parse(JSON.stringify(row)); //深拷贝出原始数据
      this.editTable = row;//复制单列数据
      this.dialogEditVisible = true
    },
    // 编辑
    handleEdit2(index, row) {
      this.inde2 = index + (this.currentPage - 1) * this.pagesize; //计算分页后列表下标
      this.editTableRoot2 = JSON.parse(JSON.stringify(row)); //深拷贝出原始数据
      this.editTable2 = row; //复制单列数据
      this.dialogEditVisible2 = true
    },
    //确定编辑
    _doHandleEdit() {
      let params = {
        messageTemplateContent: this.editTable.messageTemplateContent,
        messageTemplateName: this.editTable.messageTemplateName,
        messageTemplateState: this.editTable.messageTemplateState,
        messageTemplateType: this.editTable.messageTemplateType,
        messageTemplateId: this.editTable.messageTemplateId,
        userId: this.AdminUserId
      }

      PostTemplateUpdate(params).then(response => {
        if (response.code === ERR_OK) {
          this.$alert('编辑短息模板成功!',this.title)
          this.getMessageTemplateList()
        } else {
          this.$alert(response.msg,this.title)
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      this.dialogEditVisible = false
    },
    //确定编辑
    _doHandleEdit2() {
      let params = {
        messageTemplateContent: this.editTable2.messageTemplateName,
        messageTemplateName: this.editTable2.messageTemplateName,
        messageTemplateState: this.editTable2.messageTemplateState,
        messageTemplateType: this.editTable2.messageTemplateType,
        messageTemplateId: this.editTable2.messageTemplateId,
        userId: this.AdminUserId
      };
      PostTemplateUpdate(params).then(response => {
        if (response.code === ERR_OK) {
          this.$alert('编辑短息模板成功!',this.title)
          this.getMessageTemplateList()
        } else {
          this.$alert(response.msg,this.title)
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      this.dialogEditVisible2 = false
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
          let params = {
            ids: [row.messageTemplateId]
          };
          PostTemplateDelete(params).then(res => {
            if (res.code === ERR_OK) {
              this.$alert('删除成功!',this.title);
              this.getMessageTemplateList()
            } else {
              this.$alert(res.msg,this.title)
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
          // this.tableData.splice(
          //   index + (this.currentPage - 1) * this.pagesize,
          //   1
          // ) //删除
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
      let params = {
        currentPage: 1,
        pageSize: 1000,
        messageTemplateName: '',
        messageTemplateType: '0'
      };
      let params2 = {
        currentPage: 1,
        pageSize: 1000,
        messageTemplateName: '',
        messageTemplateType: '1'
      };
      PostTemplateList(params).then(res => {
        this.tableData = [];
        if(res.code===ERR_OK){
          this.tableData = res.data.list;
          this.totalCount = res.totalCount
        }else{
          this.$alert(res.msg,'提示')
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      PostTemplateList(params2).then(res => {
        this.tableData2 = [];
        if(res.code===ERR_OK){
          this.tableData2 = res.data.list;
          this.totalCount = res.totalCount
        }else{
          this.$alert(res.msg,'提示')
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
      let partthis = getStore('userMesage');
      this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
    }
  },
  activated: function() {
    this.getMessageTemplateList()
  }
}
</script>

<style lang="less" scoped>
.btn-row {text-align: center;padding-top: 20px;}
.el-header,.el-main,.el-footer{
  padding:0;
}
</style>

