<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
        <el-header height="30">
          <el-row style="margin-top: 20px;">
            <el-col :span="24" :offset="0">
               <el-form  :inline="true" :model="formInline" class="" style="height:30px;">
                  <el-form-item>
                    <el-input size="small"  placeholder="用户名"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" icon="el-icon-search">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary">查看</el-button>
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-plus">新增</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-edit-outline">修改</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-delete">删除</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-refresh">重置密码</el-button>
                  </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        
        </el-header>
        <el-main>
          <template>
            <el-table :data="tableData" border style="width: 100%" id="app">
              <el-table-column align="center" prop="Id" label="Id" width="50"></el-table-column>
              <el-table-column align="center" prop="name" label="用户名" width="100"></el-table-column>
              <el-table-column align="center" prop="address" label="所属部门"></el-table-column>
              <el-table-column align="center" prop="mail" label="邮箱"></el-table-column>
              <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
              <el-table-column align="center" prop="state" label="状态">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium" type="success">{{ scope.row.state }}</el-tag>
                    </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="creatTime" label="创建时间"></el-table-column>
              <el-table-column align="center" label="操作" width="218">
                <template slot-scope="scope">
                  <el-button size="mini" type="info" @click="dialogFormVisible = true">查看</el-button>
                  <!-- 查看dialog -->
                  <el-dialog title="查看" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                      <el-form-item label="活动名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="活动区域" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择活动区域">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    </div>
                  </el-dialog>
                  
                  <el-button size="mini" type="primary">修改</el-button>
                  <el-button size="mini" type="danger" @click="deleteMessage()">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
        <el-footer  height="30px">
          <el-row style="margin-top: 20%;">
            <el-col :span="24" :offset="6">
              <template>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
                  </el-pagination>
              </template>
            </el-col>
          </el-row>
        </el-footer>
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
          currentPage1: 5,
          currentPage2: 5,
          currentPage3: 5,
          currentPage4: 4,
          dialogFormVisible: false,
        tableData: [{
          Id:1,
          creatTime: '2016-05-02',
          name: 'admin',
          address: '好卓公司',
          phone: '13764009077',
          state: '正常',
          mail:'2508938@qq.com',
        }, {
          Id:2,
          creatTime: '2016-05-04',
          name: 'test',
          address: '技术部',
          phone: '13764009077',
          state: '正常',
          mail:'2508938@qq.com',
        }, {
          Id:3,
          creatTime: '2016-05-01',
          name: 'test2',
          address: '运营部',
          phone: '13764009077',
          state: '正常',
          mail:'2508938@qq.com',
        }, {
          Id:4,
          creatTime: '2016-05-03',
          name: 'doctor',
          address: '健管部',
          phone: '13764009077',
          state: '正常',
          mail:'2508938@qq.com',
        }]
      }
    },
     methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
       deleteMessage() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning ',
            message: '已取消删除'
          });
        });
      }
    },
  }
 
</script>

<style scoped>

</style>
