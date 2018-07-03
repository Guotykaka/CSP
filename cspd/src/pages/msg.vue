<template>
  <div class="msg">
    <div class="page-wrapper">
      <el-table
        :data="tableData"
        border
        empty-text="暂无数据"
        style="width: 100%;border:1px solid #999;">
        <el-table-column
          type="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="date"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="name"
          label="未读消息">
        </el-table-column>
        <el-table-column
          prop="address"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
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
    export default {
      components: {
        headerTop,
      },
      data() {
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
          blue:{'color':'#c4e'}
        }
      },
      methods: {
        deleteRow(index, rows) {
          console.log(index);
          console.log(rows);
          console.log(rows[index])
          if(index===0){
            this.$router.push('./tel_consult')//电话报告解读
          }else if(index===1){
            this.$router.push('./imgText_consult')//图文咨询
          }else if(index===2){
            this.$router.push('./manage')
          }
        }
      },
    }
</script>

<style scoped lang="less">
.msg{
  line-height:32px;
  .page-wrapper{
    background-color:#e5e5e5;
  }
}
</style>
