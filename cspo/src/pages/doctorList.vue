<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-header height="30">


      </el-header>
        <el-main>

        <!-- 列表 -->
        <template>
        </template>
      </el-main>

    </div>
  </div>

</template>


<script>
import {getUserlistData} from "@/api/getData.js"
import headerTop from '@/components/headTop.vue'
export default {
  components: {
    headerTop
  },
  data() {
    return {

      selectTable: {},
      params:{
        // _search: false,
        // nd: 1530263589411,
        // limit: 10,
        // page: 1,
        // sidx:"" ,
        // // order: asc,
        // _: 1530263589255

        limit:	5,
        page:	1,
        refundStatus:	0,
        },
      radio: '1',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 1,
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogAddVisible: false,
      checkList: ['选中且禁用', '复选框 A'],

      // 模拟后台数据
      tableData: [
        {
          Id: 1,
          creatTime: '2016-05-02',
          name: 'admin',
          address: '好卓公司',
          phone: '13764009077',
          state: 1,
          mail: '2508938@qq.com',
          // 原数据
          createTime: '2016-11-11 11:11:11',
          deptId: 1,
          deptName: '好卓公司',
          email: '250893328@qq.com',
          mobile: '13764009077',
          password:
            '969d28606deb2d5b498f19b1f142ae7534a3998d30ee4eddd2227c1970892498',
          roleIdList: null,
          salt: 'CbLYM3dU4zAdxBaGnWfW',
          status: 1,
          userId: 1,
          userType: 0,
          username: 'admin',
        },
        {
          Id: 2,
          creatTime: '2016-05-04',
          name: 'test',
          address: '技术部',
          phone: '13764009077',
          state: 2,
          mail: '2508938@qq.com'
        },
        {
          Id: 3,
          creatTime: '2016-05-01',
          name: 'test2',
          address: '运营部',
          phone: '13764009077',
          state: 1,
          mail: '2508938@qq.com'
        },
        {
          Id: 4,
          creatTime: '2016-05-03',
          name: 'doctor',
          address: '健管部',
          phone: '13764009077',
          state: 2,
          mail: '2508938@qq.com'
        }
      ],

      form: {
        name: '111',
        region: '111',
        date1: '111',
        date2: '111',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },

    // 编辑
    handleEdit(index, row) {
      this.selectTable = row
      // this.address.address = row.address;
      this.dialogFormVisible = true
      console.log(this.selectTable)
      // this.selectedCategory = row.category.split('/');
      // if (!this.categoryOptions.length) {
      //     this.getCategory();
      // }
    },

    // 删除提示
    deleteMessage() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          })
        })
    }
  },
  created:function(){


  console.log("created!");
  getUserlistData(this.params)
  }

}
</script>

<style scoped>
.dot {
  width: 100%;
}
</style>
