<template>
  <el-table
    ref="singleTable"
    :data="dataList"
    :show-header="false"
    highlight-current-row
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <son-model
          :dataList="props.row.list"
          @addNextEvl="addNextEvl"
          @handleClickTable="handleClickTable"
          @del="del"
        ></son-model>
      </template>
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      property="dictType"
      align="right"
      label="参数类型">
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      property="dictName"
      label="参数名称"
      width="150">
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      property="code"
      label="参数CODE"
      width="200">
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      property="value"
      width="150"
      label="参数VALUE">
    </el-table-column>

    <el-table-column
      property="dictDes"
      align="center"
      width="200"
      label="参数描述">
    </el-table-column>

    <el-table-column
      label="操作"
      align="center"
      width="300">
      <template slot-scope="scope">
        <el-button @click="addNextEvl(scope.row)" type="primary" size="mini">添加下一级</el-button>
        <el-button @click="handleClickTable(scope.row)" type="success" size="mini">编辑</el-button>
        <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  export default {
    name: "SonModel",
    props:{
      dataList:{
        type:Array,
        default:[]
      }
    },
  methods:{
    addNextEvl(val){
      this.$emit('addNextEvl',val)
    },
    handleClickTable(val){
      this.$emit('handleClickTable',val)
    },
    del(val){
      this.$emit('del',val)
    }
  }
  }
</script>

<style scoped>

</style>
