<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-form :model="searchParams" class="demo-form-inline">
          <el-form-item label="用户登录名：">
            <el-col :span="4">
              <el-input v-model="searchParams.loginName" placeholder="用户登录名" clearable></el-input>
            </el-col>
            <el-button type="primary" @click="doSearch()" class="m_l_15">查询</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>

      </el-header>
      <el-main>

        <!-- 列表开始 -->
        <template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column show-overflow-tooltip align="center" prop="userId" type="index" label="Id" min-width="25%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="loginName" label="用户登录名" min-width="50%"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="email" label="邮箱"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success" v-if="scope.row.status === 1">正常</el-tag>
                  <el-tag size="medium" type="danger" v-else="scope.row.status === 0">禁用</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="312">
              <template slot-scope="scope">
                <el-button size="mini" type="info" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)"  v-if="scope.row.status === 1">禁用</el-button>
                <el-button size="mini" type="success" @click="UNdeleteMessage(scope.$index, scope.row)"  v-if="scope.row.status === 0">启用</el-button>
                <el-button plain size="mini" type="warning" @click="deleteCode(scope.$index, scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 新增开始 -->
        <el-dialog title="新增" :visible.sync="dialogAddVisible" width=650px>
          <el-form :model="addTable">
            <el-form-item class="is-required" label="登录名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.loginName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="真实姓名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.userName" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="密码:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.password" auto-complete="off" placeholder="密码" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.email" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="addTable.mobile" auto-complete="off" el></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="用户头像:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccess" @emitError="handImgError"
                         :imageSrc="addTable.userAvatar"></uploadimg>
            </el-form-item>
            <el-form-item label="所属供应商:" :label-width="formLabelWidth">
              <el-autocomplete
                class="searchInp"
                popper-class="my-autocomplete"
                v-model="supplierName"
                :fetch-suggestions="querySearchGYS"
                placeholder="请输入供应商"
                @select="handleSelectGYS">
                <template slot-scope="{ item }">
                  <div class="name">{{ item.supplierName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="机构:" :label-width="formLabelWidth">
              <el-autocomplete  
                class="searchInp"
                popper-class="my-autocomplete"
                v-model="institutionName"
                :fetch-suggestions="querySearch"
                placeholder="请输入机构"
                @select="handleSelect">
                <template slot-scope="{ item }">
                  <div class="name">{{ item.institutionName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>


            <el-form-item class="is-required" label="角色:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16">
                  <el-checkbox-group v-model="addTable.roleIdList">
                    <el-checkbox v-for="(item,index) in roleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item class="is-required" label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="addTable.status" :label='0'>禁用</el-radio>
                <el-radio v-model="addTable.status" :label='1'>正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doAdd">确定</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel">取消</el-button>
          </div>
        </el-dialog>

        <!-- 修改开始dialog -->
        <el-dialog title="修改" :visible.sync="dialogEditVisible" width=650px>
          <el-form :model="editTable">
            <el-form-item class="is-required" label="登录名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.loginName" auto-complete="off" el clearable readOnly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item class="is-required" label="用户名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.userName" readOnly></el-input>
              </el-col>
            </el-form-item>

            <el-form-item class="is-required" label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.email" auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>

            <el-form-item class="is-required" label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="editTable.mobile" auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="用户头像:" :label-width="formLabelWidth">
              <uploadimg @emitSuccess="handImgSuccessEdit" @emitError="handImgErrorEdit"
                         :imageSrc="editTable.userAvatar"></uploadimg>
            </el-form-item>
            <el-form-item label="所属供应商:" :label-width="formLabelWidth">
              <el-autocomplete
                class="searchInp"
                popper-class="my-autocomplete"
                v-model="supplierName"
                :fetch-suggestions="querySearchGYS"
                placeholder="请输入供应商"
                @select="handleSelectGYS">
                <template slot-scope="{ item }">
                  <div class="name">{{ item.supplierName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="机构:" :label-width="formLabelWidth">
              <el-autocomplete
                class="searchInp"
                popper-class="my-autocomplete"
                v-model="institutionName"
                :fetch-suggestions="querySearch"
                placeholder="请输入机构"
                @select="handleSelect">
                <template slot-scope="{ item }">
                  <div class="name">{{ item.institutionName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item class="is-required" label="角色:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16">
                  <el-checkbox-group v-model="editTable.roleIdList">
                    <el-checkbox v-for="(item,index) in roleList" :label="item.roleId" :key="index">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item class="is-required" label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="editTable.status" :label='0' onclick="return false">禁用</el-radio>
                <el-radio v-model="editTable.status" :label='1' onclick="return false">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleEdit">确定</el-button>
          <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>

        <!-- 查看开始dialog -->
        <el-dialog title="查看" :visible.sync="dialogCheckVisible" width=650px>
          <el-form :model="selectTable">
            <el-form-item label="登录名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.loginName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="真实姓名:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.userName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.email" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.mobile" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="用户头像:" :label-width="formLabelWidth">
              <el-col :span="16">
                <img :src="selectTable.userIcon" width="100" height="100"/>
              </el-col>
            </el-form-item>
            <!-- <el-form-item label="所属供应商:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16" class="self-check-content">
                    <span v-for="(item,index) in supplierList" :key="index" class="self-check" :class="(item.supplierId === selectTable.supplierId) ? 'active' : ''">
                      <i class="check-icon" :class="(item.supplierId === selectTable.supplierId) ? 'active' : ''" ></i>{{item.supplierName}}
                    </span>
                </el-col>
              </template>
            </el-form-item> -->
            <el-form-item label="所属供应商:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.supplierName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="机构:" :label-width="formLabelWidth">
              <el-col :span="16">
                <el-input v-model="selectTable.institutionName" auto-complete="off" el readonly></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <template>
                <el-col :span="16">
                  <el-checkbox-group v-model="selectTable.roleIds">
                    <el-checkbox v-for="(item,index) in roleList" :label="item.roleId" :key="index" onclick="return false">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <template slot-scope="scope">
                <el-radio v-model="selectTable.status" :label='0' onclick="return false">禁用</el-radio>
                <el-radio v-model="selectTable.status" :label='1' onclick="return false">正常</el-radio>
              </template>
            </el-form-item>
          </el-form>
          <div class="btn-row">
          <el-button size="small" type="primary" @click="dialogCheckVisible = false">确定</el-button>
          <el-button size="small" type="primary" @click="dialogCheckVisible = false">取消</el-button>
          </div>
        </el-dialog>

      </el-main>
      <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
import {
  ERR_OK,
  getUserList,
  getUserInfo,
  postUserUpdate,
  postUserSave,
  postUserDelete,
  postDoctorResetPassword,
  getListWithNoParam,
  getSupperlierList
} from '@/api/api.js'
import headerTop from '@/components/headTop.vue';
import {getStore,EncodeUserId,IsAlert} from "@/config/mUtils.js";
import uploadimg from '@/components/uploadImg/uploadImgAdd.vue'


import { mapGetters } from "vuex";
var mbTest = /^(11|12|13|14|15|16|17|18|19)[0-9]{9}$/;

export default {
  components: {
    headerTop,
    uploadimg
  },
  data() {
    return {
      title:"提示",//this.$alert的标题
      searchParams: {
        currentPage: 1,
        pageSize: 10,
        userType: '',
        loginName: ''
      },
      totalCount: 0,
      currentPage: 1, //分页初始页码
      pagesize: 10, //分页初始显示条数
      tableData: [], //列表数据
      roleList: [], //角色数据


      //查看单个数据
      selectTable: {
        email: "",
        institutionId: "",
        institutionName: "",
        loginName: "",
        mobile: "",
        roleIds: [],
        status: 1,
        supplierId: "",
        userIcon: "",
        userName: "",

      },


      //编辑单个数据
      editTable: {
        userId: "",
        loginName: '',//登录名
        userName:'',//真实姓名
        salt: '',
        email: '',
        mobile: '',
        status: "1",
        roleIdList: [],
        createTime: '',
        deptId: 1,
        deptName: '',
        userType: 0,
        userAvatar:"",//用户头像
        supplierId:"",
      },


      //新增单个数据
      addTable: {
        //新增单个数据
        userId: null,
        loginName: '',//登录名
        userName:'',//真实姓名
        password: '',//密码
        salt: '',
        email: '',
        mobile: '',
        status: 1,
        roleIdList: [],
        createTime: '2016-11-11 11:11:11',
        deptId: 1,
        deptName: '',
        userType: 0,
        userAvatar:"",//用户头像
        institutionId:"",//机构id

      },
      dialogCheckVisible: false, //查看
      dialogEditVisible: false, //修改
      dialogAddVisible: false, //新增
      formLabelWidth: '120px',
      institutionName:"",//机构名称
      institutionId:"",//机构id
      supplierId:"",//机构名称
      supplierName:"",//机构id
      supplierList:[],//供应商
      selectedSupplierId:""//选中的供应商id
    }
  },

  computed:{
    ...mapGetters(['getInstitutionArr'])
  },

  methods: {
        //获取供应商列表
    getSupperlierListFn() {
      let params = {};
      getSupperlierList(params).then(res => {
        if(res.code === ERR_OK){
          this.supplierList=res.data;
        }else {
          IsAlert(res.msg, '错误', 'error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      })
    },

    //供应商，自带搜索组件搜索供应商
    querySearchGYS(queryString, cb) {
      if (queryString) {//若输入框不为空，匹配supplierId，否则supplierId为空
        let supplierList = this.supplierList;
        let results = queryString ? supplierList.filter(this.createFilterGYS(queryString)) : supplierList;
        cb(results);
      }else{
        let supplierList = this.supplierList;
        let results = queryString ? supplierList.filter(this.createFilterGYS(queryString)) : supplierList;
        cb(results);
        this.supplierId ='';
      }
    },
    //机构，自带搜索组件搜索
    querySearch(queryString, cb) {//若输入框不为空，匹配institutionId，否则institutionId为空
      if (queryString) {
        let institutions = this.getInstitutionArr;
        let results = queryString ? institutions.filter(this.createFilter(queryString)) : institutions;
        cb(results);
      } else {
        let institutions = this.getInstitutionArr;
        let results = queryString ? institutions.filter(this.createFilter(queryString)) : institutions;
        cb(results);
        this.institutionId='';
      }
    },
    createFilterGYS(queryString) {//供应商
      return (restaurant) => {
        return (restaurant.supplierName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    createFilter(queryString) {//机构
      return (restaurant) => {
        return (restaurant.institutionName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },

    //机构的搜索选择
    handleSelect(item){
      this.institutionName=item.institutionName;
      this.institutionId=item.institutionId
    },
    //供应商的搜索选择
    handleSelectGYS(item){
      this.supplierName=item.supplierName;
      this.supplierId=item.supplierId;
    },
    doSearch() {
      this.searchParams.currentPage=1;
      this.getUserList()
    },
    handleSizeChange: function(size) {
      this.searchParams.pageSize=size;
      this.getUserList()
    },
    handleCurrentChange: function(currentPage) {
      this.searchParams.currentPage=currentPage;
      this.getUserList()
    },

    // 新增
    handleAdd() {
      this.selectedSupplierId="";
      this.addTable.loginName="";
      this.addTable.userName="";
      this.addTable.email="";
      this.addTable.institutionId="";
      this.institutionName="";
      this.supplierName="";
      this.supplierId="";
      this.addTable.password="";
      this.addTable.mobile="";
      this.addTable.userAvatar="";
      this.addTable.roleIdList=[];
      this.dialogAddVisible = true;
    },
    // 确定新增
    _doAdd() {
      let params={
        createTime: "",
        lastLoginTime: "",//最近登录
        updateTime: "",//更新时间
        salt: "",//盐
        email: this.addTable.email,//邮箱
        institutionId: this.institutionId,//机构id
        supplierId: this.supplierId,//供应商id
        loginName: this.addTable.loginName,//登录名
        userName: this.addTable.userName,//用户名
        mobile: this.addTable.mobile,//手机号
        password: this.addTable.password,//密码
        roleIds: this.addTable.roleIdList,//角色列表
        status: this.addTable.status,//1正常 0禁用
        userIcon: this.addTable.userAvatar,//用户icon
        userId: this.addTable.userId,//用户id
      };
      if(!params.loginName){
        IsAlert('登录名不能为空', '提示', 'warning');
        return;
      }
      if(!params.userName){
        IsAlert('真实名不能为空', '提示', 'warning');
        return;
      }

      if(!params.password){
        IsAlert('密码不能为空', '提示', 'warning');
        return;
      }

      if(!params.email){
        IsAlert('邮箱不能为空', '提示', 'warning');
        return;
      }
      if(!/\S*@\S*\.\S*/.test(params.email)){
        IsAlert('请输入正确的邮箱格式', '提示', 'warning');
        return;
      }

      if(!/^(1\d{10}\s*,)*(1\d{10})$/.test(params.mobile)){
        IsAlert('手机号不能为空', '提示', 'warning');
        return;
      }
      if(params.supplierId===''&&params.institutionId===''){
        IsAlert('供应商和机构至少选择一个', '提示', 'warning');
        return;
      }
      if(params.institutionId===''){
        IsAlert('机构不能为空', '提示', 'warning');
        return;
      }
      if(!mbTest.test(params.mobile)){
        IsAlert('手机号格式不正确', '提示', 'warning');
        return;
      }
      if(params.roleIds.length === 0){
        IsAlert('请选择角色', '提示', 'warning');
        return;
      }
      postUserSave(params).then(res => {
        if (res.code === ERR_OK) {
          this.dialogAddVisible=false;//关闭弹窗
          IsAlert(res.msg, '成功', 'success');
          this.getUserList();
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });

    },


    //取消新增
    _doAddCancel(){
      this.dialogAddVisible = false;
    },

    // 查看详情
    handleCheck(index, row) {
      let params = {
        id: row.userId
      };
      getUserInfo(params).then(res => {
        if(res.code ===ERR_OK ){
          this.selectTable.email=res.data.email;
          this.selectTable.institutionName=res.data.institutionName;
          this.selectTable.loginName=res.data.loginName;
          this.selectTable.userName=res.data.userName;
          this.selectTable.mobile=res.data.mobile;
          this.selectTable.roleIds=res.data.roleIds;
          this.selectTable.status=res.data.status;
          this.selectTable.supplierId=res.data.supplierId;
          this.selectTable.supplierName=res.data.supplierName;
          this.selectTable.userIcon=res.data.userIcon;
          this.dialogCheckVisible = true
        }else{
          IsAlert(res.msg, '错误', 'error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });
     //
    },
    //获取角色复选框
    getRoleList() {
      let params = {};
      getListWithNoParam(params).then(response => {
        this.roleList = [];
        this.roleList = response.data
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      })
    },

    // 点击修改 获取用户信息
    handleEdit(index, row) {
      let params = {
        id: row.userId
      };
      getUserInfo(params).then(res => {
        if(res.code ===ERR_OK){
          this.editTable.userId=res.data.userId;//用户id
          this.editTable.loginName=res.data.loginName;//登录名
          this.editTable.userName=res.data.userName;//真实姓名
          this.editTable.email=res.data.email;//邮箱
          this.editTable.mobile=res.data.mobile;//手机号
          this.editTable.status=res.data.status;//状态
          this.editTable.roleIdList=res.data.roleIds;//角色id
          this.editTable.createTime=res.data.createTime;//创建时间
          this.editTable.userAvatar=res.data.userIcon;//用户头像
          this.editTable.supplierId=res.data.supplierId;//供应商id
          this.editTable.status=res.data.status;
          this.institutionId=res.data.institutionId;//机构id
          this.institutionName=res.data.institutionName;//机构名称
          this.selectedSupplierId=res.data.supplierId;//供应商id
          this.supplierName=res.data.supplierName;//供应商id
          this.supplierId=res.data.supplierId;//供应商id
          this.dialogEditVisible=true;
        }else{
          IsAlert(res.msg, '错误', 'error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });

    },
    //确定修改
    _doHandleEdit() {
      let params={
        createTime: "",
        lastLoginTime: "",//最近登录
        updateTime: "",//更新时间
        salt: "",//盐
        institutionId: this.institutionId,//机构id
        supplierId: this.supplierId,//供应商id
        password:"",
        email: this.editTable.email,//邮箱
        loginName: this.editTable.loginName,//登录名
        userName: this.editTable.userName,//用户名
        mobile: this.editTable.mobile,//手机号
        roleIds: this.editTable.roleIdList,//角色列表
        status: this.editTable.status,//1禁用 2正常
        userIcon: this.editTable.userAvatar,//用户icon
        userId: this.editTable.userId,//用户id
      };
      if(!params.loginName){
        IsAlert('登录名不能为空', '提示', 'warning');
        return;
      }
      if(!params.userName){
        IsAlert('真实名不能为空', '提示', 'warning');
        return;
      }
      if(!params.email){
        IsAlert('邮箱不能为空', '提示', 'warning');
        return;
      }
      if(!/\S*@\S*\.\S*/.test(params.email)){
        IsAlert('请输入正确的邮箱格式', '提示', 'warning');
        return;
      }

      if(!params.mobile){
        IsAlert('手机号不能为空', '提示', 'warning');
        return;
      }
      if(!mbTest.test(params.mobile)){
        IsAlert('手机号格式不正确', '提示', 'warning');
        return;
      }
      if(params.supplierId===''&&params.institutionId===''){
        IsAlert('供应商和机构至少选择一个', '提示', 'warning');
        return;
      }
      if(params.institutionId===''){
        IsAlert('机构不能为空', '提示', 'warning');
        return;
      }
      if(params.roleIds.length === 0){
        IsAlert('请选择角色', '提示', 'warning');
        return;
      }
      postUserSave(params).then(res => {
        if (res.code === ERR_OK) {
          this.dialogEditVisible=false;//关闭弹窗
          IsAlert(res.msg, '成功', 'success');
          this.getUserList();
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      });

    },
    //取消修改
    _doCancel() {
      this.$message({
        type: 'warning',
        message: '取消修改'
      });
      this.dialogEditVisible = false
    },

    // 启用提示
    UNdeleteMessage(index, row) {
      this.$confirm('确定要启用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            id : row.userId,
            status:1
          };
          postUserDelete(params).then(res => {
            if ((res.code ===ERR_OK)) {
              IsAlert(res.msg, '成功', 'success');
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
            this.getUserList()
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消'
          })
        })
    },
    // 禁用提示
    deleteMessage(index, row) {
      this.$confirm('确定要禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            id : row.userId,
            status:0
          };
          postUserDelete(params).then(res => {
            if ((res.code ===ERR_OK)) {
              IsAlert(res.msg, '成功', 'success');
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
            this.getUserList()
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消'
          })
        })
    },
    // 重置密码提示
    deleteCode(index, row) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let params = {
            userId: row.userId,
            id:EncodeUserId(JSON.parse(getStore("userMesage")).userId)
          };
          postDoctorResetPassword(params).then(res => {
            if (res.code ===ERR_OK) {
              IsAlert('已重置密码', '成功', 'success');
            } else {
              IsAlert(res.msg, '错误', 'error');
            }
            this.getUserList()
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试');
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消重置密码'
          })
        })
    },
    //获取用户列表
    getUserList() {
      let params = {
        currentPage: this.searchParams.currentPage,
        pageSize: this.searchParams.pageSize,
        loginName:this.searchParams.loginName,//用户登录名
        userName:""//用户真实姓名  目前传空
      };
      getUserList(params).then(response => {
        this.tableData = [];
        this.tableData = response.data.list;
        this.totalCount = response.data.totalCount
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试');
      })
    },



    //新增封面
    handImgSuccess(res) {
      if (res.status === 200) {
        this.addTable.userAvatar ='http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert('图片上传失败！', '错误', 'error');
      }
    },

    //处理图片错误
    handImgError() {
    },
    //编辑封面
    handImgSuccessEdit(res) {
      if (res.status === 200) {
        this.editTable.userAvatar ='http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
      } else {
        IsAlert('图片上传失败！', '错误', 'error');
      }
    },

    //编辑处理图片错误
    handImgErrorEdit() {
    },

    //点击供应商选择  新增
    selectSupplier(index){
      if(this.selectedSupplierId === this.supplierList[index].supplierId){
        this.selectedSupplierId = "";
        return
      }
      this.selectedSupplierId =this.supplierList[index].supplierId
    }
  },

  activated: function() {
    this.getUserList();
    this.getRoleList();
    this.getSupperlierListFn();
  },
}
</script>

<style lang="less" scoped>
.searchInp{
    width: 326.66px !important;
}
.minwidth {
  min-width: 200px;
}
.el-checkbox {
  margin-left: 20px;
}
.m_l_15 {
  margin-left: 15px;
}
.btn-row {text-align: center;padding-top: 20px;}
.el-header,.el-main,.el-footer{
  padding:0;
}



.self-check-content{
  overflow: hidden;
  .self-check{
    float: left;
    margin-right: 15px;
    cursor: pointer;
    &.active{
      color: #409EFF;
    }
    .check-icon{
      display: inline-block;
      width: 11px;
      height: 11px;
      background: url("./check_bg.png") no-repeat left top;
      margin-right: 5px;
      overflow: hidden;
      &.active{
        background: url("./check_bg.png") no-repeat right top;
    }

    }
  }
}
</style>
