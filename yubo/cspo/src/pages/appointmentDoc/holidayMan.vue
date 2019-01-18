<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <!-- 服务页面 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="节假日名称：">
                <el-input v-model="searchParams.holidayName" size="small" placeholder="请输入节假日名称"
                          @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="节假日所属年份：">
                <el-input v-model="searchParams.holidayYear" size="small" placeholder="请输入节假日所属年份"
                          @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="doSearch()">搜 索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handleAdd()">新 增</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>
        <el-main>
          <!-- 列表 -->
          <template>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column show-overflow-tooltip align="center" type="index" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="holidayName" label="节假日"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="holidayYear" label="年份"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="offDayTime" label="时间"></el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="workDayTime" label="上班时间"></el-table-column>
              <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-main>
      </div>
      <!-- 节假日新增弹窗 -->
        <el-dialog title="新增节假日" :visible.sync="dialogAddVisible" width=800px :before-close="handleCloseAdd">
          <el-form :model="addTable" :rules="rulesNew" ref="formNew" :label-width="formLabelWidth">
            <el-form-item label="节假日名称：" prop="holidayName">
              <el-col :span="16">
                <el-input v-model="addTable.holidayName" prop auto-complete="off" el clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="节假日年份：" prop="holidayYear">
              <el-col :span="16">
                <el-input-number v-model="addTable.holidayYear" :min="1" :precision="0" :controls='false' style="width:100%"></el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId">
              <el-col :span="16">
                <el-select v-model="addTable.supplierId" placeholder="请选择">
                  <el-option v-for="item in SupplierList" :key="item.supplierId" :label="item.holidayYear"
                             :value="item.supplierId">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="submitForm('formNew')">保存</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    QueryHolidayList,
    GetProductInfo,
    SaveOrChangeExamation,
    GetSupplierSelect,
    DeleteHoliday,
    GetAllTagsTao,
  } from '@/api/api.js'
  import {getStore, EncodeUserId, IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        SupplierList:[],
        searchParams: {
          holidayName: '',
          holidayYear:''
        },
        tableData: [], //列表数据
        addTable: {
          forPeopleType: 1,
          initialQuantity: 0,
          keyWord: "",
          commTagDetailEntities: [],
          modelType: "60",
          productDesc: "",
          productIcon: "",
          productId: "",
          productMainPicture: "",
          holidayName: "",
          originPrice: 0,
          productPrice: 0,
          productUnix: "元",
          roleId: "",
          supplierId: "",
          useOs: 1,
          userId: ""
        }, //供应链商品新增单个数据
        dialogEditVisible: false, //供应链商品修改
        dialogAddVisible: false, //供应链商品新增
        formLabelWidth: '120px',
        rulesNew: {
          holidayName: [
            {required: true, message: '请填写商品名称', trigger: 'blur'}
          ],
          productDesc: [
            {required: true, message: '请填写商品描述', trigger: 'change'}
          ],
          productIcon: [
            {required: true, message: '请上传商品头图', trigger: 'blur'}
          ],
          productMainPicture: [
            {required: true, message: '请上传商品主图', trigger: 'blur'}
          ],
          originPrice: [
            {required: true, message: '请填写商品原价', trigger: 'blur'}
          ],
          productPrice: [
            {required: true, message: '请填写商品现价', trigger: 'blur'}
          ],
          supplierId: [
            {required: true, message: '请选择供应商', trigger: 'change'}
          ],
          commTagDetailEntities: [
            {required: true, message: '请选择绑定标签', trigger: 'blur'}
          ],
          initialQuantity: [
            {required: true, message: '请填写初始售卖数', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
       
    // 获取间隔天数
    getDays(day1, day2) {
	// 获取入参字符串形式日期的Date型日期
	var st = day1.getDate();
	var et = day2.getDate();
	
	// 定义返回的数组
	var retArr = [];
 
	// 循环，启动日期不等于结束日期时，进行循环
	while (st.getTime() != et.getTime()) {
		
		// 将启动日期的字符串形式的日期存放进数组
		retArr.push(st.getYMD());
		
		// 取得开始日期的天
		var tempDate = st.getDate();
		
		// 将开始日期st指向构造出的新的日期
		// 新的日期较之前的日期多加一天
		st = new Date(st.getFullYear(), st.getMonth(), st.getDate() + 1);
	}
 
	// 将结束日期的天放进数组
	retArr.push(et.getYMD());
	return retArr
	alert(retArr); // 或可换为return ret;
    },
 
    
      /*供应商商品查询*/
      doSearch() {
        this.getList();
      },
      /*新增*/
      handleAdd() {
        this.time = [];
        this.dialogAddVisible = true;
      },
      /*商品确定新增*/
      _doAdd() {
        let params = {
          forPeopleType: this.addTable.forPeopleType,
          originPrice: this.addTable.originPrice,
          initialQuantity: this.addTable.initialQuantity,
          keyWord: '666',
          selectedTagInfoVOS: this.addTable.commTagDetailEntities,
          modelType: this.addTable.modelType,
          productDesc: this.addTable.productDesc,
          productIcon: this.addTable.productIcon,
          productId: this.addTable.productId,
          productMainPicture: this.addTable.productMainPicture,
          holidayName: this.addTable.holidayName,
          productPrice: this.addTable.productPrice,
          productUnix: this.addTable.productUnix,
          roleId: this.addTable.roleId,
          supplierId: this.addTable.supplierId,
          useOs: this.addTable.useOs,
        };
        SaveOrChangeExamation(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg, '成功', 'success');
            this.getList();
            this.handleCloseAdd();
          } else {
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
      },
      // 取消新增
      _doAddCancel() {
        this.handleCloseAdd();
        this.getList();
        this.$message({
          type: 'warning',
          message: '取消新增'
        });
      },
      submitForm(formName) {
        //新增模块表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            this._doAdd();
          } else {
            return false;
          }
          ;
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleCloseView() {
        this.dialogViewVisible = false;
      },
      handleCloseAdd() {
        //新增弹窗重置数据 beforeclose
        this.resetForm('formNew');
        this.addTable = {
          forPeopleType: 1,
          initialQuantity: 0,
          keyWord: "",
          commTagDetailEntities: [],
          modelType: "60",
          productDesc: "",
          productIcon: "",
          productId: "",
          productMainPicture: "",
          holidayName: "",
          originPrice: 0,
          productPrice: 0,
          productUnix: "元",
          roleId: "",
          supplierId: "",
          useOs: 1,
          userId: ""
        };
        this.dialogAddVisible = false;
      },
      // 删除提示
      deleteMessage(index, row) {
          this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              let params = {
                id: row.holidayId,
              };
              DeleteHoliday(params).then(response => {
                if (response.code === ERR_OK) {
                  this.$notify({
                    title: '成功',
                    message: `删除成功！`,
                    type: 'success'
                  });
                  this.getList()
                } else {
                  IsAlert(response.msg, '错误', 'error');
                }
              }).catch(() => {
                this.$message.error('网络错误!请稍后重试')
              })
            })
            .catch(() => {
              this.$message({
                type: 'warning ',
                message: '已取消删除'
              })
            })
      },
      //获取列表
      getList() {
        let params = {
          holidayName: this.searchParams.holidayName,
          holidayYear: this.searchParams.holidayYear,
        };
        QueryHolidayList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data;
          } else {
            IsAlert('获取节假日列表失败！', '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误，请稍后重试')
        });
      },
    },
    activated: function () {
      this.getList();
    },
    }
    // 给Date对象添加getYMD方法，获取字符串形式的年月日
    Date.prototype.getYMD = function(){
    var retDate = this.getFullYear() + "-";  // 获取年份。
    retDate += this.getMonth() + 1 + "-";    // 获取月份。          
    retDate += this.getDate();               // 获取日。
    return retDate;                          // 返回日期。
    },
    
    // 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
    String.prototype.getDate = function(){
        var strArr = this.split('-');
        var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
        return date;
    }
</script>

<style lang="less" scoped>

  .el-table {
    &__header-wrapper {
      .has-gutter {
        tr > th.gutter {
          display: table !important;
        }
      }
    }
  }
  .el-select {
    display: block;
  }

  .el-date-editor {
    width: 100%;
  }

  .el-input {
    margin-bottom: 15px;
  }

  .link-line {
    position: absolute;
    top: 0;
    right: 70%;
    line-height: 34px;
    width: 25px;
    text-align: center;
  }

  // .el-form-item {margin-bottom: 0}
  // .el-checkbox+.el-checkbox{margin: 0}
  .wordsnum {
    height: 117px;
    /* vertical-align: middle; */
    text-align: center;
    line-height: 117px;

  }

  .m_l_15 {
    margin-left: 15px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding: 0;
  }
  el-table {

      tr > th.gutter {
        display: table !important;

  }
}
</style>
<style lang="less">
  #ResetNDFTHeight {
    min-height: 40px !important;
    line-height: 2 !important;
  }

  .el-form-item {
    &.is-required2 {
      .el-form-item__label {
        &:after {
          content: "*";
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }
  }

  .selector img {
    width: 150%;
  }

  .selpage {
    text-align: center;
    margin-top: 20px;
  }
</style>

