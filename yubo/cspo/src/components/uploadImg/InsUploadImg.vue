<template>
  <div class="upload-img">
    <div v-if="imageSrc">
      <div v-if="showImgRan">
        <img :src="imageSrc+'?random='+imageTime" class="img" :name="imageTime"/>
      </div>
      <div id="second"
           v-loading="!showImgRan"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(64, 158, 255, 0.7)">
      </div>
    </div>
    <div class="upload-btn" v-if="!imageSrc">
      <i class="el-icon-plus add-icon"></i>
    </div>
    <input v-if="showImgRan" type="file" id="up-file" class="up-file" @change="onUpload"/>
  </div>
</template>

<script>
  import {b64hamcsha1, HexMD5, MD5} from '@/api/hash';
  import {save_img_key} from "@/config/env.js";
  import {IsAlert} from '@/config/mUtils.js';

  export default {
    name: 'InsUploadImg',
    props: {
      imageSrc: {
        type: String,
        default: ''
      },
      imgKey: {
        type: String,
        default: save_img_key
      },
      urlName: {
        type: String,
        default: ''
      },
      btnType: {
        type: String,
        default: 'pngJpg'
      },
      imageHeight:{
        type:String,
        default:''
      },
      imageWidth:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        showImg: Math.random(),
        showImgRan: true,
        imageTime:Date.parse(new Date()),
        imgWidth:'',
        imgHeihgt:''
      }
    },
    watch: {
      imageTime(v,o) {
        this.refreshImg();
      }
    },
    methods: {
      async onUpload(e) {
        let daate;
        let that = this;
        if (this.urlName === 'bg_' || this.urlName === 'logo_') {
          IsAlert('请填写机构编号','提示','warning');
          return;
        }
        daate = this.urlName;
        if (!this.urlName) {
          daate = Date.parse(new Date())
        }
        let bucketname = "zhangshangtijian"; //服务名
        let username = "hztest";	  //操作员账号
        let password = "a1234567";     //操作员密码
        let save_key = this.imgKey + daate + "{.suffix}";
        let url = "http://v0.api.upyun.com/" + bucketname;
        let fileContent = e.target.files[0];
        if (!fileContent) {
          return
        }
        const isJPG = fileContent.type === 'image/jpeg';
        const isPNG = fileContent.type === 'image/png';
        const isJPGPNG = (fileContent.type === 'image/jpeg') || (fileContent.type === 'image/png');
        const isLt2M = fileContent.size / 1024 / 1024 < 2;
        var reader = new FileReader();
        reader.readAsDataURL(fileContent);
        if (this.btnType === 'PNG' && !isPNG) {
          IsAlert('图片格式只能为PNG','提示','warning');
          return;
        }
        if (this.btnType === 'JPEG' && !isJPG) {
          IsAlert('图片格式只能为JPEG','提示','warning');
          return;
        }
        if (this.btnType === 'pngJpg' && !isJPGPNG) {
          IsAlert('图片格式只能为JPEG 或者 PNG','提示','warning');
          return;
        }
        if (!isLt2M) {
          IsAlert('图片大小不能大于2M','提示','warning');
          return;
        }
        let policy = btoa(JSON.stringify({
          "bucket": bucketname,
          "save-key": save_key,
          "expiration": parseInt(Date.parse(new Date()) + 3600)
        }));
        let signature = "UPYUN " + username + ":" + b64hamcsha1(HexMD5.MD5(password).toString(HexMD5.enc.Hex), "POST&/" + bucketname + "&" + policy);
        let formData = new FormData();
        formData.append("file", fileContent);
        formData.append("policy", policy);
        formData.append("authorization", signature);
        this.upLoadImgFun(url,formData)
/*        reader.onload = function(theFile) {
          var image = new Image();
          image.src = theFile.target.result;
          image.onload = function() {
            if(this.width===(+that.imageWidth)&&this.height===(+that.imageHeight)){
              console.log(formData)
              console.log(fileContent)
              that.upLoadImgFun(url,formData)
            }else{
              IsAlert(`图片大小不对,请上传${that.imageWidth}X${that.imageHeight}尺寸图片`,'提示','warning');
            }
          };
        };*/
      },
      upLoadImgFun(url, formData){
        this.$http.post(url, formData).then(res => {
          this.$emit('emitSuccess', res)
          this.imageTime = res.data.time
        }).catch(error => {
          this.$emit('emitError', error)
          this.imageTime = Date.parse(new Date())
        })
      },
      /*刷新图片*/
      refreshImg(){
        let that = this;
        that.showImgRan = false;
        setTimeout(function () {
          that.showImgRan = true;
        }, 1500)
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-img {
    width: 100px;
    height: 100px;
    position: relative;
  }

  .up-file {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    opacity: 0;
    cursor: pointer
  }

  .upload-btn {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }

  .img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  #second {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .add-icon {
    font-size: 30px;
    color: #8c939d;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
  }
</style>

