<template>
  <div>
    <el-table
      ref="singleTable"
      :show-header="false"
      :data="dataList"
      highlight-current-row
      :default-sort="{prop: 'orderNum'}"
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <menu-list-son v-if="props.row.list.length>0" :dataList="props.row.list"></menu-list-son>
        </template>
      </el-table-column>
      <el-table-column
        property="menuId"
        label="ID"
        width="120">
      </el-table-column>

      <el-table-column
        property="name"
        label="菜单名称"
        width="120">
      </el-table-column>

      <el-table-column
        property="parentName"
        label="上级菜单"
        width="120">
      </el-table-column>

      <el-table-column
        property="icon"
        width="120"
        label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <el-table-column
        property="type"
        width="120"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===0">目录</el-tag>
          <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        property="orderNum"
        width="120"
        label="排序">
      </el-table-column>
      <el-table-column
        property="url"
        width="200"
        label="菜单URL">
      </el-table-column>

      <el-table-column
        property="perms"
        label="授权标识">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
          <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "MenuListSon",
    props:{
      dataList:Array
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange',val)
      },
      handleClickTable(val){
        this.$emit('handleClickTable',val);
      }
    },
  }
</script>

<style scoped>

</style>
