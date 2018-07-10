<template>
  <div class="msg">
    <div class="page-wrapper">
      <el-table
        :data="msgList.data"
        border
        :header-row-class-name="headerStyle"
        :cell-style="rowStyle"
        highlight-current-row
        empty-text="暂无数据"
        style="width: 100%;border:1px solid #e5e5e5;">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="newsTitle"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="unReadCount"
          label="未读消息">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="medium">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
  import headerTop from "@/components/headTop.vue"
  import {mapState} from 'vuex';

  export default {
    components: {
      headerTop,
    },
    data() {
      return {}
    },
    methods: {
      rowStyle(row, rowIndex) {
        let obj = {
          padding:0,
          color:'#444'
        }
        return obj;
      },
      headerStyle(row, rowIndex) {
        return 'tablStyle';
      },
      deleteRow(index, rows) {
        if (index === 0) {
          this.$router.push('./tel_consult')//电话报告解读
        } else if (index === 1) {
          this.$router.push('./imgText_consult')//图文咨询
        } else if (index === 2) {
          this.$router.push('./manage')
        }
      }
    },
    computed: {
      ...mapState({
        msgList: state => state.msgList
      })
    },
  }
</script>

<style scoped lang="less">
  .msg {
    line-height: 32px;
    .page-wrapper {
      background-color: #e5e5e5;
      padding:0;
    }
  }
</style>
<style lang="less">
  .el-table {
    .tablStyle {
      background-color:#e5e5e5!important;
      color:#333;
    }
  }
</style>
