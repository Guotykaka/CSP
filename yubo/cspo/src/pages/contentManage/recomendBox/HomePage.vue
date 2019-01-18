<template>
  <div class="home-page">
    <div class="home-add-btn">
      <el-button type="primary" size="small" @click="addManage">新 增</el-button>
    </div>
    <div class="home-page-table">
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
        <el-table-column align="center" label="类 型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.newsType===1">话 题</el-tag>
            <el-tag v-if="scope.row.newsType===2" type="success">专 题</el-tag>
            <el-tag v-if="scope.row.newsType===3" type="warning">付费视频</el-tag>
            <el-tag v-if="scope.row.newsType===4" type="warning">免费视频</el-tag>
            <el-tag v-if="scope.row.newsType===5" type="danger">图文</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="名 称"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="delManage(scope.row)" type="danger" size="small">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增首页推荐分类-->
    <el-dialog title="推荐位" :show-close="false" :visible.sync="homeShow" width="600px">
      <el-row :gutter="20" class="show-row">
        <el-col :offset="1" :span="8" class="show-text"><span>类别:</span></el-col>
        <el-col :span="12">
          <el-select v-model="newsType" @change="getSelectData" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="show-row">
        <el-col :offset="1" :span="8" class="show-text"><span>名称:</span></el-col>
        <el-col :span="12">
          <el-select clearable value-key="contentId" v-model="titleParams" filterable placeholder="请选择">
            <el-option
              v-for="(item,index) in nemeData"
              :key="item.contentId"
              :label="item.title"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleBtn" size="small">取 消</el-button>
        <el-button type="primary" @click="sureBtn" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    ERR_OK,
    addNewsRecommendInfo,//保存推荐信息【新版本5.1】
    deleteNewsRecommendInfo,//删除推荐 【新版本5.1】
    queryNewsRecommendInfoList,//查询推荐列表 【新版本5.1】
    queryContentInfoList//查询(话题，专题，视频对应内容的列表） 【新版本5.1】
  } from '@/api/api'
  export default {
    name: "HomePage",
    data() {
      return {
        tableData: [],
        /*弹窗start*/
        homeShow: false,
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
        nemeData:[],
        newsType: '',
        titleParams: {
          contentId: '',
          title: ''
        },
        /*弹窗end*/
        /*限制双击*/
        doubleClick:true
      }
    },
    created() {
      this.getManageList();
    },
    methods: {
      /*获取首页推荐列表*/
      getManageList() {
        let params = {
          type: "1"
        };
        queryNewsRecommendInfoList(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.tableData = res.data;
            } else {
              this.$alert(res.msg, '提示')
            }
          })
          .catch(() => {
            this.$message.error('网络错误!获取s首页推荐数据失败')
          })
      },
      /*参数初始化*/
      initParams() {
        this.newsType = '';
        this.titleParams.contentId = '';
        this.titleParams.title = ''
      },
      /*打开新增首页推荐分类弹窗*/
      addManage() {
        this.initParams();
        this.homeShow = true;
      },
      /*获取下拉列表数据*/
      getSelectData() {
        if(this.newsType){
          let params = {
            contentType: this.newsType
          };
          queryContentInfoList(params)
            .then((res)=>{
              if(res.code===ERR_OK){
                this.nemeData = res.data;
              }else{
                this.$alert(res.msg,'提示')
              }
            })
            .catch(()=>{
              this.$message.error('网络错误!,获取a下拉列表数据失败')
            })

        }
      },
      /*确定新增推荐*/
      sureBtn() {
        let params = {
          list:[{
            id:'',
            contentId: this.titleParams.contentId,//内容id
            newsType: this.newsType,//类别：话题=1；专题=2；视频=3；
            picUrl: "",//图片地址（type=4才有数据） ,
            title: this.titleParams.title,//标题
            type: 1//: 类别：首页推荐=1；头条推荐视频（话题）=2；订阅话题=3；轮播图列=4；
          }],
          type:'1'
        };
        if(this.titleParams.contentId===''||this.newsType===''||this.titleParams.title===''){
          this.$alert('请完善信息','提示')
          return;
        }
        if(this.doubleClick){
          this.doubleClick = false;
          addNewsRecommendInfo(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.homeShow = false;
                this.doubleClick = true;
                this.getManageList();
              } else {
                this.$alert(res.msg, '提示')
              }
            })
            .catch(() => {
              this.$message.error('网络错误!获取v首页推荐数据失败')
            })
        }

      },
      /*关闭推荐分类弹窗*/
      cancleBtn() {
        this.homeShow = false;

      },
      /*删除首页推荐*/
      delManage(row) {
        let params = {
          id: row.id
        };
        this.$confirm('此操作将永久删除该推荐, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNewsRecommendInfo(params)
            .then((res) => {
              if (res.code === ERR_OK) {
                this.getManageList();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$alert(res.msg, '提示')
              }
            })
            .catch(() => {
              this.$message.error('网络错误!获取首页d推荐数据失败')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped lang="less">
  /*新增按钮start*/
  .home-add-btn {
    text-align: right;
    margin-right: 20px;
  }

  /*新增按钮end*/
  /*新增弹窗样式start*/
  .show-row {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 36px;
    .show-text {
      text-align: right;
    }
  }

  .dialog-footer {
    text-align: center;
  }

  /*新增弹窗样式end*/
</style>
