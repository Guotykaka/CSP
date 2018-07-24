<template>


  <div class="apply-wrapper">

    <!--操作认证-->
    <div class="apply-box" v-if="authenticationStatus==='0' || authenticationStatus==='3' || authenticationStatus==='4'">

      <el-card class="box-card" style="padding-top: 30px">
        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title isRequire">上传头像：</strong>
          </el-col>
          <el-col :span="4">
            <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              :show-file-list="false"
              :on-success="handleLogoSuccess"
              :before-upload="beforeLogoUpload">
              <img v-if="apply.logoUrl" :src="apply.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">姓名：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{apply.name}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">职称：</strong>
          </el-col>
          <el-col :span="6">
            <el-input v-model="apply.positionalTitles" placeholder="请输入职称"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">职业证号：</strong>
          </el-col>
          <el-col :span="6">
            <el-input v-model="apply.professionalCertificateCode" placeholder="请输入职业证号"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">科室：</strong>
          </el-col>
          <el-col :span="6">
            <el-input v-model="apply.department" placeholder="请输入科室"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">擅长：</strong>
          </el-col>
          <el-col :span="9">
            <el-input type="textarea" :rows="3" v-model="apply.specialty" placeholder="请输入擅长"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">简介：</strong>
          </el-col>
          <el-col :span="9">
            <el-input type="textarea" :rows="3" v-model="apply.remarks" placeholder="请输入简介"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">学术研究成果获奖报告：</strong>
          </el-col>
          <el-col :span="9">
            <el-input type="textarea" :rows="3" v-model="apply.winningDesc" placeholder="简单描述您的学术研究成果"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">医生从业资格证：</strong>
          </el-col>
          <el-col :span="4">
            <el-upload
              class="avatar-uploader"
              :action=uploadImgUrl
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload1">
              <img v-if="apply.doctorJobCertificateUrl" :src="apply.doctorJobCertificateUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="4" class="list-note">
            <strong class="list-title">职称证书：</strong>
          </el-col>
          <el-col :span="4">
            <el-upload
              class="avatar-uploader"
              :action=uploadImgUrl
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload2">
              <img v-if="apply.titleCertificateUrl" :src="apply.titleCertificateUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">推荐理由：</strong>
          </el-col>
          <el-col :span="6">
            <el-input v-model="apply.recommendReason" placeholder="请输入"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">执业医院：</strong>
          </el-col>
          <el-col :span="6">
            <el-input v-model="apply.hospital" placeholder="请输入"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note"> &nbsp;</el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="submitDoctorInfoFn">提交认证</el-button>
            <el-button type="warning" size="small" @click="doBack">返回</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!--认证信息-->
    <div class="apply-box" v-if="authenticationStatus==='1' || authenticationStatus==='2'">
      <el-card class="box-card" style="padding-top: 30px">
        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title isRequire">上传头像：</strong>
          </el-col>
          <el-col :span="4">
              <img :src="write.logoUrl" class="avatar">
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">姓名：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.name}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">职称：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.positionalTitles}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">职业证号：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.professionalCertificateCode}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">科室：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.department}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">擅长：</strong>
          </el-col>
          <el-col :span="9">
            <p class="writeText">{{write.specialty}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">简介：</strong>
          </el-col>
          <el-col :span="9">
            <p class="writeText">{{write.remarks}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">学术研究成果获奖报告：</strong>
          </el-col>
          <el-col :span="9">
            <p class="writeText">{{write.winningDesc}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">医生从业资格证：</strong>
          </el-col>
          <el-col :span="4">
            <img :src="write.doctorJobCertificateUrl" class="avatar">
          </el-col>
          <el-col :span="4" class="list-note">
            <strong class="list-title">职称证书：</strong>
          </el-col>
          <el-col :span="4">
            <img :src="write.titleCertificateUrl" class="avatar">
          </el-col>
        </el-row>
        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">推荐理由：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.recommendReason}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note">
            <strong class="list-title">执业医院：</strong>
          </el-col>
          <el-col :span="6">
            <p class="writeText">{{write.hospital}}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="self-row">
          <el-col :span="6" class="list-note"> &nbsp;</el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="doBack">返回</el-button>
            <el-button type="primary" size="small" @click="cancelApplyFn" v-if="authenticationStatus==='1'">取消认证</el-button>
          </el-col>
        </el-row>

      </el-card>


    </div>
  </div>

</template>
<script>
  import {ERR_OK,submitDoctorInfo,getApplyInfo,cancelApply} from '@/api/api';
  import {getStore,setStore} from "@/config/mUtils.js";
  import {API_UPLOAD} from '@/config/env.js';

  export default {
    data() {
      return {
        uploadImgUrl:API_UPLOAD,
        Loading:"",
        authenticationStatus:getStore("authenticationStatus"),
        apply:{
          department: "",//科室
          doctorJobCertificateUrl: "",//从业资格证图片
          hospital: "",//职业医院
          insDoctorId:"",
          insDoctorInfoId:null,
          logoUrl: "",
          name: JSON.parse(getStore("userMesage")).userName,
          positionalTitles: "",//职称
          professionalCertificateCode: "",//职业证号
          recommendReason: "",//推荐理由
          remarks: "",//简介
          specialty: "",//擅长
          titleCertificateUrl: "",//职称证书图片
          winningDesc: "" ,//研究成果
        },
        write:{
          department: "",//科室
          doctorJobCertificateUrl: "hh",//从业资格证图片
          hospital: "",//职业医院
          insDoctorId:"",
          logoUrl: "111",
          name: JSON.parse(getStore("userMesage")).userName,
          positionalTitles: "",//职称
          professionalCertificateCode: "",//职业证号
          recommendReason: "",//推荐理由
          remarks: "",//简介
          specialty: "",//擅长
          titleCertificateUrl: "hhh",//职称证书图片
          winningDesc: "" ,//研究成果
        }
      }
    },

    methods:{
      //提交
      submitDoctorInfoFn(){
        let params={
          department:this.apply.department,//科室
          doctorJobCertificateUrl:this.apply.doctorJobCertificateUrl,//从业资格证图片
          hospital: this.apply.hospital,//职业医院
          insDoctorId:JSON.parse(getStore("userMesage")).insDoctorId,
          insDoctorInfoId:this.apply.insDoctorInfoId,
          logoUrl: this.apply.logoUrl,
          name: this.apply.name,
          positionalTitles: this.apply.positionalTitles,//职称
          professionalCertificateCode:this.apply.professionalCertificateCode,//职业证号
          recommendReason:this.apply.recommendReason,//推荐理由
          remarks: this.apply.remarks,//简介
          specialty:this.apply.specialty,//擅长
          titleCertificateUrl:this.apply.titleCertificateUrl,//职称证书图片
          winningDesc:this.apply.winningDesc,//研究成果
        };

        if(!params.positionalTitles){
          this.$alert("职称不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(params.positionalTitles.length > 10){
          this.$alert("职称不能超过10个字", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.logoUrl){
          this.$alert("头像不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.professionalCertificateCode){
          this.$alert("职业证号不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.department){
          this.$alert("科室不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(params.department.length > 10){
          this.$alert("科室不能超过10个字", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.specialty){
          this.$alert("擅长不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.remarks){
          this.$alert("简介不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }else if(!params.winningDesc){
          this.$alert("学术研究成果获奖报告不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        submitDoctorInfo(params).then(res => {
          if(res.code===ERR_OK){
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                setStore("authenticationStatus",res.data.authenticationStatus);
                this.doBack()
              }
            })
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      //取消认证
      cancelApplyFn(){
        let params={
          insDoctorId:JSON.parse(getStore("userMesage")).insDoctorId,
          status:3
        };
        cancelApply(params).then(res => {
          if(res.code===ERR_OK){
            setStore("authenticationStatus",res.data.authenticationStatus);
            this.$alert('取消成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.doBack()
              }
            });
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      //获取认证详情
      getApplyInfoFn(){
        let params={
          insDoctorId:JSON.parse(getStore("userMesage")).insDoctorId
        };
        getApplyInfo(params).then(res => {
          if(res.code===ERR_OK){
            if(res.data){
              setStore("authenticationStatus",res.data.authenticationStatus);
              this.write.department=res.data.department;
              this.write.doctorJobCertificateUrl=res.data.doctorJobCertificateUrl;
              this.write.hospital=res.data.hospital;
              this.write.logoUrl=res.data.logoUrl;
              this.write.name=res.data.name;
              this.write.positionalTitles=res.data.positionalTitles;
              this.write.professionalCertificateCode=res.data.professionalCertificateCode;
              this.write.recommendReason=res.data.recommendReason;
              this.write.remarks=res.data.remarks;
              this.write.specialty=res.data.specialty;
              this.write.titleCertificateUrl=res.data.titleCertificateUrl;
              this.write.winningDesc=res.data.winningDesc;
              if(this.authenticationStatus==='3' || this.authenticationStatus==='4'){
                this.apply.department=res.data.department;
                this.apply.doctorJobCertificateUrl=res.data.doctorJobCertificateUrl;
                this.apply.hospital=res.data.hospital;
                this.apply.logoUrl=res.data.logoUrl;
                this.apply.name=res.data.name;
                this.apply.positionalTitles=res.data.positionalTitles;
                this.apply.professionalCertificateCode=res.data.professionalCertificateCode;
                this.apply.recommendReason=res.data.recommendReason;
                this.apply.remarks=res.data.remarks;
                this.apply.specialty=res.data.specialty;
                this.apply.titleCertificateUrl=res.data.titleCertificateUrl;
                this.apply.winningDesc=res.data.winningDesc;
              }
            }
          }else{
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        }).catch(err => {
          this.$alert(err.msg, '提示', {
            confirmButtonText: '确定',
          })
        });
      },

      //返回
      doBack(){
        window.history.go(-1)
      },
      handleLogoSuccess(res) {
        this.Loading.close();
        this.apply.logoUrl=res.data.src
      },
      beforeLogoUpload(file) {
         this.Loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },


      handleAvatarSuccess1(res) {
        this.Loading.close();
        this.apply.doctorJobCertificateUrl =res.data.src;
      },
      beforeAvatarUpload1(file) {
        this.Loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      handleAvatarSuccess2(res) {
        this.Loading.close();
        this.apply.titleCertificateUrl =res.data.src;
      },
      beforeAvatarUpload2(file) {
        this.Loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    activated(){
      this.getApplyInfoFn();
      this.authenticationStatus=getStore("authenticationStatus");
    }
  }
</script>

<style lang="less">
  .avatar-uploader .el-upload {border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;}
  .avatar-uploader .el-upload:hover {border-color: #409EFF;}
  .avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 100px;height: 100px;line-height: 100px;text-align: center;}
  .avatar {width: 178px;height: 178px;display: block;}
</style>

<style lang="less" scoped>
  .list-note{text-align: right;line-height: 40px;}
  .self-row{margin-bottom: 15px;}
  .isRequire:before{content:"*";color: #f56c6c;margin-right: 4px;font-size: 14px;}
  .list-title{color:#606266;font-size: 15px;font-weight:normal}
  .avatar{width: 100px;height: 100px;}
  .writeText{line-height: 24px;font-size: 14px;padding-top: 8px;margin-bottom: 8px;}
</style>
