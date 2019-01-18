<template>
  <el-table
    ref="singleTable"
    :data="dataList"
    :show-header="false"
    highlight-current-row
    style="width: 100%">
    <el-table-column type="expand" v-if="statusShow">
      <template slot-scope="props">
        <son-model
          :dataList="props.row.childMenus"
          @addNextEvl="addNextEvl"
          @handleClickTable="handleClickTable"
          @del="del"
        ></son-model>
      </template>
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align="right"
      label="">
    </el-table-column>

    <el-table-column
      property="menuName"
      label="菜单名称"
      width="120">
    </el-table-column>

    <!--<el-table-column
      property="parentName"
      label="上级菜单"
      width="120">
    </el-table-column>-->

    <el-table-column
      property="icon"
      width="120"
      label="图标">
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>

    <!--<el-table-column
      property="type"
      width="120"
      label="类型">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type===0">目录</el-tag>
        <el-tag v-if="scope.row.type===1" type="success">菜单</el-tag>
        <el-tag v-if="scope.row.type===2" type="warning">按钮</el-tag>
      </template>
    </el-table-column>-->

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

    <!--<el-table-column
      property="perms"
      label="授权标识">
    </el-table-column>-->
    <el-table-column
      align="center"
      label="操作"
      width="300">
      <template slot-scope="scope">
        <el-button @click="addNextEvl(scope.row)" type="success" size="mini">添加下一级</el-button>
        <el-button @click="handleClickTable(scope.row)" type="primary" size="mini">修改</el-button>
        <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  export default {
    name: "SonModel",
    props: {
      dataList: {
        type: Array
      }
    },
    data() {
      return {
        statusShow: true
      }
    },
    methods: {
      addNextEvl(val) {
        this.$emit('addNextEvl', val)
      },
      handleClickTable(val) {
        this.$emit('handleClickTable', val)
      },
      del(val) {
        this.$emit('del', val)
      }
    },
    watch: {
      dataList() {
        if (this.dataList.childMenus.length > 0) {
          this.statusShow = true;
        } else {
          this.statusShow = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
