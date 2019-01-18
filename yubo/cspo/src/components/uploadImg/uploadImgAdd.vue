<template>
  <div class="upload-img">
    <img :src="imageSrc" v-if="imageSrc" class="img"/>
    <div class="upload-btn" v-if="!imageSrc">
      <i class="el-icon-plus add-icon"></i>
    </div>
    <input type="file" id="up-file" class="up-file" @change="onUpload"/>
  </div>
</template>

<script>
  import {b64hamcsha1, HexMD5, MD5 } from '@/api/hash';
  import {save_img_key} from "@/config/env.js";
  import {IsAlert} from '@/config/mUtils.js';

  export default {
    props:{
      imageSrc:{
        type:String,
        default:''
      }
    },
    methods:{
      onUpload(e){
        let daate = Date.parse(new Date());
        let bucketname="zhangshangtijian"; //服务名
        let username="hztest";	  //操作员账号
        let password="a1234567";     //操作员密码
        // let save_key=save_img_key;
        let save_key=save_img_key+""+daate+"{.suffix}";
        let url="http://v0.api.upyun.com/"+bucketname;
        let fileContent=e.target.files[0];
        if(!fileContent){
          return
        }
        const isJPG = (fileContent.type === 'image/jpeg') || (fileContent.type === 'image/png');
        const isLt2M = fileContent.size / 1024 / 1024 < 2;
        if(!isJPG){
          IsAlert('图片格式只能为JPEG 或者 PNG','提示','warning');
          return;
        }
        if (!isLt2M) {
          IsAlert('图片大小不能大于2M','提示','warning');
          return;
        }
        let policy=btoa(JSON.stringify({"bucket": bucketname, "save-key": save_key,"expiration": parseInt(Date.parse(new Date())+3600)}));
        let signature="UPYUN "+username+":"+b64hamcsha1(HexMD5.MD5(password).toString(HexMD5.enc.Hex), "POST&/"+bucketname+"&"+policy);
        let formData=new FormData();
        formData.append("file",fileContent);
        formData.append("policy",policy);
        formData.append("authorization",signature);
        this.$http.post(url, formData).then(res => {
          this.$emit('emitSuccess', res)
        }).catch(error =>{
          this.$emit('emitError', res)
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .upload-img{width: 100px;height: 100px;position: relative;}
  .up-file{position: absolute;left: 0;top:0;width: 100%;height: 100%;z-index: 100;opacity: 0;cursor: pointer}
  .upload-btn{position: absolute;left: 0;top:0;width: 100%;height: 100%;z-index: 1;border: 1px dashed #d9d9d9;border-radius: 6px;}
  .img{position: absolute;left: 0;top:0;width: 100%;height: 100%;z-index: 1;}
  .add-icon{font-size: 30px;color:#8c939d;position: absolute;left: 50%;top:50%;transform: translate(-50%,-50%)}
</style>

