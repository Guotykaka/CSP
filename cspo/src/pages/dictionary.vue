<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container dictionary" v-cloak>
      <div class="pagebox">
        <el-row>
          <el-button type="primary" @click="addOnceEvl">新增一级参数</el-button>
        </el-row>
        <div class="table-style">
          <el-table
            ref="singleTable"
            :data="formatDataa"
            header-align="left"
            highlight-current-row
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  ref="singleTable"
                  :data="props.row.list"
                  :show-header="false"
                  highlight-current-row
                  style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-table
                        ref="singleTable"
                        :data="props.row.list"
                        :show-header="false"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column type="expand">
                          <template slot-scope="props">
                            <el-table ref="singleTable" :data="props.row.list" :show-header="false"
                              highlight-current-row
                              style="width: 100%">
                              <el-table-column property="dictType" label="参数类型"></el-table-column>
                              <el-table-column property="dictName" label="参数名称" width="150"></el-table-column>
                              <el-table-column property="code" label="参数CODE" width="200"> </el-table-column>
                              <el-table-column property="value" width="150" label="参数VALUE"> </el-table-column>
                              <el-table-column property="dictDes" align="center" width="200" label="参数描述"> </el-table-column>
                              <el-table-column label="操作" align="center" width="300">
                                <template slot-scope="scope">
                                  <el-button @click="addNextEvl(scope.row)" type="primary" size="mini">添加下一级</el-button>
                                  <el-button @click="handleClickTable(scope.row)" type="success" size="mini">编辑</el-button>
                                  <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                          </template>
                        </el-table-column>
                        <el-table-column
                          property="dictType"
                          label="参数类型">
                        </el-table-column>

                        <el-table-column
                          property="dictName"
                          label="参数名称"
                          width="150">
                        </el-table-column>

                        <el-table-column
                          property="code"
                          label="参数CODE"
                          width="200">
                        </el-table-column>

                        <el-table-column
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
                  </el-table-column>

                  <el-table-column
                    property="dictType"
                    label="参数类型">
                  </el-table-column>

                  <el-table-column
                    property="dictName"
                    label="参数名称"
                    width="150">
                  </el-table-column>

                  <el-table-column
                    property="code"
                    label="参数CODE"
                    width="200">
                  </el-table-column>

                  <el-table-column
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
            </el-table-column>

            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="48">
            </el-table-column>.

            <el-table-column
              property="dictType"
              label="参数类型"
              width="200">
            </el-table-column>

            <el-table-column
              property="dictName"
              label="参数名称"
              width="150">
            </el-table-column>

            <el-table-column
              property="code"
              label="参数CODE"
              width="200">
            </el-table-column>

            <el-table-column
              property="value"
              width="150"
              label="参数VALUE">
            </el-table-column>

            <el-table-column
              property="dictDes"
              align="center"
              label="参数描述"
              width="200"
            >
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
        </div>
      </div>
      <el-dialog :title="titleName" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="参数类别" :label-width="formLabelWidth">
            <el-input v-model="form.dictType" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数名称" :label-width="formLabelWidth">
            <el-input v-model="form.dictName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数CODE" :label-width="formLabelWidth">
            <el-input v-model="form.code" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数值" :label-width="formLabelWidth">
            <el-input v-model="form.value" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.dictDes" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input type="number" v-model="form.sort" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delSubmit">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import headerTop from '@/components/headTop.vue';
  import {getStore} from "@/config/mUtils";
  import {
    ERR_OK,
    deleteDictionary,//删除字典列表数据
    getDictionaryByKey,//根据key获取字典列表数据详情
    getDictionaryInfo,//获取字典列表数据详情
    listDictionary,//获取字典列表数据
    saveOrUpdateDictionary,//保存字典
  } from '@/api/api';

  export default {
    name: 'menuList',
    components: {
      headerTop
    },
    data() {
      return {
        currentRow: null,
        userInfo:{},//用户信息
        menuList: [],//对应模块菜单
        allmenuList:[],//所有菜单
        allmenuLista:[],
        formatDataa: [],
        show: true,
        activeName: 'zero',
        menuParams: {
          id: '1'
        },//菜单参数
        form: {
          code: "",
          dictDes: "",
          dictName: "",
          dictType: "",
          // id: "string",新增一级不用加,下一级要加
          parentId: null,
          sort: 0,
          userId: 0,
          value: ""
        },
        cardStyle: {
          width: '80%',
          margin: '0 auto'
        },
        categoryList:[],//菜单类别
        titleName:'',//新增&修改
        count: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        defaultProps: {
          children: 'list',
          label: 'name',
          isLeaf: false
        },
        leafOnly: true
      };
    }
    ,
    created() {
      this.userInfo = JSON.parse(getStore('userMesage'))
      this.getMenuList();
    },
    methods: {
      //form数据初始化
      formInit(){
        this.form ={
          code: "",
          dictDes: "",
          dictName: "",
          dictType: "",
          parentId: null,
          sort: 0,
          userId: 0,
          value: ""
        }
      },
      //添加下一级
      addNextEvl(row) {
        this.titleName = '添加下一级'
        this.dialogFormVisible = true;
        this.form = {
          code: "",
          dictDes: "",
          dictName: "",
          dictType: "",
          parentId: row.id,
          sort: 0,
          userId: 0,
          value: ""
        };
        this.form.userId = this.userInfo.userId;
      },
      //选中一行修改
      handleClickTable(row) {
        this.titleName = '编辑';
        this.dialogFormVisible=true;
        this.form = {
          code: row.code,
          dictDes: row.dictDes,
          dictName: row.dictName,
          dictType: row.dictType,
          id: row.id,//新增一级不用加,下一级要加
          parentId: row.parentId,
          sort: row.sort,
          userId: '',
          value: row.value
        };
        this.form.userId = this.userInfo.userId;
      },
      //选中一行删除
      del(row) {
        let that=this,
          params ={
            "id": row.id
          }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDictionary(params).then((res) => {
            if (res.code === ERR_OK) {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
              that.getMenuList();
            } else {
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        //
      },
      //获取字典列表数据
      getMenuList() {
        let params = {};
        listDictionary(params).then((res) => {
          if (res.code === ERR_OK) {
            this.menuList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      //获取字典数据
      getdictionaryData(){
        let typeParams = {
          type:'MENU_TYPE'
        };
        //获取字典列表数据详情
        getDictionaryInfo(typeParams).then((res) => {
          if (res.code === ERR_OK) {
            this.categoryList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
        let params = {
          category:this.form.category
        };
        //根据key获取字典列表数据详情
        getDictionaryByKey(params).then((res) => {
          if (res.code === ERR_OK) {
            this.allmenuList = res.data;
          } else {
            this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
      addOnceEvl() {
        this.titleName = '新增一级菜单';
        this.dialogFormVisible=true;
        this.form.userId = this.userInfo.userId;
      },
      //保存
      onSubmit() {
        let that = this;
        if(this.form.dictType===''){
          this.$alert('菜单名称不能为空')
          return;
        }else if(this.form.dictName===''){
          this.$alert('请选择上级菜单名称');
          return;
        }
        saveOrUpdateDictionary(that.form).then((res)=>{
          if(res.code===ERR_OK){
            that.$alert(res.msg);
            that.dialogFormVisible=false;
            that.getMenuList();
          }else{
            that.$alert(res.msg)
          }
        });

      },
      //取消创建
      delSubmit(){
        this.dialogFormVisible=false;
        this.formInit()
      }
    },
    watch: {
      formatData(val) {
        let arr = [];
        val.forEach((value, index) => {
          if (!value.parentId) {
            arr.push(value)
          }
        })
        this.formatDataa = arr
      },
      getData(val) {
        let arr = [];
        val.forEach((value, index) => {
          if (value.parentId === -1) {
            arr.push(value)
          }
        })
        this.allmenuLista =arr
      }
    }
    ,
    computed: {
      formatData() {
        let that = this;
        this.menuList.forEach((val, index) => {
          val.list = []
          that.menuList.forEach((v, i) => {
            if (v.parentId === val.id) {
              val.list.push(v)
            }
          });
        });
        return this.menuList
      },
      getData() {
        let that = this;
        this.allmenuList.forEach((val, index) => {
          val.list = []
          that.allmenuList.forEach((v, i) => {
            if (v.parentId === val.menuId) {
              val.list.push(v)
            }
          });
        });
        return this.allmenuList
      }
    }
  }
</script>
<style lang="less">
.el-table__expanded-cell {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      padding-right: 0 !important;
    }
  .setDialog{
    position:relative;
    display:block;
    overflow: auto;
    height:700px;
    .el-dialog__body{
      padding-bottom: 100px;
      .buttons{
        position:fixed;
        bottom:120px;
        left:0;
        right:0;
        text-align: center;
      }
    }
  }
</style>
<style lang="less" scoped>
  .dictionary {
    .table-style {
      margin-top: 20px;
    }
    .box-card {
      width: 700px;
      margin-top: 20px;
    }

  }
</style>
