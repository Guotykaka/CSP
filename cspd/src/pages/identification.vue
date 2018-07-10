<template>
  <div class="identification">
    <!--<header-top></header-top>-->
    <div class="page-wrapper" v-cloak>
      <!--//展示信息与认证状态-->
      <div v-show="!isWritingAuthorization">
        <div class="title-msg">
          基础信息
        </div>
        <div class="main-msg"></div>
        <!--//未认证-->
        <div class="common-padding-20" v-if="authenticationStatus == 0">
          <div class="no-apply">
            <strong class="note">姓名：</strong>
            <span class="note-text">{{doctorName}}</span>
            <strong class="note">平台角色：</strong>
            <span class="note-text">{{roleTypeName}}</span>
          </div>
          <div class="common-panel no-apply-panel">
            <p class="apply-title">
              <i class="iconfont icon-ts status-icon notice-icon"></i>请完善个人信息，并认证您的身份！
            </p>
            <p class="notice-text" style="margin-bottom: 10px">如有问题，请咨询400-820-2830</p>
            <div class="btn-bar">
              <span class="btn btn-sm btn-warning" @click="startWritingAuthorization">去认证</span>
            </div>

          </div>
        </div>
        <!--//认证中-->
        <div class="common-padding-20" v-if="authenticationStatus == 1">
          <div class="common-panel applying">
            <p class="apply-title">
              <i class="iconfont icon-ts status-icon notice-icon"></i>认证申请中！
            </p>
            <p class="notice-text" style="margin-bottom: 10px">如有问题，请咨询400-820-2830</p>
            <div class="btn-bar">
              <span class="post-btn" @click="cancelApply">取消认证</span>
              <!-- <span class="submit-btn" @click="startWritingAuthorization">重新认证</span>-->
            </div>
          </div>
        </div>
        <!--//已认证-->
        <div class="common-padding-20" v-if="authenticationStatus == 2">
          <div class="apply-success common-panel">
            <p class="apply-title">
              <i class="iconfont icon-d status-icon success-icon"></i>已认证成功！
            </p>
            <p class="notice-text">身份信息已审核通过</p>
          </div>
        </div>
        <!--//已取消-->
        <div class="common-padding-20" v-if="authenticationStatus == 3">
          <div class="apply-success common-panel">
            <p class="apply-title">
              <i class="iconfont icon-d status-icon success-icon"></i>已取消认证！
            </p>
            <p class="notice-text" style="margin-bottom: 10px">您已取消认证！如有疑问，请联系审核人员或者拨打客服电话400-820-2830.</p>

            <div class="btn-bar">
              <span class="submit-btn" @click="startWritingAuthorization">重新认证</span>
            </div>
          </div>
        </div>
        <!--//已拒绝-->
        <div class="common-padding-20" v-if="authenticationStatus == 4">
          <div class="common-panel applying">
            <p class="apply-title">
              <i class="iconfont icon-close status-icon error-icon"></i>已拒绝！
            </p>
            <p class="notice-text" style="margin-bottom: 10px">失败原因：{{authenticationRefuseReason}}</p>
            <div class="btn-bar">
              <span class="submit-btn" @click="startWritingAuthorization">重新提交</span>
            </div>
          </div>
        </div>
        <!--认证信息展示-->
        <div style="position:relative;"
             v-show="authenticationStatus == 1 || authenticationStatus == 2 || authenticationStatus == 4">
          <div class="logo-part">
            <div class="logo-img-wrapper">
              <img :src="doctorAuthenticationInfo.logoUrl" class="logo-img"/>
            </div>
            <p style="text-align: center">
              <strong>logo</strong>
            </p>

          </div>

          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">姓名：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorName}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">职称：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.positionalTitles}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">职业证号：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.professionalCertificateCode}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">科室：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.department}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">擅长：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.specialty}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">简介：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.remarks}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">学术研究成果获奖报告：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.winningDesc}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">医生从业资格证：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <div class="upload-img-wrapper">
                <div class="upload-img">
                  <img :src="doctorAuthenticationInfo.doctorJobCertificateUrl" class="certificateImg"/>
                </div>
              </div>
              <strong class="item-note">职称证书：</strong>
              <div class="upload-img-wrapper">
                <div class="upload-img">
                  <img :src="doctorAuthenticationInfo.titleCertificateUrl" class="certificateImg"/>
                </div>
              </div>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">推荐理由：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.recommendReason}}</p>
            </div>
          </div>
          <div class="layui-row">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
              <div style="padding-right: 15px;text-align: right">
                <strong class="note-text">执业医院：</strong>
              </div>
            </div>
            <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
              <p class="show-text">{{doctorAuthenticationInfo.hospital}}</p>
            </div>
          </div>
        </div>
      </div>

      <!--//填写信息-->
      <div v-show="isWritingAuthorization" class="panel panel-default sel-panel">
        <div class="logo-part">
          <div class="logo-img-wrapper">
            <input type="file" id="doctorHeaderImgUrl" class="logo-file" @change="uploadDoctorHeaderImg()"/>
            <img v-if="!doctorHeaderImgUrl" src="../asset/img/default-avatar.png"
                 class="logoUrl"/>
            <img :src="doctorHeaderImgUrl" id="doctorHeaderImg" class="logo-img" @click="openHeaderFile"/>
          </div>
          <p class="img-notice-text"> 请上传您的头像来提现您的专业性，800Kb以内(必选)</p>
        </div>
        <p class="intro-text">注：带<span style="color: red;">*</span>为必填项</p>

        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">姓名：</strong>
            </div>
          </div>
          <p class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group show-text">{{doctorName}}</p>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">职称：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5">
              <input type="text" placeholder="请输入职称" class="form-control" v-model="positionalTitles">
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">职业证号：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5">
              <input type="text" placeholder="请输入职业证号" class="form-control" v-model="professionalCertificateCode">
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">科室：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg3 layui-col-md4 layui-col-sm5">
              <input type="text" placeholder="请输入科室" class="form-control" v-model="department">
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">擅长：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg5 layui-col-md7 layui-col-sm7">
              <textarea placeholder="请输入擅长" class="form-control textarea-input" rows="4" v-model="specialty"></textarea>
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">简介：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg5 layui-col-md7 layui-col-sm7">
              <textarea placeholder="请输入简介" class="form-control textarea-input" rows="4" v-model="remarks"></textarea>
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">学术研究成果获奖报告：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg5 layui-col-md7 layui-col-sm7">
              <textarea placeholder="简单描述下您的学术研究成果" class="form-control textarea-input" rows="4"
                        v-model="winningDesc"></textarea>
            </div>
            <span class="need-val-tip">*</span>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">医生从业资格证：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="upload-img-wrapper">
              <div class="upload-img">
                <input type="file" id="doctorJobCertificateImgUrl" class="upload-file"
                       @change="uploadDoctorJobCertificateImg()"/>
                <img v-if="!doctorJobCertificateImgUrl" src="../asset/img/add-icon.png"
                     class="zhiyezhengUrl"/>
                <img :src="doctorJobCertificateImgUrl" id="doctorJobCertificateImg" class="certificateImg"
                     @click="openJobCertificateFile"/>
              </div>
              <p class="img-notice-text"> 请上传您的从业资格证，800Kb以内(选填)</p>
            </div>

            <strong class="item-note">职称证书：</strong>

            <div class="upload-img-wrapper">
              <div class="upload-img">
                <input type="file" id="titleCertificateImgUrl" class="upload-file"
                       @change="uploadTitleCertificateImg()"/>
                <img v-if="!titleCertificateImgUrl" src="../asset/img/add-icon.png"
                     class="zhiyezhengUrl"/>
                <img :src="titleCertificateImgUrl" id="titleCertificateImg" class="certificateImg"
                     @click="openTitleCertificateFile"/>
              </div>
              <p class="img-notice-text"> 请上传您的职称证书，800Kb以内(选填)</p>

            </div>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">推荐理由：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg5 layui-col-md7 layui-col-sm7">
              <input placeholder="请输入" class="form-control" v-model="recommendReason">
            </div>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
            <div style="padding-right: 15px;text-align: right">
              <strong class="note-text">执业医院：</strong>
            </div>
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <div class="layui-col-lg5 layui-col-md7 layui-col-sm7">
              <input placeholder="请输入" class="form-control" v-model="hospital">
            </div>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-lg3 layui-col-md4 layui-col-sm5 form-group">
          </div>
          <div class="layui-col-lg9 layui-col-md8 layui-col-sm7 form-group">
            <input type="button" class="btn btn-primary" @click="submitDoctorInfo" value="提交认证"/>&nbsp;&nbsp;
            <input type="button" class="btn btn-warning" @click="cancelAuthenticate" value="取消"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from "@/components/headTop.vue"
  import {storeManager} from "@/api/util"
  export default {
    components: {
      headerTop,
    },
    data(){
      return{
        isAuthorization: true,//是否认证
        isWritingAuthorization: false,//是否处于填写信息阶段
        authenticationStatus: null,//认证状态
        doctorName: null,//姓名
        professionalCertificateCode: null,//职业证号
        positionalTitles: null,//职称
        winningDesc: null,//获奖描述
        hospital: null,//执业医院
        recommendReason: null,//推荐理由
        specialty: null,//擅长
        remarks: null,//简介
        department: null,//科室
        uploadImgId: null,//确定照片上传的id
        doctorHeaderImgUrl: null,//医生头像url
        doctorJobCertificateImgUrl: null,//医生从业资格证Url
        titleCertificateImgUrl: null,//职称证书url
        insDoctorInfoId: null,
        insDoctorId: null,
        title: null,
        showList:true,
        authenticationRefuseReason:null,//拒绝理由
        doctorAuthenticationInfo:{}
      }
    },
    created(){
      this.doctorName = storeManager.getDoctorName();
      this.insDoctorId = storeManager.getInsDoctorId();
      //如果已填写认证消息  获取认证信息
      // this.authenticationStatus=storeManager.getAuthenticationStatus();
      if(this.authenticationStatus !=0){
        this.queryDoctorAuthentication(this.insDoctorId);
      }
      //注册上传的方法
      this.registerUploadCallback();
      console.log(storeManager.getRoleType())
      console.log(typeof storeManager.getRoleType())
    },
    methods:{
      // 取消填写
      cancelAuthenticate: function () {
        this.isWritingAuthorization=false;
      },
      //取消认证
      cancelApply:function () {
        confirm("确定要取消认证吗?",function () {
          //这个没走接口，增加
          var params={
            insDoctorId: storeManager.getInsDoctorId(),
            status:3
          };
/*          $.ajax({
            type: "POST",
            url:  baseURL + "changeDoctorStatus",
            data: params,
            dataType: "json",
            success: function(res){
              if(res.code === 1){
                //存认证状态 更新认证状态
                storeManager.setAuthenticationStatus(res.data.authenticationStatus);
                vm.authenticationStatus=res.data.authenticationStatus;
                vm.doctorAuthenticationInfo = res.data;
                alert(res.msg)
              }else{
                alert(res.msg)
              }
            }
          });*/
        })
      },
      //医生提交审核资料
      submitDoctorInfo: function () {
        var url = "submitDoctorInfo";
        var params = {
          insDoctorInfoId: null,
          insDoctorId: vm.insDoctorId,
          name: vm.doctorName,
          professionalCertificateCode: vm.professionalCertificateCode,
          positionalTitles: vm.positionalTitles,
          department: vm.department,
          specialty: vm.specialty,
          remarks: vm.remarks,
          winningDesc: vm.winningDesc,
          logoUrl: vm.doctorHeaderImgUrl,
          doctorJobCertificateUrl: vm.doctorJobCertificateImgUrl,
          titleCertificateUrl: vm.titleCertificateImgUrl,
          recommendReason: vm.recommendReason,
          hospital: vm.hospital
        };

        if(!params.positionalTitles){
          alert("职称不能为空");
          return;
        }else if(!params.logoUrl){
          alert("头像不能为空");
          return;
        }else if(!params.professionalCertificateCode){
          alert("职称号不能为空");
          return;
        }else if(!params.department){
          alert("科室不能为空");
          return;
        }else if(!params.specialty){
          alert("擅长不能为空");
          return;
        }else if(!params.remarks){
          alert("简介不能为空");
          return;
        }else if(!params.winningDesc){
          alert("学术研究成果获奖报告不能为空");
          return;
        }
/*        $.ajax({
          type: "POST",
          url: baseURL + url,
          contentType: "application/json",
          data: JSON.stringify(params),
          success: function(res){
            if(res.code === 1){
              //存最新认证状态 并更新
              storeManager.setAuthenticationStatus(res.data.authenticationStatus);
              vm.authenticationStatus=res.data.authenticationStatus;
              vm.isWritingAuthorization=false;
              vm.doctorAuthenticationInfo = res.data;
              alert('提交成功，等待管理员审核');
            }else{
              alert(res.msg);
            }
          }
        });*/
      },
      //查询医生审核资料详情
      queryDoctorAuthentication: function (insDoctorId) {
        var params = {
          insDoctorId: insDoctorId
        };
/*        $.ajax({
          type: "POST",
          url:  baseURL + "queryDoctorApplyInfo",
          data: params,
          dataType: "json",
          success: function(res){
            if(res.code === 1){
              //存最新认证状态 并更新
              storeManager.setAuthenticationStatus(res.data.authenticationStatus);
              storeManager.setAvatar(res.data.logoUrl);
              vm.authenticationStatus=res.data.authenticationStatus;
              vm.positionalTitles=res.data.positionalTitles;//职称
              vm.professionalCertificateCode=res.data.professionalCertificateCode;//职业证号
              vm.department=res.data.department;//科室
              vm.specialty=res.data.specialty;//擅长
              vm.remarks=res.data.remarks;//简介
              vm.winningDesc=res.data.winningDesc;//报告
              vm.doctorJobCertificateImgUrl=res.data.doctorJobCertificateUrl;//资格证
              vm.titleCertificateImgUrl=res.data.titleCertificateUrl;//职称证书
              vm.doctorHeaderImgUrl=res.data.logoUrl;//头像
              vm.recommendReason=res.data.recommendReason;//推荐理由
              vm.hospital=res.data.hospital;//执业医院
              vm.authenticationRefuseReason=res.data.authenticationRefuseReason;//拒绝理由

              //显示数据
              vm.doctorAuthenticationInfo = res.data;
            }else{
              alert(res.msg);
            }
          }
        });*/
      },
      //填写认证信息
      startWritingAuthorization() {
        this.isWritingAuthorization = true;
      },
      openHeaderFile() {
        // $('#doctorHeaderImgUrl').click();
      },
      openJobCertificateFile: function () {
        // $('#doctorJobCertificateImgUrl').click();
      },
      openTitleCertificateFile: function () {
        // $('#titleCertificateImgUrl').click();
      },
      //上传医生头像
      uploadDoctorHeaderImg: function () {
/*        vm.uploadImgId = "doctorHeaderImgUrl";
        btnImage = $('#doctorHeaderImgUrl')[0].files[0];
        if(!btnImage){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        var size = btnImage.size / 1024,
          ext = {},
          extName = btnImage.name.split('.').pop();
        if(ext[extName]){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        if (size > 800) {
          alert('请上传800kb以内图片');
          return ;
        }
        var filePath = upYunConstData.ComboConfig.ComboBaseUrl + '/' + randomString(32) + '.' + extName,
          instance = new Sand({
            bucket: upYunConstData.ComboConfig.bucket,
            expiration: parseInt((new Date().getTime() + 3600000) / 1000),
            form_api_secret: upYunConstData.ComboConfig.form_api_secret
          });
        instance.upload(filePath, '#doctorHeaderImgUrl');*/
      },
      //上传医生从业资格证
      uploadDoctorJobCertificateImg: function () {
/*        this.uploadImgId = "doctorJobCertificateImgUrl";
        btnImage = $('#doctorJobCertificateImgUrl')[0].files[0];
        if(!btnImage){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        var size = btnImage.size / 1024,
          ext = {},
          extName = btnImage.name.split('.').pop();
        if(ext[extName]){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        if (size > 800) {
          alert('请上传800kb以内图片');
          return ;
        }
        var filePath = upYunConstData.ComboConfig.ComboBaseUrl + '/' + randomString(32) + '.' + extName,
          instance = new Sand({
            bucket: upYunConstData.ComboConfig.bucket,
            expiration: parseInt((new Date().getTime() + 3600000) / 1000),
            form_api_secret: upYunConstData.ComboConfig.form_api_secret
          });
        instance.upload(filePath, '#doctorJobCertificateImgUrl');*/
      },
      //上传医生职称证书
      uploadTitleCertificateImg: function () {
       /* vm.uploadImgId = "titleCertificateImgUrl";
        btnImage = $('#titleCertificateImgUrl')[0].files[0];
        if(!btnImage){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        var size = btnImage.size / 1024,
          ext = {},
          extName = btnImage.name.split('.').pop();
        if(ext[extName]){
          util.showFade('请选择您要上传的图片！');
          return;
        }
        if (size > 800) {
          alert('请上传800kb以内图片');
          return ;
        }
        var filePath = upYunConstData.ComboConfig.ComboBaseUrl + '/' + randomString(32) + '.' + extName,
          instance = new Sand({
            bucket: upYunConstData.ComboConfig.bucket,
            expiration: parseInt((new Date().getTime() + 3600000) / 1000),
            form_api_secret: upYunConstData.ComboConfig.form_api_secret
          });
        instance.upload(filePath, '#titleCertificateImgUrl');*/
      },
      //上传医生头像成功回调
      OnAdUploadDoctorHeaderImageCallBack: function(data) {
/*        vm.doctorHeaderImgUrl = upYunConstData.ComboConfig.ComboBaseUrl + data['path'];
        $('#doctorHeaderImg').attr('src', vm.doctorHeaderImgUrl);*/
      },
      //上传医生从业资格证成功回调
      OnAdUploadDoctorJobCertificateImgCallBack: function(data) {
/*        vm.doctorJobCertificateImgUrl = upYunConstData.ComboConfig.ComboBaseUrl + data['path'];
        $('#doctorJobCertificateImg').attr('src', vm.doctorJobCertificateImgUrl);*/
      },
      //上传医生职称证书成功回调
      OnAdUploadTitleCertificateImgCallBack: function(data) {
/*        vm.titleCertificateImgUrl = upYunConstData.ComboConfig.ComboBaseUrl + data['path'];
        $('#titleCertificateImg').attr('src', vm.titleCertificateImgUrl);*/
      },

      //注册上传成功回调
      registerUploadCallback: function () {
        document.addEventListener('uploaded', function(e){
          if(vm.uploadImgId == 'doctorHeaderImgUrl'){
            //医生头像
            vm.OnAdUploadDoctorHeaderImageCallBack(e.detail);
          }else if (vm.uploadImgId == 'doctorJobCertificateImgUrl') {
            //医生从业资格证
            vm.OnAdUploadDoctorJobCertificateImgCallBack(e.detail);
          }else if (vm.uploadImgId == 'titleCertificateImgUrl') {
            //医生职称证书
            vm.OnAdUploadTitleCertificateImgCallBack(e.detail);
          }
        });
      }
    },
    computed:{
      roleTypeName:function () {
        return parseInt(storeManager.getRoleType())===1 ? "医生" : "医生主任";
      }
    }
  }
</script>

<style scoped lang="less">
  .identification {
    line-height:32px;
    .title-msg {
      font-size: 20px;
      border-bottom: 1px solid #9F9F9F;
      padding-bottom: 13px;
      margin-left: 25px;
    }
    .main-msg {
      width: 100px;
      height: 3px;
      background-color: #2186f6;
      margin: -2px 15px;
    }
    .common-padding-20 {
      padding: 50px 20px 20px;
      .common-panel {
        padding: 20px;
      }
      /*认证中*/
      .applying {
        border: #fbe9c5 2px solid;
        border-radius: 3px;
        background-color: #fff9ed;
      }
      /*已取消*/
      .apply-success {
        border: #dbf0d1 2px solid;
        border-radius: 3px;
        background-color: #edf8e8;
      }
      /*未认证*/
      .no-apply-panel {
        border: #fbe9c5 2px solid;
        border-radius: 3px;
        background-color: #fff9ed;
      }
      .apply-title {
        font-size: 16px;
        line-height: 28px;
        color: #666;
        vertical-align: top;
        margin-bottom: 20px;
      }
      .status-icon {
        margin-right: 20px;
        font-size: 28px;
        vertical-align: top;
        display: inline-block
      }
      .notice-text {
        padding-left: 48px;
        color: #999;
        line-height: 24px;
        font-size: 14px;
      }
      .success-icon {
        color: #4eb037;
      }

      .notice-icon {
        color: #f9d076;
      }

      .error-icon {
        color: #fa6a4f;
      }

    }
  }

  .btn-bar {
    line-height: 28px;
    height: 28px;
    padding-left: 38px;
    .post-btn {
      display: inline-block;
      color: #f76a4f;
      font-size: 16px;
      padding: 0 10px;
      cursor: pointer
    }
    .submit-btn {
      display: inline-block;
      color: #51b136;
      font-size: 16px;
      padding: 0 10px;
      cursor: pointer
    }
  }

  .no-apply {
    line-height: 28px;
    margin-bottom: 20px;
    .note-text {
      padding-right: 30px;
    }
  }

  .textarea-input {
    resize: none
  }

  .sel-panel {
    padding: 20px 0;
    position: relative
  }

  .logo-part {
    position: absolute;
    left: 50px;
    top: 30px;
    width: 90px;
    z-index: 10;
  }

  .logo-img-wrapper {
    width: 90px;
    height: 90px;
    position: relative;
    margin-bottom: 15px;
  }

  .logo-file {
    width: 90px;
    height: 90px;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20
  }

  .logo-img {
    width: 90px;
    height: 90px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    z-index: 10
  }

  .logoUrl {
    width: 90px;
    height: 90px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    z-index: 1
  }

  .intro-text {
    position: absolute;
    right: 50px;
    top: 30px;
    z-index: 10;
  }

  .img-notice-text {
    line-height: 18px;
    font-size: 12px;
    color: #999;
  }

  .note-text {
    font-size: 14px;
    line-height: 24px;
    padding-top: 5px;
    display: inline-block;
    color: #444
  }

  .show-text {
    line-height: 24px;
    color: #666;
    font-size: 14px;
    padding: 5px 20px 5px 0;
    word-break: break-all
  }

  .need-val-tip {
    color: red;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
    padding: 5px 0 0 10px;
  }

  .upload-img-wrapper {
    float: left;
    width: 85px;
  }

  .upload-img {
    position: relative;
    width: 85px;
    height: 85px;
    margin-bottom: 10px;
  }

  .upload-file {
    position: absolute;
    width: 85px;
    height: 85px;
    left: 0;
    top: 0;
    z-index: 20;
    opacity: 0
  }

  .certificateImg {
    position: absolute;
    width: 85px;
    height: 85px;
    left: 0;
    top: 0;
    z-index: 10
  }

  .zhiyezhengUrl {
    position: absolute;
    width: 85px;
    height: 85px;
    left: 0;
    top: 0;
    z-index: 1
  }

  .item-note {
    float: left;
    width: 120px;
    line-height: 24px;
    padding-top: 5px;
    text-align: right;
    font-size: 14px;
    color: #444
  }
</style>
