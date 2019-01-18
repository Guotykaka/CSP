<template>
  <div class="headline">
    <!--推荐话题-->
    <el-card class="headline-top" shadow="always">
      <div slot="header" class="clearfix btm-border">
        <span>推荐话题</span>
      </div>
      <el-row>
        <el-col :span="6">
          <div style="text-align:center;margin-bottom:10px;">
            1.
            <el-select
              clearable
              value-key="contentId"
              v-model="themeLeft"
              filterable
              @change="themeSureLeft"
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center;margin-bottom:10px;">
            2.
            <el-select
              clearable
              @change="themeSureRight"
              value-key="contentId"
              v-model="themeRight"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center;margin-bottom:10px;">
            3.
            <el-select
              clearable
              @change="themeSureOne"
              value-key="contentId"
              v-model="themeOne"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center;margin-bottom:10px;">
            4.
            <el-select
              clearable
              @change="themeSureTwo"
              value-key="contentId"
              v-model="themeTwo"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center;">
            5.
            <el-select
              clearable
              @change="themeSureThree"
              value-key="contentId"
              v-model="themeThree"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center;">
            6.
            <el-select
              clearable
              @change="themeSureFour"
              value-key="contentId"
              v-model="themeFour"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in themeData"
                :key="item.contentId"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="top-btn">
        <div>
          <el-button type="info" size="small" @click="cancleTheme">取 消</el-button>
          <el-button type="primary" size="small" @click="saveTheme">保 存</el-button>
        </div>
      </el-row>
    </el-card>
    <!--订阅话题-->
    <el-card class="headline-center" shadow="always" :body-style="{paddingLeft:'10px',paddingRight:'10px'}">
      <div slot="header" class="clearfix btm-border">
        <span>订阅话题</span>
      </div>
      <el-row>
        <el-col :span="6">
          <span class="subscribeText">1. </span>
          <el-card class="subscribe-card" shadow="always">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl1"
                  @emitSuccess="handleImgOne"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe1"
                  filterable
                  @change="changeOne"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">2. </span>
          <el-card class="subscribe-card">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl2"
                  @emitSuccess="handleImgTwo"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe2"
                  filterable
                  @change="changeTwo"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">3. </span>
          <el-card class="subscribe-card">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl3"
                  @emitSuccess="handleImgThree"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe3"
                  filterable
                  @change="changeThree"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">4. </span>
          <el-card class="subscribe-card">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl4"
                  @emitSuccess="handleImgFour"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe4"
                  filterable
                  @change="changeFour"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">5. </span>
          <el-card class="subscribe-card">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl5"
                  @emitSuccess="handleImgFive"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe5"
                  filterable
                  @change="changeFive"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">6. </span>
          <el-card class="subscribe-card">
            <!--<el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl6"
                  @emitSuccess="handleImgSix"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="8" class="card-text-b">订阅话题:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="subscribe6"
                  filterable
                  @change="changeSix"
                  placeholder="请选择">
                  <el-option
                    v-for="item in themeData"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="top-btn">
        <div>
          <el-button type="info" size="small" @click="cancleSubscribe">取 消</el-button>
          <el-button type="primary" size="small" @click="saveSubscribe">保 存</el-button>
        </div>
      </el-row>
    </el-card>
    <!--推荐页轮播图-->
    <el-card class="headline-bottom" shadow="always" :body-style="{paddingLeft:'10px',paddingRight:'10px'}">
      <div slot="header" class="clearfix btm-border">
        <span>推荐页轮播图</span>
      </div>
      <el-row>
        <el-col :span="6">
          <span class="subscribeText">1. </span>
          <el-card class="subscribe-card" shadow="always">
            <el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl7"
                  @emitSuccess="handleImgSeven"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>
            <el-row class="card-row">
              <el-col :span="8" class="card-text-b">跳转类型:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="newsType7"
                  filterable
                  @change="bannerSelectOne"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="card-text-b">跳转名称:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="bannerParams7"
                  filterable
                  @change="bannerTitleOne"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bannerName1"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">2. </span>
          <el-card class="subscribe-card" shadow="always">
            <el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl8"
                  @emitSuccess="handleImgEight"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>
            <el-row class="card-row">
              <el-col :span="8" class="card-text-b">跳转类型:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="newsType8"
                  filterable
                  @change="bannerSelectTwo"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="card-text-b">跳转名称:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="bannerParams8"
                  filterable
                  @change="bannerTitleTwo"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bannerName2"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">3. </span>
          <el-card class="subscribe-card" shadow="always">
            <el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl9"
                  @emitSuccess="handleImgNine"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>
            <el-row class="card-row">
              <el-col :span="8" class="card-text-b">跳转类型:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="newsType9"
                  filterable
                  @change="bannerSelectThree"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="card-text-b">跳转名称:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="bannerParams9"
                  filterable
                  @change="bannerTitleThree"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bannerName3"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <span class="subscribeText">4. </span>
          <el-card class="subscribe-card" shadow="always">
            <el-row class="card-row">
              <el-col :span="8" class="card-text">
                封面图片:
              </el-col>
              <el-col :span="12">
                <up-img
                  :imageSrc="picUrl10"
                  @emitSuccess="handleImgTen"
                  @emitError="errorImg"
                ></up-img>
              </el-col>
            </el-row>
            <el-row class="card-row">
              <el-col :span="8" class="card-text-b">跳转类型:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="newsType10"
                  filterable
                  @change="bannerSelectFour"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" class="card-text-b">跳转名称:</el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  value-key="contentId"
                  v-model="bannerParams10"
                  filterable
                  @change="bannerTitleFour"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bannerName4"
                    :key="item.contentId"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="top-btn">
        <div>
          <el-button type="info" size="small" @click="cancleBanner">取 消</el-button>
          <el-button type="primary" size="small" @click="saveBanner">保 存</el-button>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import UpImg from '@/components/uploadImg/uploadImgAdd.vue'
  import {
    ERR_OK,
    addNewsRecommendInfo,//保存推荐信息【新版本5.1】
    deleteNewsRecommendInfo,//删除推荐 【新版本5.1】
    queryNewsRecommendInfoList,//查询推荐列表 【新版本5.1】
    queryContentInfoList//查询(话题，专题，视频对应内容的列表） 【新版本5.1】
  } from '@/api/api'

  export default {
    name: "Headline",
    components: {
      UpImg
    },
    data() {
      return {
        options: [
          {
            value: 1,
            label: '话题'
          },
          {
            value: 2,
            label: '专题'
          },
          {
            value: 3,
            label: '付费视频'
          },
          {
            value: 4,
            label: '免费视频'
          },
          {
            value: 5,
            label: '图文'
          }
        ],
        typeString: '',
        themeData: [],//推荐话题下拉数据
        themeDataList: [],//推荐话题保存数据
        themeSaveList: [],//推荐话题保存数据参数集合
        subscribeList: [],//订阅话题列表数据集合
        themeType: '',//话题类别,订阅&推荐
        newsType: '',
        themeLeft: {
          contentId: '',
          title: ''
        },
        themeLeftId: '',
        themeRight: {
          contentId: '',
          title: ''
        },
        themeRightId: '',
        themeOne: {
          contentId: '',
          title: ''
        },
        themeOneId: '',
        themeTwo: {
          contentId: '',
          title: ''
        },
        themeTwoId: '',
        themeThree: {
          contentId: '',
          title: ''
        },
        themeThreeId: '',
        themeFour: {
          contentId: '',
          title: ''
        },
        themeFourId: '',
        doubleClickOne: true,
        doubleClickTwo: true,
        doubleClickThree: true,
        picUrl1: '',
        subscribeId1: '',
        subscribe1: {},
        picUrl2: '',
        subscribeId2: '',
        subscribe2: {},
        picUrl3: '',
        subscribeId3: '',
        subscribe3: {},
        picUrl4: '',
        subscribeId4: '',
        subscribe4: {},
        picUrl5: '',
        subscribeId5: '',
        subscribe5: {},
        picUrl6: '',
        subscribeId6: '',
        subscribe6: {},
        /*轮播图start*/
        bannerList: [],
        bannerParams7: {
          contentId: '',
          title: ''
        },
        newsType7: null,
        picUrl7: '',
        bannerId7: '',
        bannerName1: [],
        bannerParams8: {
          contentId: '',
          title: ''
        },
        newsType8: null,
        picUrl8: '',
        bannerId8: '',
        bannerName2: [],
        bannerParams9: {
          contentId: '',
          title: ''
        },
        newsType9: null,
        picUrl9: '',
        bannerId9: '',
        bannerName3: [],
        bannerParams10: {
          contentId: '',
          title: ''
        },
        newsType10: null,
        picUrl10: '',
        bannerId10: '',
        bannerName4: [],
      }
    },
    created() {
      this.getThemeList();//推荐话题列表
      this.getThemeSelect();//获取下拉数据
      this.getSubscribeList();//订阅话题列表
      this.getBannerList();//推荐banner列表
    },
    methods: {
      /*图片上传成功*/
      handleImgOne(res) {
        if (res.status === 200) {
          this.picUrl1 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[0].picUrl = this.picUrl1
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgTwo(res) {
        if (res.status === 200) {
          this.picUrl2 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[1].picUrl = this.picUrl2
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgThree(res) {
        if (res.status === 200) {
          this.picUrl3 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[2].picUrl = this.picUrl3
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgFour(res) {
        if (res.status === 200) {
          this.picUrl4 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[3].picUrl = this.picUrl4
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgFive(res) {
        if (res.status === 200) {
          this.picUrl5 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[4].picUrl = this.picUrl5
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgSix(res) {
        if (res.status === 200) {
          this.picUrl6 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.subscribeList[5].picUrl = this.picUrl6
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgSeven(res) {
        if (res.status === 200) {
          this.picUrl7 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          if(this.bannerList[0]){
            this.bannerList[0].picUrl = this.picUrl7
          }
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgEight(res) {
        if (res.status === 200) {
          this.picUrl8 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          if(this.bannerList[1]){
            this.bannerList[1].picUrl = this.picUrl8
          }
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgNine(res) {
        if (res.status === 200) {
          this.picUrl9 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          if(this.bannerList[2]){
            this.bannerList[2].picUrl = this.picUrl9
          }
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleImgTen(res) {
        if (res.status === 200) {
          this.picUrl10 = 'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          if(this.bannerList[3]){
            this.bannerList[3].picUrl = this.picUrl10
          }
        } else {
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      /*图片上传失败*/
      errorImg(res) {
        this.$message.error(res.msg)
      },
      /*推荐话题start*/
      /*获取已保存推荐话题列表*/
      getThemeList() {
        let params = {
          type: '2'
        };
        queryNewsRecommendInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.themeLeft = res.data[0]?res.data[0]:{};
              this.themeLeftId = res.data[0] ? res.data[0].id : '';
              this.themeRight = res.data[1]?res.data[1]:{};
              this.themeRightId = res.data[1] ? res.data[1].id : '';

              this.themeOne = res.data[2]?res.data[2]:{};
              this.themeOneId = res.data[2] ? res.data[2].id : '';
              this.themeTwo = res.data[3]?res.data[3]:{};
              this.themeTwoId = res.data[3] ? res.data[3].id : '';
              this.themeThree = res.data[4]?res.data[4]:{};
              this.themeThreeId = res.data[4] ? res.data[4].id : '';
              this.themeFour = res.data[5]?res.data[5]:{};
              this.themeFourId = res.data[5] ? res.data[5].id : '';
              this.themeSaveList = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取已保存推荐话题列表数据失败')
          })
      },
      /*获取话题下拉数据*/
      getThemeSelect() {
        let params = {
          contentType: '1'
        };
        queryContentInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.themeData = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!,获取下拉列表数据失败')
          })
      },
      /*取消保存推荐话题*/
      cancleTheme() {
        this.getThemeSelect();
        this.getThemeList();
      },
      themeSureLeft() {
        this.themeSaveList[0] = {
          contentId: this.themeLeft.contentId,
          title: this.themeLeft.title,
          id: this.themeLeftId
        };
      },
      themeSureRight() {
        this.themeSaveList[1] = {
          contentId: this.themeRight.contentId,
          title: this.themeRight.title,
          id: this.themeRightId
        };
      },
      themeSureOne() {
        this.themeSaveList[2] = {
          contentId: this.themeOne.contentId,
          title: this.themeOne.title,
          id: this.themeOneId
        };
      },
      themeSureTwo() {
        this.themeSaveList[3] = {
          contentId: this.themeTwo.contentId,
          title: this.themeTwo.title,
          id: this.themeTwoId
        };
      },
      themeSureThree() {
        this.themeSaveList[4] = {
          contentId: this.themeThree.contentId,
          title: this.themeThree.title,
          id: this.themeThreeId
        };
      },
      themeSureFour() {
        this.themeSaveList[5] = {
          contentId: this.themeFour.contentId,
          title: this.themeFour.title,
          id: this.themeFourId
        };
      },
      /*保存推荐话题*/
      saveTheme() {
        // // let arr = [];
        // if (!this.themeLeft.contentId || !this.themeRight.contentId) {
        //   this.$alert('请先选择两个推荐话题');
        //   return;
        // }
        // if (this.themeLeft.contentId === this.themeRight.contentId) {
        //   this.$alert('请不要重复选择同样的推荐话题');
        //   return;
        // }


        let arr = [], arrList = [];
        for (var i = 0; i < this.themeSaveList.length; i++) {
          arrList.push(this.themeSaveList[i].contentId)
        }
        let set = new Set(arrList);
        let array = Array.from(set);
        if (array.length !== 6) {
          this.$alert('有重复话题,请重新选择')
          return;
        }








        this.themeSaveList.forEach((value,key) => {
          if(key<6&&value.contentId){
            arr.push(
              {
                id: value.id,
                contentId: value.contentId,//内容id
                newsType: 1,//类别：话题=1；专题=2；视频=3；
                picUrl: "",//图片地址（type=4才有数据） ,
                title: value.title,//标题
                type: 2//: 类别：首页推荐=1；头条推荐视频（话题）=2；订阅话题=3；轮播图列=4；
              })
          }
        });
        let params = {
          list: arr,
          type:'2'
        };
        if (this.doubleClickOne) {
          this.doubleClickOne = false;
          addNewsRecommendInfo(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.doubleClickOne = true;
                this.getThemeList();
              } else {
                this.$alert(res.msg, '提示')
              }
            })
            .catch(() => {
              this.doubleClickOne = true;
              this.$message.error('网络错误!获取首页推荐话题数据失败')
            })
        }
      },
      /*推荐话题end*/
      /*订阅话题start*/
      /*获取已保存订阅话题列表*/
      getSubscribeList() {
        let params = {
          type: '3'
        };
        queryNewsRecommendInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              // this.picUrl1 = res.data[0] ? res.data[0].picUrl : '';
              this.subscribeId1 = res.data[0] ? res.data[0].id : '';
              this.subscribe1 = res.data[0] ? res.data[0] : {};

              // this.picUrl2 = res.data[1] ? res.data[1].picUrl : '';
              this.subscribeId2 = res.data[1] ? res.data[1].id : '';
              this.subscribe2 = res.data[1] ? res.data[1] : {};

              // this.picUrl3 = res.data[2] ? res.data[2].picUrl : '';
              this.subscribeId3 = res.data[2] ? res.data[2].id : '';
              this.subscribe3 = res.data[2] ? res.data[2] : {};

              // this.picUrl4 = res.data[3] ? res.data[3].picUrl : '';
              this.subscribeId4 = res.data[3] ? res.data[3].id : '';
              this.subscribe4 = res.data[3] ? res.data[3] : {};

              // this.picUrl5 = res.data[4] ? res.data[4].picUrl : '';
              this.subscribeId5 = res.data[4] ? res.data[4].id : '';
              this.subscribe5 = res.data[4] ? res.data[4] : {};

              // this.picUrl6 = res.data[5] ? res.data[5].picUrl : '';
              this.subscribeId6 = res.data[5] ? res.data[5].id : '';
              this.subscribe6 = res.data[5] ? res.data[5] : {};

              this.subscribeList = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取首页推荐订阅话题列表数据失败')
          })
      },
      changeOne() {
          this.subscribeList[0] = {
            contentId: this.subscribe1.contentId,
            title: this.subscribe1.title,
            id: this.subscribeId1,
            picUrl: this.picUrl1
          }
      },
      changeTwo() {
          this.subscribeList[1] = {
            contentId: this.subscribe2.contentId,
            title: this.subscribe2.title,
            id: this.subscribeId2,
            picUrl: this.picUrl2
          }
      },
      changeThree() {
          this.subscribeList[2] = {
            contentId: this.subscribe3.contentId,
            title: this.subscribe3.title,
            id: this.subscribeId3,
            picUrl: this.picUrl3
          }
      },
      changeFour() {
          this.subscribeList[3] = {
            contentId: this.subscribe4.contentId,
            title: this.subscribe4.title,
            id: this.subscribeId4,
            picUrl: this.picUrl4
          }
      },
      changeFive() {
          this.subscribeList[4] = {
            contentId: this.subscribe5.contentId,
            title: this.subscribe5.title,
            id: this.subscribeId5,
            picUrl: this.picUrl5
          };
      },
      changeSix() {
          this.subscribeList[5] = {
            contentId: this.subscribe6.contentId,
            title: this.subscribe6.title,
            id: this.subscribeId6,
            picUrl: this.picUrl6
          };
      },
      /*取消保存订阅话题*/
      cancleSubscribe() {
        this.getThemeSelect();
        this.getSubscribeList();
      },
      /*确定保存订阅话题*/
      saveSubscribe() {
        let arr = [], arrList = [];
        for (var i = 0; i < this.subscribeList.length; i++) {
          arrList.push(this.subscribeList[i].contentId)
        }
        let set = new Set(arrList);
        let array = Array.from(set);
        if (array.length !== 6) {
          this.$alert('有重复话题,请重新选择')
          return;
        }
        this.subscribeList.forEach((value, key) => {
          if (key < 6) {
            arr.push(
              {
                id: value.id,
                contentId: value.contentId,//内容id
                newsType: 1,//类别：话题=1；专题=2；视频=3；
                picUrl: '',//图片地址（type=4才有数据） ,
                title: value.title,//标题
                type: 3//: 类别：首页推荐=1；头条推荐视频（话题）=2；订阅话题=3；轮播图列=4；
              })
          }
        });
        let params = {
          list: arr,
          type:'3'
        };
        if (this.doubleClickTwo) {
          this.doubleClickTwo = false;
          addNewsRecommendInfo(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.doubleClickTwo = true;
                this.getSubscribeList();
              } else {
                this.$alert(res.msg, '提示')
              }
            })
            .catch(() => {
              this.doubleClickTwo = true;
              this.$message.error('网络错误!保存订阅话题数据失败')
            })
        }
      },
      /*订阅话题end*/
      /*推荐轮播图start*/
      getBannerList() {
        let params = {
          type: '4'
        };
        queryNewsRecommendInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.picUrl7 = res.data[0] ? res.data[0].picUrl : '';
              this.bannerId7 = res.data[0] ? res.data[0].id : '';
              this.newsType7 = res.data[0] ? res.data[0].newsType : null;
              if(this.newsType7){
                this.bannerSelectOne();
              }
              this.bannerParams7 = res.data[0] ? res.data[0] : {};

              this.picUrl8 = res.data[1] ? res.data[1].picUrl : '';
              this.bannerId8 = res.data[1] ? res.data[1].id : '';
              this.newsType8 = res.data[1] ? res.data[1].newsType : null;
              if(this.newsType8){
                this.bannerSelectTwo();
              }
              this.bannerParams8 = res.data[1] ? res.data[1] : {};

              this.picUrl9 = res.data[2] ? res.data[2].picUrl : '';
              this.bannerId9 = res.data[2] ? res.data[2].id : '';
              this.newsType9 = res.data[2] ? res.data[2].newsType : null;
              if(this.newsType9){
                this.bannerSelectThree();
              }
              this.bannerParams9 = res.data[2] ? res.data[2] : {};

              this.picUrl10 = res.data[3] ? res.data[3].picUrl : '';
              this.bannerId10 = res.data[3] ? res.data[3].id : '';
              this.newsType10 = res.data[3] ? res.data[3].newsType : null;
              if(this.newsType10){
                this.bannerSelectFour();
              }
              this.bannerParams10 = res.data[3] ? res.data[3] : {};

              this.bannerList = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取首页推荐轮播图数据失败')
          })
      },
      /*banner下拉数据获取*/
      bannerSelectOne() {
        let params = {
          contentType: this.newsType7
        };
        this.bannerName1 = [];
        this.bannerParams7 =   {
          contentId: '',
          title: ''
        };
        if(!params.contentType){
          this.bannerTitleOne();
        }
        queryContentInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.bannerName1 = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!,获取banner下拉列表数据失败')
          })
      },
      bannerTitleOne() {
        if (this.picUrl7) {
          this.bannerList[0] = {
            contentId: this.bannerParams7.contentId||'',
            title: this.bannerParams7.title||'',
            id: this.bannerId7,
            picUrl: this.picUrl7,
            newsType: this.newsType7
          };
        } else {
          this.$alert('请先选择话题封面');
          this.bannerParams7 = {}
        }
      },
      bannerSelectTwo() {
        let params = {
          contentType: this.newsType8
        };
        this.bannerName2 = [];
        this.bannerParams8 ={
          contentId: '',
          title: ''
        };
        if(!params.contentType){
          this.bannerTitleTwo();
        }
        queryContentInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.bannerName2 = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!,获取banner下拉列表数据失败')
          })
      },
      bannerTitleTwo() {
        if (this.picUrl8) {
          this.bannerList[1] = {
            contentId: this.bannerParams8.contentId||'',
            title: this.bannerParams8.title||'',
            id: this.bannerId8,
            picUrl: this.picUrl8,
            newsType: this.newsType8
          };
        } else {
          this.$alert('请先选择话题封面');
          this.bannerParams8 = {}
        }

      },
      bannerSelectThree() {
        let params = {
          contentType: this.newsType9
        };
        this.bannerName3 = [];
        this.bannerParams9 =  {
          contentId: '',
          title: ''
        };
        if(!params.contentType){
          this.bannerTitleThree();
        }
        queryContentInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.bannerName3 = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!,获取banner下拉列表数据失败')
          })
      },
      bannerTitleThree() {
        if (this.picUrl9) {
          this.bannerList[2] = {
            contentId: this.bannerParams9.contentId||'',
            title: this.bannerParams9.title||'',
            id: this.bannerId9,
            picUrl: this.picUrl9,
            newsType: this.newsType9
          };
        } else {
          this.$alert('请先选择话题封面')
          this.bannerParams9 = {}
        }

      },
      bannerSelectFour() {
        let params = {
          contentType: this.newsType10
        };
        this.bannerName4 = [];
        this.bannerParams10 ={
          contentId: '',
          title: ''
        };
        if(!params.contentType){
          this.bannerTitleFour();
        }
        queryContentInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.bannerName4 = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!,获取banner下拉列表数据失败')
          })
      },
      bannerTitleFour() {
        if (this.picUrl10) {
          this.bannerList[3] = {
            contentId: this.bannerParams10.contentId||'',
            title: this.bannerParams10.title||'',
            id: this.bannerId10,
            picUrl: this.picUrl10,
            newsType: this.newsType10
          };
        } else {
          this.$alert('请先选择话题封面')
          this.bannerParams10 = {}
        }
      },
      /*取消保存轮播图数据*/
      cancleBanner() {
        this.getBannerList();
      },
      /*确定保存轮播图数据*/
      saveBanner() {
        let arr = [], arrList = [];
        for (var i = 0; i < this.bannerList.length; i++) {
          arrList.push(this.bannerList[i].contentId)
        }
        let set = new Set(arrList);
        let array = Array.from(set);
        if (array.length !== this.bannerList.length) {
          this.$alert('有重复推荐banner图名称,请重新选择');
          return;
        }
        this.bannerList.forEach((value, key) => {
          if (key < 4&&value.contentId) {
            arr.push(
              {
                id: value.id,
                contentId: value.contentId,//内容id
                newsType: value.newsType,//类别：话题=1；专题=2；视频=3；
                picUrl: value.picUrl,//图片地址（type=4才有数据） ,
                title: value.title,//标题
                type: 4//: 类别：首页推荐=1；头条推荐视频（话题）=2；订阅话题=3；轮播图列=4；
              })
          }
        });
        let params = {
          list: arr,
          type:'4'
        };
        if (this.doubleClickThree) {
          this.doubleClickThree = false;
          addNewsRecommendInfo(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.doubleClickThree = true;
                this.getBannerList();
              } else {
                this.$alert(res.msg, '提示')
              }
            })
            .catch(() => {
              this.doubleClickThree = true;
              this.$message.error('网络错误!保存订阅话题数据失败')
            })
        }
      },
      /*推荐轮播图end*/
    },
    watch:{
      newsType7(val){

      },
      newsType8(val){

      },
      newsType9(val){

      },
      newsType10(val){

      },
    }
  }
</script>

<style scoped lang="less">
  .headline /deep/ .el-card__header {
    border-bottom: 1px solid #ccc;
  }

  .headline /deep/ .el-card.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, .4)
  }

  /*top模块样式start*/
  .headline-top {
    margin-bottom: 20px;
    .top-btn {
      margin-top: 20px;
      text-align: center;
    }
  }

  /*top模块样式end*/
  /*center模块样式start*/
  .headline-center,
  .headline-bottom {
    margin-bottom: 20px;
    .top-btn {
      margin-top: 20px;
      text-align: center;
    }
    .subscribeText {
      float: left;
      margin-right: 10px;
    }
    .subscribe-card {
      border: 1px solid #e5e5e5;
      margin-right: 10px;
      margin-bottom: 10px;
      .card-row {
        margin-bottom: 10px;
        .card-text {
          text-align: center;
          line-height: 100px;
        }
      }
      .card-text-b {
        line-height: 40px;
        text-align: center;
      }

    }
  }

  /*center模块样式end*/
  /*bottom模块样式start*/
  .headline-bottom {
    margin-bottom: 20px;
    .top-btn {
      margin-top: 20px;
      text-align: center;
    }
  }

  /*bottom模块样式end*/

</style>
