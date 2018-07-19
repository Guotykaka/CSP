<template>


  <div>
    <el-card class="box-card" style="padding-top: 30px">
      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title isRequire">上传头像：</strong>
        </el-col>
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            action="http://m0.api.upyun.com/zhangshangtijian/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">姓名：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="apply.name" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">职称：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="apply" placeholder="请输入职称"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">职业证号：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="professionalCertificateCode" placeholder="请输入职业证号"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">科室：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="professionalCertificateCode" placeholder="请输入科室"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">擅长：</strong>
        </el-col>
        <el-col :span="9">
          <el-input type="textarea" :rows="3" v-model="professionalCertificateCode" placeholder="请输入擅长"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">简介：</strong>
        </el-col>
        <el-col :span="9">
          <el-input type="textarea" :rows="3" v-model="professionalCertificateCode" placeholder="请输入简介"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">学术研究成果获奖报告：</strong>
        </el-col>
        <el-col :span="9">
          <el-input type="textarea" :rows="3" v-model="professionalCertificateCode" placeholder="简单描述您的学术研究成果"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">医生从业资格证：</strong>
        </el-col>
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="4" class="list-note">
          <strong class="list-title">职称证书：</strong>
        </el-col>
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">推荐理由：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="professionalCertificateCode" placeholder="请输入"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note">
          <strong class="list-title">执业医院：</strong>
        </el-col>
        <el-col :span="6">
          <el-input v-model="professionalCertificateCode" placeholder="请输入"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="self-row">
        <el-col :span="6" class="list-note"> &nbsp;</el-col>
        <el-col :span="6">
          <el-button type="primary" size="small">提交认证</el-button>
          <el-button type="warning" size="small">返回</el-button>
        </el-col>
      </el-row>

    </el-card>
  </div>

</template>
<script>

  export default {
    data() {
      return {

        apply:{
          department: "",
          doctorJobCertificateUrl: "",
          hospital: "",
          insDoctorId:"",
          insDoctorInfoId:null,
          logoUrl: "",
          name: "yuexinbbb",
          positionalTitles: "11",
          professionalCertificateCode: "11",
          recommendReason: "11",
          remarks: "11",
          specialty: "11",
          titleCertificateUrl: "",
          winningDesc: "11" ,
        }

      }
    },


    methods:{
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {

        console.log(file)


        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
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
</style>
