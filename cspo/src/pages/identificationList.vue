<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!--操作行-->
      <el-row :gutter="20">
        <el-col :span="5" class="m_b_15">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
        </el-col>

        <el-col :span="5" class="m_b_15">
          <el-select v-model="searchParams.institutionId" clearable placeholder="请选择所属机构">
            <el-option
              v-for="item in getInstitutionArr"
              :key="item.institutionId"
              :label="item.institutionName"
              :value="item.institutionId">
            </el-option>
          </el-select>
        </el-col>
        <el-col style="width: 370px" class="m_b_15">
          <el-date-picker
            v-model="rangeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

        <el-col :span="4" class="m_b_15">
          <el-button type="primary" @click="_doSearch">搜索</el-button>
        </el-col>
      </el-row>



      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="全部" name="first"></el-tab-pane>
        <el-tab-pane label="待认证" name="second"></el-tab-pane>
        <el-tab-pane label="已认证" name="third"></el-tab-pane>
        <el-tab-pane label="取消认证" name="fourth"></el-tab-pane>
        <el-tab-pane label="拒绝认证" name="five"></el-tab-pane>
      </el-tabs>

      <!--table 表单开始-->
      <el-table
        :data="doctorIdenList"
        border
        style="width: 100%">
        <el-table-column prop="name" label="医生姓名"  width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="instituionName" label="机构"></el-table-column>
        <el-table-column prop="creatTime" label="申请时间"></el-table-column>
        <el-table-column prop="updateTime" label="操作时间"></el-table-column>
        <el-table-column prop="authenticationStatus" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.authenticationStatus===1">待认证</el-tag>
            <el-tag type="success" v-if="scope.row.authenticationStatus===2">已认证</el-tag>
            <el-tag type="warning" v-if="scope.row.authenticationStatus===3">已取消</el-tag>
            <el-tag type="danger" v-if="scope.row.authenticationStatus===4">已拒绝</el-tag>
          </template>

        </el-table-column>

        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="primary" @click="agree(scope.row,scope.$index )">同意</el-button>
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="danger" @click="refuse(scope.row,scope.$index, )">拒绝</el-button>
            <el-button size="mini" type="info" @click="_checkDetail(scope.row,scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->



      <!--详情的dialog-->
      <el-dialog title="认证详情" :visible.sync="isShowDialog">


        <!--成功状态-->
        <el-card shadow="never" class="m_b_15 success-panel" v-if="false">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-success note-icon success-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证已成功！</h3>
              <p class="status-panel-text">身份信息已审核通过</p>
            </el-col>
          </el-row>
        </el-card>

        <!--认证申请中-->
        <el-card shadow="never" class="m_b_15 warning-panel">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-warning note-icon warning-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证申请中！</h3>
              <p class="status-panel-text">如有问题，请咨询400-820-2830</p>
            </el-col>
          </el-row>
        </el-card>

        <!--认证失败-->
        <el-card shadow="never" class="m_b_15 fail-panel" v-if="false">
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: right">
              <strong class="title-note">
                <span class="el-icon-error note-icon error-icon"></span>
              </strong>
            </el-col>
            <el-col :span="20">
              <h3 class="status-panel-text">认证失败！</h3>
              <p class="status-panel-text">失败原因：拒绝</p>
            </el-col>
          </el-row>
        </el-card>







        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="logo-note">LOGO：</strong>
          </el-col>
          <el-col :span="7">
            <img class="logoImg" src="http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/6QuIMtzCY1uxqiG3KheMKcdxb5vBkPnH.jpg"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">姓名：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职业证号：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">科室：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">擅长：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">简介：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
        </el-row>



        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">学习研究成果获奖：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">推荐理由：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
        </el-row>


        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">医生从业资格证：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" src="http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/vncob8nwjV3XMFOEUYDv1buJWG4BlXwP.jpg"/>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称证书：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" src="http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/vncob8nwjV3XMFOEUYDv1buJWG4BlXwP.jpg"/>
          </el-col>
        </el-row>



        <el-row :gutter="20" class="m_b_15">

          <el-col :span="5" style="text-align: right">
            <strong class="title-note">执业医院：</strong>
          </el-col>
          <el-col :span="7">
            <span>慧慧</span>
          </el-col>
        </el-row>
        <div class="btn-row" style="text-align: center">
          <el-button size="small" type="primary" @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>




    </div>
  </div>

</template>

<script>
  import headerTop from "@/components/headTop.vue";

  import { mapGetters } from "vuex";
  export default {




    data(){


      return {

        isShowDialog:false,//是否显示dialog

        activeName: 'first',
        rangeTime:"",//开始时间和结束时间
        //医生认证列表数据
        doctorIdenList: [
          {authenticationRefuseReason:null,creatTime:"2018-07-04 16:59:50",institutionId:"2c8080aa6464825a016464825a000000",instituionName:"安鑫",name:"xinjian66",roleName:"医生主任",updateTime:"2018-07-04 16:59:55",sort:534,insDoctorId:"2c8080aa64642eca0164648450570007",authenticationTime:"2018-07-04 16:59:55",userId:323,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-07-04 16:21:56",institutionId:"2c8080aa63de10dc0163de10dc250000",instituionName:"上海宝杉科技",name:"杨岳",roleName:"医生角色",updateTime:"2018-07-04 16:22:05",sort:1,insDoctorId:"2c8080aa64642eca0164645fddf00001",authenticationTime:"2018-07-04 16:22:05",userId:322,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-07-02 11:40:29",institutionId:"2c8080aa63de6dd90163de96920c0005",instituionName:"1",name:"xinjian123",roleName:"医生主任",updateTime:"2018-07-02 11:40:38",sort:34535,insDoctorId:"2c8080aa645912ad01645912ad2f0000",authenticationTime:"2018-07-02 11:40:38",userId:312,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-06-25 14:55:07",institutionId:"2c8080aa63de6dd90163de96920c0005",instituionName:"1",name:"这是测试姓名",roleName:"邵勇-角色",updateTime:"2018-06-25 14:55:17",sort:1,insDoctorId:"2c8080aa64359c67016435b4ad9b0002",authenticationTime:"2018-06-25 14:55:17",userId:305,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-06-21 10:50:52",institutionId:"2c8080aa63de6dd90163de6dd92b0000",instituionName:"上海天意达公司",name:"paixu1",roleName:"医生角色",updateTime:"2018-06-21 10:51:41",sort:8,insDoctorId:"0000000064201ee9016420373d150003",authenticationTime:"2018-06-21 10:51:41",userId:295,authenticationStatus:3},
          {authenticationRefuseReason:null,creatTime:"2018-06-20 15:59:07",institutionId:"2c8080aa640272d2016402773c020001",instituionName:"河南省直三院",name:"左丽红-河南省直三院",roleName:"医生角色",updateTime:"2018-06-21 11:00:51",sort:6,"insDoctorId":"2c8080aa641bf4cd01641c05b0c90005",authenticationTime:"2018-06-21 11:00:51",userId:286,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-06-20 14:51:30",institutionId:"2c8080aa642067460164206746b20000",instituionName:"包头中心医院",name:"saitest2",roleName:"医生角色",updateTime:"2018-06-21 13:34:12",sort:1,insDoctorId:"2c8080aa641bf4cd01641bf4cd7e0000",authenticationTime:"2018-06-21 13:34:12",userId:285,authenticationStatus:2},
          {authenticationRefuseReason:null,creatTime:"2018-06-20 09:41:06",institutionId:"2c8080aa642067460164206746b20000",instituionName:"包头中心医院",name:"sai test",roleName:"医生角色",updateTime:null,sort:1,insDoctorId:"2c8080aa64161c93016416d218ad0023",authenticationTime:"2018-06-20 09:41:06",userId:284,authenticationStatus:1},
          {authenticationRefuseReason:null,creatTime:"2018-06-19 17:28:16",institutionId:"2c8080aa64010b680164010b68a20000",instituionName:"株洲市中心医院",name:"袁医生",roleName:"医生角色",updateTime:null,sort:1,insDoctorId:"2c8080aa64161c93016416ba0ab40021",authenticationTime:"2018-06-19 17:28:16",userId:283,authenticationStatus:1},
          {authenticationRefuseReason:null,creatTime:"2018-06-19 14:23:06",institutionId:"2c8080aa63de10dc0163de10dc250000",instituionName:"上海宝杉科技",name:"test",roleName:"医生角色",updateTime:"2018-06-19 14:24:11",sort:9,insDoctorId:"2c8080aa64161c93016416b4d8a3001a",authenticationTime:"2018-06-19 14:24:11",userId:282,authenticationStatus:2}
        ],

        //显示不同的操作状态  1 列表  2详情
        showStatus: 1,
        tabIndex: null,
        //医生审核详情
        doctorInfo: {},
        //机构列表信息
        institutionArr: [],
        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          startTime: null,
          endTime: null,
          institutionId: "",
          authenticationStatus: null,
          name: null
        },
        nowDate: '',
      }
    },


    methods:{

      _doSearch(){},
      //点击tab
      tabClick(tab, event) {
        //console.log(tab, event);
        console.log(tab);
      },


      //点击查看
      _checkDetail(item){
        this.doctorInfo=item;
        console.log(this.doctorInfo)
        this.isShowDialog=true;
        /* if (vm.doctorIdenList.length) {
        var item = vm.checkSelect(vm.doctorIdenList);
      }

      console.log(item);
      if (item) {
        this.searchParams.authenticationStatus = item.authenticationStatus;
        this.showStatus = 2;
        $.ajax({
          type: "POST",
          url: baseURL + "sys/doctorApply/queryDoctorApplyInfo",
          contentType: "application/x-www-form-urlencoded",
          data: {insDoctorId: item.insDoctorId},
          success: function (res) {
            if (res.code === 1) {
              vm.doctorInfo = res.data;
              vm.doctorInfo.authenticationRefuseReason = item.authenticationRefuseReason || "暂无原因";
              console.log('详情', vm.doctorInfo);
            } else {
              console.log('查看详情失败', res.code);
              alert(res.msg);
            }
          }
        });
      }*/

      },



      //关闭dialog
      closeDialog(){
        this.isShowDialog=false;

      }

    },



    components: {
      headerTop,
    },


    computed:{

      ...mapGetters(['getInstitutionArr'])
    }

  }
</script>

<style lang="less" scoped>
  .el-select{display: block}
  .el-button--mini{padding: 7px 10px}
  .logoImg{width: 60px;height: 60px;border-radius: 50%}
  .logo-note{line-height: 60px;}
  .title-note{line-height: 22px;}
  .zhengshuImg{width: 50px;height: 50px;}
  .success-panel{background-color: #d8e8d8;border: 1px solid #44ae44}
  .warning-panel{background-color: #f9ebd8;border: 1px solid #f0ad4e}
  .fail-panel{background-color: #f6cbca;border: 1px solid #d9534f}
  .note-icon{font-size: 20px}

  .success-icon{color:#44ae44;}
  .warning-icon{color:#f0ad4e}
  .error-icon{color:#d9534f;}

  .status-panel-text{line-height: 22px;color:#444;font-size: 14px;}


</style>
