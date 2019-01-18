<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">
        <el-form class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="refresh()">刷新</el-button>
          </el-form-item>
        </el-form>

      </el-header>
      <el-scrollbar>
        <el-main>
          <!-- 列表 -->
          <template>
            <el-card class="box-card" v-for="(item, index) in tableData" :key="index">
              <div class="text item">
                <span>版本号: </span>
                {{item.versionCode }}
                <br>
                <span>版本名称: </span>
                {{item.versionName }}
                <br>
                <span>OSType: </span>
                {{item.osType }}
                <br>
                <span>Status: </span>
                {{item.status }}
                <br>
                <span>下载地址: </span>
                {{item.downLink }}
                <br>
                <span>apk下载地址: </span>
                {{item.apkDownLink }}
                <br>
              </div>
            </el-card>
            <el-card class="box-card-down">
              <el-tag>到底了！</el-tag>
            </el-card>

          </template>
        </el-main>
      </el-scrollbar>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    getVersionList,
    refreshVersion
  } from '@/api/api.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop
    },
    data() {
      return {
        title: "提示",//this.$alert的标题
        tableData: [], //列表数据
        formLabelWidth: '120px'
      }
    },
    methods: {
      refresh() {
        let params = {};
        refreshVersion(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data
          } else {
            this.$alert(response.msg, this.title,{center:true})
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //获取用户列表
      getList() {
        let params = {};
        getVersionList(params).then(response => {
          this.tableData = [];
          this.tableData = response.data;
          this.totalCount = response.data.totalCount
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      }
    },
    activated: function () {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  html {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none;
  }

  /*Chrome下隐藏滚动条，溢出可以透明滚动*/
  html::-webkit-scrollbar {
    width: 0px
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 12px;
    height: 16px;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background: #f6f6f6;
    border-radius: 2px;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 2px;
  }

  .m_l_15 {
    margin-left: 15px;
  }

  .el-header, .el-main, .el-footer {
    padding: 0;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 0;
    line-height: 40px;
    span {
      display: block;
      float: left;
      width: 100px;
    }
  }

  .box-card {
    margin: 15px auto;
    min-width: 880px;
    max-width: 1200px;
  }

  .box-card-down {
    margin: 15px auto;
    min-width: 880px;
    max-width: 1200px;
    .el-tag {
      display: block;
      text-align: center;
      font-size: 18px;
    }
  }
</style>
