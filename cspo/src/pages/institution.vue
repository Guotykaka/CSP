<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5">
            <el-input v-model="formInline.valueBT" placeholder="机构编号" clearable></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="formInline.valueBT" placeholder="机构名称" clearable></el-input>
          </el-col>
          <el-col :span="5">
            <el-select v-model="formInline.valueLX" clearable placeholder="APP是否显示">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="formInline.valueZT" clearable placeholder="短信服务是否开通">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="m_b_15">
          <el-button type="primary">清空</el-button>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-row>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=40%>
          <el-form :model="editTable">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.username" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.password" auto-complete="off" placeholder="密码" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.email" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.mobile" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-badge is-dot class="dot">
                  <el-input v-model="editTable.deptName" auto-complete="off" el></el-input>
                </el-badge>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-checkbox-group v-model="editTable.checkList">
                  <el-checkbox label="医生角色"></el-checkbox>
                  <el-checkbox label="运营人员"></el-checkbox>
                  <el-checkbox label="健管师"></el-checkbox>
                  <el-checkbox label="医生主任"></el-checkbox>
                  <br>

                  <el-checkbox label="产品"></el-checkbox>
                  <el-checkbox label="邵勇-角色"></el-checkbox>
                  <el-checkbox label="sai医生角色"></el-checkbox>
                  <el-checkbox label="媒体号"></el-checkbox>
                  <br>
                  <el-checkbox label="内容编辑"></el-checkbox>
                  <el-checkbox label="市场部"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="editTable.userType" label="0">禁用</el-radio>
                <el-radio v-model="editTable.userType" label="1">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="_doCancel()">取 消</el-button>
            <el-button type="primary" @click="_doHandleEdit()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="dialogCheckVisible" width=40%>
          <ul :model="selectTable">
            <li>
              <div class="messageTitle">
                <p>基本信息</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构编号：</span>
                        <span class="ml20">{{selectTable.institutionCode}}</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构名称：</span>
                        <span class="ml20">{{selectTable.institutionName}}</span>
                      </div>
                    </div>
                  </li>
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构地址：</span>
                        <span class="ml20">{{selectTable.institutionAddr}}</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构等级：</span>
                        <span>
                          <b class="ml20 cir-style">{{selectTable.gradeName}}</b>
                          <b class="ml20 cir-bstyle">{{selectTable.lavelName}}</b>
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="messageTitle">
                <p>推广信息</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>地推链接：</span>
                        <span class="ml20">暂无数据</span>
                      </div>
                    </div>
                  </li>
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构地推LOGO：</span>
                        <span src="" alt="">暂无图片</span>
                      </div>
                      <div class="fr msgfr">
                        <span>机构地推宣传图：</span>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="messageTitle">
                <p>运营设置</p>
              </div>
              <div class="messageMain">
                <ul class="messageBody">
                  <li style="overflow: hidden;">
                    <div class="messageli">
                      <div class="fl msgfl">
                        <span>机构Banner推广链接：</span>
                        <span>暂无数据</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCheckVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=40%>
          <template :model="addTable">
            <el-tabs @tab-click="handleClick">
                <!-- 新增==基本信息 -->
              <el-tab-pane label="基本信息">
                <el-form :model="addTable" label-width="80">
                  <el-form-item label="机构编号:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionCode" auto-complete="off" placeholder="请输入机构编号" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构名称:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionName" auto-complete="off" placeholder="请输入机构名称" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="机构地址:" :label-width="formLabelWidth">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionAddr" auto-complete="off" placeholder="请输入机构名称" el></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-form :inline="true" :model="addTable">
                  <el-form-item label="机构类型:" label-width="120px">
                    <el-select v-model="addTable.gradeName" placeholder="">
                      <el-option label="公立" value="1"></el-option>
                      <el-option label="民营" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="addTable.lavelName" placeholder="">
                      <el-option label="三甲医院" value="1"></el-option>
                      <el-option label="二甲医院" value="2"></el-option>
                      <el-option label="三级医院" value="3"></el-option>
                      <el-option label="二级医院" value="4"></el-option>
                      <el-option label="一级医院" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>

              </el-tab-pane>
                <!-- 新增==配置管理 -->
              <el-tab-pane label="配置管理">
                <el-form :model="addTable" label-width="300px">
                  <el-form-item label="地推链接:" :label-width="formLabelWidth150">
                    <el-col :span="16">
                      <el-input v-model="addTable.institutionExtensionUrl" auto-complete="off" placeholder="请输入地推链接" el></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="微信机构二维码链接:" :label-width="formLabelWidth150">
                    <el-col :span="10">
                      <el-button type="primary" size="medium" @click="">生成二维码链接</el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="医院地推LOGO:" :label-width="formLabelWidth150">
                      <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="医院地推LOGO:" :label-width="formLabelWidth150">
                      <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 新增==角色管理 -->
              <el-tab-pane label="角色管理">{{addTable.lavelName}}</el-tab-pane>
              <el-tab-pane label="addTable">{{addTable}}</el-tab-pane>
            </el-tabs>
          </template>

          <div slot="footer" class="dialog-footer">
            <el-button @click="_doAddCancel()">取 消</el-button>
            <el-button type="primary" @click="_doAdd()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" id="app">
            <el-table-column align="center" prop="institutionCode" label="机构编号"></el-table-column>
            <el-table-column align="center" prop="institutionName" label="机构名称"></el-table-column>
            <el-table-column align="center" prop="institutionAddr" label="机构地址"></el-table-column>
            <el-table-column align="center" prop="gradeName" label="机构类型"></el-table-column>
            <el-table-column align="center" label="APP是否展示">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.whetherAppShow === 1">是</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.whetherAppShow === 0">否</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否开通短信服务">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.whetherOpenMsm ===1">是</el-tag>
                  <el-tag size="medium" type="danger" v-if="scope.row.whetherOpenMsm === 0">否</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
      imageUrl: '',
      formInline: { valueSS: '' },
      currentPage: 1, //分页初始页码
      pagesize: 30, //分页初始显示条数
      tableData: [], //列表数据
      selectTable: {}, //查看单个数据
      editTable: {}, //修改单个数据
      editTableRoot: {},
      addTable: {
        //新增单个数据
        institutionId: '2c8080aa6464825a016464825a000000',
        institutionCode: 'bjbr002',
        institutionName: '安鑫',
        institutionAddr: '234243',
        institutionGradeId: '1',
        institutionLavelId: '3',
        institutionExtensionUrl: null,
        qrCodeUrl: null,
        extensionLogoUrl: null,
        extensionImageUrl: null,
        whetherAppShow: 1,
        whetherOpenMsm: 0,
        whetherHasPdfReport: 0,
        medicalExamReportLogo: null,
        bannerLogo: null,
        bannerExtensionUrl: null,
        institutionDesc: null,
        whetherDelete: 0,
        createTime: '2018-07-04 16:57:01',
        lastUpdateTime: null,
        createUser: '1',
        updateUser: null,
        registeredReservationAddr: null,
        gradeName: '公立',
        lavelName: '三级医院'
      }, //新增单个数据
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      inde: null, //index flag
      formLabelWidth: '120px',
      formLabelWidth150: '150px'
    }
  },
  methods: {
    //上传
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    
    // tab点击事件
    handleClick(tab, event) {
      console.log(tab, event)
      console.log(this.addTable)
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
      this.addTable = {
        institutionId: '2c8080aa6464825a016464825a000000',
        institutionCode: 'bjbr002',
        institutionName: '安鑫',
        institutionAddr: '234243',
        institutionGradeId: '1',
        institutionLavelId: '3',
        institutionExtensionUrl: null,
        qrCodeUrl: null,
        extensionLogoUrl: null,
        extensionImageUrl: null,
        whetherAppShow: 1,
        whetherOpenMsm: 0,
        whetherHasPdfReport: 0,
        medicalExamReportLogo: null,
        bannerLogo: null,
        bannerExtensionUrl: null,
        institutionDesc: null,
        whetherDelete: 0,
        createTime: '2018-07-04 16:57:01',
        lastUpdateTime: null,
        createUser: '1',
        updateUser: null,
        registeredReservationAddr: null,
        gradeName: '公立',
        lavelName: '三级医院'
      }
      this.dialogAddVisible = false
      // console.log(this.addTable.username)
      // console.log(this.index)
    },
    //取消新增
    _doAddCancel() {
      this.addTable = {
        //重置新增数据为空
        institutionId: '2c8080aa6464825a016464825a000000',
        institutionCode: 'bjbr002',
        institutionName: '安鑫',
        institutionAddr: '234243',
        institutionGradeId: '1',
        institutionLavelId: '3',
        institutionExtensionUrl: null,
        qrCodeUrl: null,
        extensionLogoUrl: null,
        extensionImageUrl: null,
        whetherAppShow: 1,
        whetherOpenMsm: 0,
        whetherHasPdfReport: 0,
        medicalExamReportLogo: null,
        bannerLogo: null,
        bannerExtensionUrl: null,
        institutionDesc: null,
        whetherDelete: 0,
        createTime: '2018-07-04 16:57:01',
        lastUpdateTime: null,
        createUser: '1',
        updateUser: null,
        registeredReservationAddr: null,
        gradeName: '公立',
        lavelName: '三级医院'
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
    },
    //取消修改
    _doCancel() {
      this.tableData.splice(this.inde, 1, this.editTableRoot) //删除修改的数据并替换为原始数据
      this.dialogEditVisible = false
    },
    //获取用户列表
    getInstitutionList() {
      this.$http
        .post('http://localhost:8080/api/institution')
        .then(response => {
          this.tableData = []
          this.tableData = this.tableData.concat(response.data.data)
          // response.data.data.forEach(item => {
          //   const tableData = {}
          //   tableData.username = item.username

          // })
        })
    }
  },
  created: function() {
    this.getInstitutionList()
  }
}
</script>

<style  lang="less">
// 上传样式
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>

<style lang="less" scoped>
.el-select {
  display: block;
}
.el-input {
  margin-bottom: 15px;
}
.el-form {
  margin-top: 15px;
}




/*查看选中项*/
.messageTitle {
  padding: 5px 5px;
  border-bottom: 1px solid #c9c9c9;
  font-size: 17px;
  font-weight: 600;
}
.messageTitle p {
  margin-left: 20px;
  display: flex;
}
.messageMain {
  padding: 5px;
}
.messageBody {
  margin-top: 20px;
}
.messageBody li {
  margin-bottom: 5px;
}
.messageBody .messageli {
  display: flex;
  padding: 0 40px 0 80px;
  overflow: hidden;
}
.messageBody span {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
}
.fl {
  float: left;
}
.fr {
  float: right;
  text-align: left;
}
.msgfr {
  flex: 1;
}
.msgfl {
  flex: 1;
}
.ml20 {
  margin-left: 10px;
}
.cir-style {
  background: #f60;
  /*width: 30px;*/
  height: 20px;
  line-height: 20px;
  padding: 5px 20px;
  border-radius: 15px;
  font-weight: 400;
  color: #fff;
}
.cir-bstyle {
  background: #3c8dbc;
  /*width: 30px;*/
  height: 20px;
  line-height: 20px;
  padding: 5px 20px;
  border-radius: 15px;
  font-weight: 400;
  color: #fff;
}
.reStyle {
  text-align: center;
  margin: 30px;
}
.img-style {
  width: 200px;
  height: 200px;
  box-sizing: content-box;
  vertical-align: top;
}
</style>
