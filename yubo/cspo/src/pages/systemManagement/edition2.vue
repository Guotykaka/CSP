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
          <el-form-item label="设备类型：">
              <el-select v-model="searchParams.osType" clearable placeholder="请选择设备类型">
                <el-option label="IOS" :value="1"></el-option>
                <el-option label="Android" :value="2"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="状态：">
              <el-select v-model="searchParams.status" clearable placeholder="请选择状态">
                <el-option label="不提醒" :value="1"></el-option>
                <el-option label="普通提醒" :value="2"></el-option>
                <el-option label="强制升级" :value="3"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getList()">搜索</el-button>
            <el-button type="primary" @click="doShowView()">新增</el-button>
            <!-- <el-button icon="el-icon-refresh" type="primary" circle @click="refresh()"></el-button> -->
          </el-form-item>

          </el-form>
          </el-row>
          <el-row class="m_b_15">
            <el-button type="primary" @click="refresh()">新版本上线</el-button>
          </el-row>
        </el-header>
        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column show-overflow-tooltip align="center" prop="versionCode" width="80" label="版本号"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="versionName" width="120" label="版本名称"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="osType" width="100" label="OSType">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.osType === '1'">IOS</el-tag>
                    <el-tag size="medium" type="success" v-if="scope.row.osType === '2'">Android</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="status" width="100" label="Status">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.status === '1'">不提醒</el-tag>
                    <el-tag size="medium" type="success" v-if="scope.row.status === '2'">普通提醒</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.status === '3'">强制升级</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="downLink" label="下载地址"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="apkDownLink" label="apk下载地址"></el-table-column>
              <el-table-column align="center" label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-main>
      </div>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑" :visible.sync="dialogEditVisible" width=600px :before-close="handleCloseEidt">
        <el-form :model="editTable" label-position="left">
          <el-form-item label="版本号：" :label-width="formLabelWidth">
            <el-col :span="16">
              {{editTable.versionCode}}
            </el-col>
          </el-form-item>
          <el-form-item label="版本名称：" :label-width="formLabelWidth">
            <el-col :span="16">
              {{editTable.versionName}}
            </el-col>
          </el-form-item>
          <el-form-item label="OSType：" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-tag size="medium" v-if="editTable.osType === '1'">IOS</el-tag>
              <el-tag size="medium" type="success" v-if="editTable.osType === '2'">Android</el-tag>
            </el-col>
          </el-form-item>
          <el-form-item label="Status：" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-select v-model="editTable.status" clearable placeholder="请选择状态">
                <el-option label="不提醒" value="1"></el-option>
                <el-option label="普通提醒" value="2"></el-option>
                <el-option label="强制升级" value="3"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="下载地址：" :label-width="formLabelWidth">
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="无"
                v-model="editTable.downLink" readonly resize="none">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item v-if="editTable.apkDownLink" label="apk下载地址：" :label-width="formLabelWidth">
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="无"
                v-model="editTable.apkDownLink" readonly resize="none">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="版本更新消息 ：" :label-width="formLabelWidth">
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="无"
                v-model="editTable.message" readonly resize="none">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleEdit()">保存</el-button>
          <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
        </div>
      </el-dialog>
      <!-- 新增弹窗 -->
      <el-dialog title="新增" :visible.sync="dialogViewVisible" width=600px :before-close="_doHideView">
        <el-form :model="ViewTable" label-position="left">
          <el-form-item label="版本号：" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model.trim="ViewTable.versionCode" auto-complete="off" placeholder="x.xx"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="版本名称：" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-input v-model.trim="ViewTable.versionName" auto-complete="off" placeholder="Version x.xx"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="OSType：" :label-width="formLabelWidth">
            <el-col :span="16">
             <el-select v-model="ViewTable.osType" clearable placeholder="请选择设备类型">
                <el-option label="IOS" :value="1"></el-option>
                <el-option label="Android" :value="2"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="Status：" :label-width="formLabelWidth">
            <el-col :span="16">
              <el-select v-model="ViewTable.status" clearable placeholder="请选择状态">
                <el-option label="不提醒" :value="1"></el-option>
                <el-option label="普通提醒" :value="2"></el-option>
                <el-option label="强制升级" :value="3"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="版本更新消息：" :label-width="formLabelWidth">
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="1.新增XX，可以XX，XX;\n2.XX;\n3.若干 Bug 修复，程序员很细心啦。"
                v-model="ViewTable.message">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item v-if="ViewTable.osType === 2" label="apk下载地址：" :label-width="formLabelWidth">
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="http://zhangshangtijian.b0.upaiyun.com/common/app-haozhuo-signed_VXXX.apk"
                v-model="ViewTable.apkDownLink">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddVersion()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>
import { ERR_OK,getVersionAllList,getVersionLaunch,deleteNewVersion,modifyNewVersion,getRefreshVersionList,AddNewVersion } from '@/api/api.js'
import { getStore,EncodeUserId,IsAlert } from '@/config/mUtils.js'
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop,
  },
  data() {
    return {
      AdminUserId:'',
      editTable: {}, //编辑优惠券单个数据
      ViewTable:{
        apkDownLink: "",
        message: "",
        osType: null,
        status: null,
        versionCode: "",
        versionName: ""
      },//新增
      totalCount: 0,
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        osType: "",
        status: "", },
      tableData: [], //列表数据
      dialogEditVisible: false, //修改
      dialogViewVisible: false, //查看
      formLabelWidth: '120px',
      formLabelWidth2: '220px',
    }
  },
  methods: {
    // 查看弹窗
    doShowView() {
          this.ViewTable = {
            apkDownLink: "",
            message: "",
            osType: null,
            status: null,
            versionCode: "",
            versionName: ""
          };
          this.dialogViewVisible = true;
    },
    //隐藏查看弹窗
    _doHideView(){
      this.dialogViewVisible= false;
    },
    //确定新增
    _doAddVersion(){
      let params = {
        apkDownLink: this.ViewTable.apkDownLink,
        message: this.ViewTable.message,
        osType: this.ViewTable.osType,
        status: this.ViewTable.status,
        versionCode: this.ViewTable.versionCode,
        versionName: this.ViewTable.versionName
      };
      AddNewVersion(params).then(response => {
        if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this._doHideView();
            this.getList();
        } else {
          IsAlert(response.msg,'错误','error');
        };
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
    },
    // 修改
    handleEdit(index, row) {
        this.getList();
        this.editTable = [];
        this.editTable = row;
        this.dialogEditVisible = true;
    },
    //优惠券确定修改
   _doHandleEdit() {
      let params = {
        id: this.editTable.id,
        status: this.editTable.status,
      }
      modifyNewVersion(params).then(response => {
        if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseEidt();
        } else {
          IsAlert(response.msg,'错误','error');
        };
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
    },
    // 优惠券取消编辑
    _doCancel() {
      this.handleCloseEidt();
      this.getList();
      this.$message({
        type: 'warning',
        message: '取消编辑'
      });
    },
    handleCloseEidt() {
      //编辑弹窗重置数据
      this.getList();
      this.dialogEditVisible = false;
    },
    //删除
    handleDelete(index,row){
      this.$confirm('此操作将删除该配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
           let params = {
            id:row.id,
          };
          deleteNewVersion(params).then(response => {
            if (response.code === ERR_OK) {
             this.$message({
                type: 'success',
                message: '已删除!'
              })
              this.getList();
            } else {
              IsAlert(response.msg,'错误','error');
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          })
        })
    },
    //新版本上线
    refresh() {
        let params = {};
        getVersionLaunch(params).then(response => {
          if ((response.code === ERR_OK)) {
            IsAlert('新版本上线成功！','提示','warning');
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
    //新版本上线后列表（可以不用）
    getRefreshList() {
        let params = {};
        getRefreshVersionList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },

    //获取列表
    getList() {
       let params = {
        osType: this.searchParams.osType,
        status: this.searchParams.status
       };
        getVersionAllList(params).then(response => {
           if ((response.code === ERR_OK)) {
              this.tableData = [];
              this.tableData = response.data;
              this.totalCount = response.data.totalCount
          } else {
            IsAlert('获取版本列表失败','错误','error');
          }
      }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      let partthis = getStore('userMesage')
      this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
    },



  },
  activated: function() {
    this.getList();
  },
}
</script>

<style lang="less" scoped>
html {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none;
  }

  /*Chrome下隐藏滚动条，溢出可以透明滚动*/
  html::-webkit-scrollbar {
    width: 0px
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 12px;
    height: 16px;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background: #f6f6f6;
    border-radius: 2px;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 2px;
  }
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
.wordsnum{
    height: 117px;
    text-align: center;
    line-height: 117px;

}
.m_t_20{
  margin-top: 10px;
.el-form-item{
  margin: 0;
}}
.m_l_15{
  margin-left: 15px;
}
.btn-row {text-align: center;padding-top: 20px;}
.el-header,.el-main,.el-footer{
  padding:0;
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
.selector img{
    width: 150%;
}
.selpage {
    text-align: center;
    margin-top: 20px;
  }
</style>

