<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!--操作行开始-->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchParams.name" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item label="机构">
          <el-select v-model="searchParams.institutionId" clearable placeholder="请选择所属机构">
            <el-option v-for="item in getInstitutionArr" :key="item.institutionId" :label="item.institutionName" :value="item.institutionId"></el-option>
          </el-select>
        </el-form-item>

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
          <el-button type="primary" @click="_doSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <!--操作行结束-->

      <!--tab nav-->
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="全部" name="null"></el-tab-pane>
        <el-tab-pane label="待认证" name="1"></el-tab-pane>
        <el-tab-pane label="已认证" name="2"></el-tab-pane>
        <el-tab-pane label="取消认证" name="3"></el-tab-pane>
        <el-tab-pane label="拒绝认证" name="4"></el-tab-pane>
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
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="primary" @click="agreeApply(scope.row,scope.$index )">同意</el-button>
            <el-button v-if="scope.row.authenticationStatus===1" size="mini" type="danger" @click="refuseApply(scope.row,scope.$index, )">拒绝</el-button>
            <el-button size="mini" type="info" @click="_checkDetail(scope.row,scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--table 表单结束-->

      <!--详情的dialog-->
      <el-dialog title="认证详情" :visible.sync="isShowDialog" width="70%">
        <!--成功状态-->
        <el-card shadow="never" class="m_b_15 success-panel" v-if="doctorInfo.authenticationStatus === 2">
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
        <el-card shadow="never" class="m_b_15 warning-panel" v-if="doctorInfo.authenticationStatus == 3 || doctorInfo.authenticationStatus == 4">
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
        <el-card shadow="never" class="m_b_15 fail-panel" v-if="doctorInfo.authenticationStatus == 0 || doctorInfo.authenticationStatus == 1">
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
            <img class="logoImg" :src="doctorInfo.logoUrl"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">姓名：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.name}}</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.positionalTitles || ''}}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职业证号：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.professionalCertificateCode || ''}}</span>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">科室：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.department || ''}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">擅长：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.department || ''}}</span>
          </el-col>


          <el-col :span="5" style="text-align: right">
            <strong class="title-note">执业医院：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.hospital || ''}}</span>
          </el-col>

        </el-row>

        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">学习研究成果获奖：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.winningDesc || ''}}</span>
          </el-col>
           <el-col :span="5" style="text-align: right">
            <strong class="title-note">简介：</strong>
          </el-col>
          <el-col :span="7">
            <span>{{doctorInfo.remarks || ''}}</span>
          </el-col>
        </el-row>


        <el-row :gutter="20" class="m_b_15">
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">医生从业资格证：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" :src="doctorInfo.doctorJobCertificateUrl"/>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <strong class="title-note">职称证书：</strong>
          </el-col>
          <el-col :span="7">
            <img class="zhengshuImg" :src="doctorInfo.titleCertificateUrl"/>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="m_b_15">

          <el-col :span="5" style="text-align: right">
            <strong class="title-note">推荐理由：</strong>
          </el-col>
          <el-col :span="18">
            <span>{{doctorInfo.recommendReason || ''}}</span>
          </el-col>
        </el-row>
        <div class="btn-row" style="text-align: center">
          <el-button size="small" type="primary" @click="agreeApply"  v-if="doctorInfo.authenticationStatus == 2 || doctorInfo.authenticationStatus == 4">同意</el-button>
          <el-button size="small" type="danger" @click="refuseApply"  v-if="doctorInfo.authenticationStatus == 2 || doctorInfo.authenticationStatus == 4">拒绝</el-button>
          <el-button size="small" type="warning" @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>


      <!--refuse reason dialog-->

      <el-dialog title="拒绝理由" :visible.sync="refuse.isShowDialog" width="400px">


        <el-input type="textarea" v-model="refuse.refuseReason"></el-input>



        <div class="btn-row" style="text-align: right">

          <el-button size="small" type="default" @click="">取消</el-button>
          <el-button size="small" type="primary" @click="">同意</el-button>

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
        tabIndex: 'null',//当前状态index

        //拒绝信息
        refuse:{
          isShowDialog:false,
          refuseReason:''
        },



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

        //医生审核详情
        doctorInfo: {
          insDoctorApplyId:"8ab2b2f2639509e30163950c6bef0002",
          insDoctorId:"8ab2b2f2639509e301639509e3210000",
          name:"yuexin3",
          professionalCertificateCode:"123456",
          positionalTitles:"医生",
          department:"心脏科",
          specialty:"擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长擅长",
          remarks:"简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介",
          winningDesc:"研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研究报告研",
          logoUrl:"http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/srwAI55LjxfZlu9VrpVw9T89jOCevjGf.jpg",
          doctorJobCertificateUrl:"http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/HuFO45MHhuaFYlcrdNNFLNFnkTQPdyvZ.jpg",
          titleCertificateUrl:"http://zhangshangtijian.b0.upaiyun.com/http:/zhangshangtijian.b0.upaiyun.com/yCZBMDkDcSfBcJHXMHakZwQyqD95KR3I.jpg",
          recommendReason:"推荐理由哈哈哈哈",
          hospital:"执业医院执业医院执业医院执业医院执业医院",
          createTime:null,
          authenticationTime:null,
          authenticationStatus:2,
          authenticationRefuseReason:null,
          roleName:"医生角色"
        },

        searchParams: {
          currentPage: 1,//页码
          pageSize: 10,//
          startTime: null,
          endTime: null,
          institutionId: "",//机构id
          authenticationStatus: null,
          name: null
        },

        rangeTime:"",//开始时间和结束时间
        nowDate: '',
      }
    },


    methods:{

      _doSearch(){
        console.log(this.searchParams)
        console.log(this.rangeTime)
      },

      //点击查看
      _checkDetail(item){
        //this.doctorInfo=item;
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

      },


      //同意申请
      agreeApply: function (uid) {

        this.$confirm('确定同意申请吗？')
          .then(_ => {

            this.isShowDialog=false

          })
          .catch(_ => {

          });


        /*confirm("确定同意申请吗？", function () {
          var parms = {
            insDoctorId: uid,
            status: 2
          };
          $.ajax({
            type: "post",
            url: baseURL+"sys/doctorApply/changeDoctorStatus",
            data: parms,
            dataType: "json",
            success: function (res) {
              if (res.code === 1) {
                alert(res.msg,function () {
                  vm.showStatus = 1;
                  vm.searchParams.authenticationStatus = null;
                  vm._getDatalist();
                })
              } else {
                alert(res.msg);
              }
            }
          })
        })*/
      },

      //拒绝申请
      refuseApply: function (uid) {

        this.refuse.isShowDialog=true;
        /*layer.prompt({
          formType: 2,
          //value: '',
          title: '请填写拒绝理由',
          area: ['400px', '200px'] //自定义文本域宽高
        }, function(value, index, elem){
          if(!value){
            alert("拒绝理由不能为空");
            return
          }
          var parms = {
            insDoctorId: uid,
            status: 4,
            refuseReason: value
          };
          $.ajax({
            type: "POST",
            url: baseURL+"sys/doctorApply/changeDoctorStatus",
            dataType: "json",
            data:parms,
            success: function(res){
              if(res.code === 1){
                alert(res.msg,function () {
                  vm.showStatus = 1;
                  vm.searchParams.authenticationStatus = null;
                  vm._getDatalist();
                });

              }else{
                alert(res.msg);
              }
            }
          });
          layer.close(index);
        });*/
      },


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

  .el-textarea{margin-bottom: 25px}


</style>
