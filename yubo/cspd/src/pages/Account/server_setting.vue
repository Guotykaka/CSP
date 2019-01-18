<template>
  <div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="电话咨询" name="20">
      </el-tab-pane>
      <el-tab-pane label="图文咨询" name="10">
      </el-tab-pane>
    </el-tabs>

    <!--模板-->
    <div class="tab-body">
      <el-card class="box-card template-card" style="margin-bottom: 20px;">
        <div slot="header" class="clearfix">
          <strong class="card-template-title">未开通服务模板</strong>
        </div>
        <div class="card-container">
          <el-row :gutter="20">
            <el-col :xs="12" :sm="10" :md="9" :lg="7" v-for="(item,index) in templateList" :key="index">
              <div class="template-item">
                <div class="item-head">
                  <span class="name">{{item.modelName }}</span>
                  <span class="price">￥{{item.modelMinPrice }}-{{item.modelMaxPrice  }}<em class="unit">/{{item.modelUnix }}</em></span>
                </div>
                <p class="rate-bar">分成比例：平台,机构,医生---{{item.insProportions}}</p>
                <!-- <el-row :gutter="20" class="time-row">
                  <el-col :span="12">
                    <dl class="time-box">
                      <dt class="time-title">工作时间</dt>
                      <dd class="time-text">AM {{item.workdayAmFromTime}}-{{item.workdayAmToTime}}</dd>
                      <dd class="time-text">PM {{item.workdayPmFromTime}}-{{item.workdayPmToTime}}</dd>
                    </dl>
                  </el-col>
                  <el-col :span="12">
                    <dl class="time-box">
                      <dt class="time-title">非工作时间</dt>
                      <dd class="time-text">AM {{item.offdayAmFromTime}}-{{item.offdayAmToTime}}</dd>
                      <dd class="time-text">PM {{item.offdayPmFromTime}}-{{item.offdayPmToTime}}</dd>
                    </dl>
                  </el-col>
                </el-row> -->
                <div class="btn-bar">
                  <input class="template-btn " type="button" value="开通" @click="openService(item,1)">
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!--服务-->
      <el-card class="box-card service-card">
        <div slot="header" class="clearfix">
          <strong class="card-service-title">开通服务</strong>
        </div>
        <div class="card-container">
          <el-row :gutter="20" v-if="serviceList.length>0">
            <el-col :xs="12" :sm="10" :md="9" :lg="7" v-for="(item,index) in serviceList" :key="index">
              <div class="service-item">
                <div class="item-head">
                  <span class="name">{{item.productName}}</span>
                  <span class="price">￥{{item.productPrice}}<em class="unit">/{{item.productUnix }}</em></span>
                </div>
                <!-- <p class="rate-bar">分成比例：平台,机构,医生---{{item.insProportions}}</p> -->

                <!-- <el-row :gutter="20" class="time-row">
                  <el-col :span="12">
                    <dl class="time-box">
                      <dt class="time-title">工作时间</dt>
                      <dd class="time-text">AM {{item.doctorProductDTO.workdayAmFromTime}}-{{item.doctorProductDTO.workdayAmToTime}}</dd>
                      <dd class="time-text">PM {{item.doctorProductDTO.workdayPmFromTime}}-{{item.doctorProductDTO.workdayPmToTime}}</dd>
                    </dl>
                  </el-col>

                  <el-col :span="12">
                    <dl class="time-box">
                      <dt class="time-title">非工作时间</dt>
                      <dd class="time-text">AM {{item.doctorProductDTO.offdayAmFromTime}}-{{item.doctorProductDTO.offdayAmToTime}}</dd>
                      <dd class="time-text">PM {{item.doctorProductDTO.offdayPmFromTime}}-{{item.doctorProductDTO.offdayPmToTime}}</dd>
                    </dl>
                  </el-col>
                </el-row> -->
                <div class="btn-bar" v-if="item.whetherEdit">
                  <input class="upline-btn" type="button" value="上线" @click="upLineFn(item)"
                         v-if="item.productStatus===2">
                  <input class="upline-btn" type="button" value="下线" @click="downLineFn(item)"
                         v-if="item.productStatus===1">
                  <input class="editor-btn" type="button" value="编辑" @click="openService(item,2)">
                </div>
                <div class="btn-bar" v-else>
                  <el-button type="success" size="mini" disabled v-if="item.productStatus===2">上线</el-button>
                  <el-button type="success" size="mini" disabled v-if="item.productStatus===1">下线</el-button>
                  <el-button type="success" size="mini" disabled>编辑</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!--开通 编辑-->
    <el-dialog :title="serviceInfo.dialogTitle" :visible.sync="serviceInfo.isShowDialog" width="640px">
      <div class="model-content">
        <ul class="input-content">
          <li class="input-list clear_fix">
            <strong class="note">服务价格：</strong>
            <div class="note-left">
              <div class="el-input-box">
                <el-input v-model="serviceInfo.itemPrice" type="number" placeholder="请输入价格"></el-input>
              </div>
              <span class="money-unit">元<em class="unit">/{{serviceInfo.unix}}</em></span>
              <span class="suggest-price">建议价格：{{serviceInfo.minPrice}}-{{serviceInfo.maxPrice}}</span>
            </div>
          </li>
          <!-- <li class="input-list clear_fix">
            <strong class="note">服务时间：</strong>
            <div class="note-left">
              <div class="time-list clear_fix">
                <span class="time-title-note">工作日上午</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="开始时间" v-model="serviceInfo.workdayAmFromTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="结束时间" v-model="serviceInfo.workdayAmToTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
                </div>
              </div>
              <div class="time-list clear_fix">
                <span class="time-title-note">工作日下午</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="开始时间" v-model="serviceInfo.workdayPmFromTime" :picker-options="{start: '12:00',step: '00:60',end: '24:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="结束时间" v-model="serviceInfo.workdayPmToTime" :picker-options="{start: '12:00',step: '00:60',end: '24:00'}"></el-time-select>
                </div>
              </div>

              <div class="time-list clear_fix">
                <span class="time-title-note">非工作日上午</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="开始时间" v-model="serviceInfo.offdayAmFromTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="结束时间" v-model="serviceInfo.offdayAmToTime" :picker-options="{start: '06:00',step: '00:60',end: '12:00'}"></el-time-select>
                </div>
              </div>

              <div class="time-list clear_fix">
                <span class="time-title-note">非工作日下午</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="开始时间" v-model="serviceInfo.offdayPmFromTime" :picker-options="{start: '12:00',step: '00:60',end: '24:00'}"></el-time-select>
                </div>
                <span class="to-text">至</span>
                <div class="time-select-box">
                  <el-time-select :editable="false" placeholder="结束时间" v-model="serviceInfo.offdayPmToTime" :picker-options="{start: '12:00',step: '00:60',end: '24:00'}"></el-time-select>
                </div>
              </div>
            </div>
          </li> -->
        </ul>
        <!-- <p class="notice-text">建议：工作日10：00 -18:00，非工作日10:00-24:00.必须完成所有设置项目才能在app使用</p> -->
        <div class="content-foot">
          <el-button v-if="serviceInfo.itemPrice" type="primary" @click="addServiceFn" size="small">确定</el-button>
          <el-button v-else type="info" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    ERR_OK,
    getTemplateService,
    updateProductStatus,
    getDoctorOPList,
    getServiceDoctor,
    setServiceDoctor,
    saveService
  } from '@/api/api';
  import {getStore, EncodeDoctorId} from "@/config/mUtils.js";

  export default {
    name: 'serverSetting',
    data() {
      return {
        tabIndex: "20",
        serviceInfo: {
          dialogTitle: "",
          isShowDialog: false,
          modelId: "",
          productId: "",
          itemPrice: "",
          minPrice: "",
          maxPrice: "",
          unix: "",
          workdayAmFromTime: "",
          workdayAmToTime: "",
          workdayPmFromTime: "",
          workdayPmToTime: "",
          offdayAmFromTime: "",
          offdayAmToTime: "",
          offdayPmFromTime: "",
          offdayPmToTime: "",
        },
        templateList: [],
        serviceList: [],
        userInfo: {},
      }
    },

    methods: {
      /*获取模板服务*/
      getTemplateServiceFn() {
        let params = {
          userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
          modelType: this.tabIndex,
          providerId: EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId),
          useOs: 2,
        };
        getTemplateService(params).then(res => {
          if (res.code === ERR_OK) {
            this.serviceList = res.data.productInfoWebVos;
            this.templateList = res.data.productModelEntities;
          } else {
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
      //点击开通服务
      openService(item, status) {
        //status 1为开通 2为编辑
        this.serviceInfo.isShowDialog = true;
        this.serviceInfo.dialogTitle = (status === 1 ? "开通服务" : "编辑服务");
        this.serviceInfo.modelId = item.modelId;
        this.serviceInfo.productId = item.productId;
        this.serviceInfo.itemPrice = item.productPrice;
        this.serviceInfo.unix = (status === 1 ? item.modelUnix : item.productUnix);
        this.serviceInfo.minPrice = (status === 1 ? item.modelMinPrice : item.productMinPrice);
        this.serviceInfo.maxPrice = (status === 1 ? item.modelMaxPrice : item.productMaxPrice);

        // this.serviceInfo.offdayAmFromTime=(status===1 ? "" :item.doctorProductDTO.offdayAmFromTime);
        // this.serviceInfo.offdayAmToTime=(status===1 ? "" :item.doctorProductDTO.offdayAmToTime);
        // this.serviceInfo.offdayPmFromTime=(status===1 ? "" :item.doctorProductDTO.offdayPmFromTime);
        // this.serviceInfo.offdayPmToTime=(status===1 ? "" :item.doctorProductDTO.offdayPmToTime);
        // this.serviceInfo.workdayAmFromTime=(status===1 ? "" :item.doctorProductDTO.workdayAmFromTime);
        // this.serviceInfo.workdayAmToTime=(status===1 ? "" :item.doctorProductDTO.workdayAmToTime);
        // this.serviceInfo.workdayPmFromTime=(status===1 ? "" :item.doctorProductDTO.workdayPmFromTime);
        // this.serviceInfo.workdayPmToTime=(status===1 ? "" :item.doctorProductDTO.workdayPmToTime);
      },
      //确定开通服务
      addServiceFn() {
        let params = {
          // doctorProductDTO: {
          //   offdayAmFromTime:this.serviceInfo.offdayAmFromTime,
          //   offdayAmToTime:this.serviceInfo.offdayAmToTime,
          //   offdayPmFromTime:this.serviceInfo.offdayPmFromTime,
          //   offdayPmToTime:this.serviceInfo.offdayPmToTime,
          //   workdayAmFromTime:this.serviceInfo.workdayAmFromTime,
          //   workdayAmToTime:this.serviceInfo.workdayAmToTime,
          //   workdayPmFromTime:this.serviceInfo.workdayPmFromTime,
          //   workdayPmToTime:  this.serviceInfo.workdayPmToTime
          // },
          modelId: this.serviceInfo.modelId,
          productId: this.serviceInfo.productId,
          // productPrice:this.serviceInfo.itemPrice,
          productPrice: this.serviceInfo.itemPrice,
          providerId: EncodeDoctorId(JSON.parse(getStore("userMesage")).insDoctorId),
          userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId),
        };

        if (!params.productPrice) {
          this.$alert("商品价格不能为空", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        if (parseInt(params.productPrice) > parseInt(this.serviceInfo.maxPrice) || parseInt(params.productPrice) < parseInt(this.serviceInfo.minPrice)) {
          this.$alert("商品价格不能超出范围", '提示', {
            confirmButtonText: '确定',
          });
          return;
        }

        //工作日上午
        // if(params.doctorProductDTO.workdayAmFromTime && params.doctorProductDTO.workdayAmToTime){
        //   if(parseInt(params.doctorProductDTO.workdayAmFromTime.slice(0,2)) >= parseInt(params.doctorProductDTO.workdayAmToTime.slice(0,2))){
        //     this.$alert("工作日上午开始时间必须小于结束时间", '提示', {
        //       confirmButtonText: '确定',
        //     });
        //     return;
        //   }
        // }
        //工作日下午
        // if(params.doctorProductDTO.workdayPmFromTime && params.doctorProductDTO.workdayPmToTime){
        //   if(parseInt(params.doctorProductDTO.workdayPmFromTime.slice(0,2)) >= parseInt(params.doctorProductDTO.workdayPmToTime.slice(0,2))){
        //     this.$alert("工作日下午开始时间必须小于结束时间", '提示', {
        //       confirmButtonText: '确定',
        //     });
        //     return;
        //   }
        // }
        //非工作日上午
        // if(params.doctorProductDTO.offdayAmFromTime && params.doctorProductDTO.offdayAmToTime){
        //   if(parseInt(params.doctorProductDTO.offdayAmFromTime.slice(0,2)) >= parseInt(params.doctorProductDTO.offdayAmToTime.slice(0,2))){
        //     this.$alert("非工作日上午开始时间必须小于结束时间", '提示', {
        //       confirmButtonText: '确定',
        //     });
        //     return;
        //   }
        // }
        //非工作日下午
        // if(params.doctorProductDTO.offdayPmFromTime && params.doctorProductDTO.offdayPmToTime){
        //   if(parseInt(params.doctorProductDTO.offdayPmFromTime.slice(0,2)) >= parseInt(params.doctorProductDTO.offdayPmToTime.slice(0,2))){
        //     this.$alert("非工作日下午开始时间必须小于结束时间", '提示', {
        //       confirmButtonText: '确定',
        //     });
        //     return;
        //   }
        // }

        saveService(params).then(res => {
          if (res.code === ERR_OK) {
            this.serviceInfo.isShowDialog = false;
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getTemplateServiceFn();
              }
            })
          } else {
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
      //上线
      upLineFn(item) {
        this.$confirm('确定要上架吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              productId: item.productId,
              productStatus: 1,
              userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId)

            };
            updateProductStatus(params)
              .then(res => {
                if (res.code === ERR_OK) {
                  this.getTemplateServiceFn()
                } else {
                  this.$alert(res.msg, '提示', {
                    confirmButtonText: '确定'
                  })
                }
              })
              .catch(err => {
                this.$alert(err.msg, '提示', {
                  confirmButtonText: '确定'
                })
              })
          })
          .catch(() => {
          })
      },
      //下线
      downLineFn(item) {
        this.$confirm('确定要下架吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(_ => {
            let params = {
              productId: item.productId,
              productStatus: 2,
              userId: EncodeDoctorId(JSON.parse(getStore("userMesage")).userId)

            };
            updateProductStatus(params)
              .then(res => {
                if (res.code === ERR_OK) {
                  this.getTemplateServiceFn()
                } else {
                  this.$alert(res.msg, '提示', {
                    confirmButtonText: '确定'
                  })
                }
              })
              .catch(err => {
                this.$alert(err.msg, '提示', {
                  confirmButtonText: '确定'
                })
              })
          })
          .catch(() => {
          })
      }
    },
    activated() {
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getTemplateServiceFn()
    },
    watch: {
      tabIndex() {
        this.getTemplateServiceFn();
      }
    }
  }
</script>
<style lang="less">
  .unit {
    padding-left: 10px;
    font-weight: bold
  }

  .suggest-price {
    padding-left: 30px;
    color: #409EFF;
    line-height: 40px;
    font-size: 16px
  }

  .rate-bar {
    font-size: 14px;
    color: #f9f9f9;
    line-height: 22px;
    margin-bottom: 5px
  }

  .template-card {
    background-color: rgba(64, 158, 255, 0.1);
    border: 1px solid rgba(64, 158, 255, 0.3)
  }

  .service-card {
    background-color: rgba(79, 177, 54, 0.1);
    border: 1px solid rgba(79, 177, 54, 0.3)
  }

  .card-template-title {
    color: #409EFF
  }

  .card-service-title {
    color: #4fb136
  }

  .item-head {
    padding: 5px 0 10px;
    .name {
      font-size: 16px;
      line-height: 24px;
      color: #fff;
    }
    .price {
      float: right;
      line-height: 24px;
      font-size: 14px;
      color: #f6f6f6
    }
  }

  .time-title {
    font-size: 15px;
    color: #f6f6f6;
    line-height: 24px;
  }

  .time-text {
    font-size: 14px;
    color: #f6f6f6;
    line-height: 24px;
  }

  .template-item {
    padding: 15px;
    margin-bottom: 20px;
    background-color: #409EFF;
    border-radius: 6px;

    .btn-bar {
      text-align: center;
      padding: 20px 0 5px;
      .template-btn {
        display: inline-block;
        background-color: #147ae3;
        color: #fff;
        line-height: 28px;
        border-radius: 4px;
        padding: 0 15px;
        border: none;
        cursor: pointer
      }

    }
  }

  .service-item {
    padding: 15px;
    margin-bottom: 20px;
    background-color: #4fb136;
    border-radius: 6px;
    .btn-bar {
      text-align: center;
      padding: 20px 0 5px;
      .upline-btn {
        display: inline-block;
        background-color: #239605;
        color: #fff;
        line-height: 28px;
        border-radius: 4px;
        padding: 0 15px;
        border: none;
        cursor: pointer
      }
      .editor-btn {
        display: inline-block;
        background-color: #277a11;
        color: #fff;
        line-height: 28px;
        border-radius: 4px;
        padding: 0 15px;
        border: none;
        cursor: pointer
      }

    }
  }

  .input-list {
    margin-bottom: 15px;
  }

  .note {
    float: left;
    line-height: 40px;
    font-size: 15px;
    width: 85px;
  }

  .note-left {
    float: left;
    width: 490px;
    vertical-align: top;
  }

  .clear_fix:after {
    content: '';
    display: block;
    clear: both
  }

  .el-input-box {
    float: left;
    width: 200px;
    margin-right: 20px;
  }

  .money-unit {
    display: inline-block;
    vertical-align: top;
    line-height: 40px;
  }

  .time-title-note {
    float: left;
    vertical-align: top;
    line-height: 40px;
    margin-right: 20px;
    width: 90px;
    text-align: right
  }

  .to-text {
    float: left;
    vertical-align: top;
    line-height: 40px;
    margin-right: 20px;
  }

  .time-select-box {
    float: left;
    width: 140px;
    margin-right: 20px;
  }

  .time-select-box .el-date-editor.el-input {
    width: 100%
  }

  .time-list {
    margin-bottom: 15px;
  }

  .content-foot {
    text-align: center
  }

  .notice-text {
    font-size: 12px;
    line-height: 24px;
    color: #999;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
</style>


