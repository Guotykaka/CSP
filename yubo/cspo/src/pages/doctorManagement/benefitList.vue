<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">
      <el-card class="box-card">
        <div slot="header" class="clear">
          <span>分成比例</span>
          <el-button type="primary" size="small" class="right" @click="showDialogBenefit">新增</el-button>
        </div>
        <div class="">
          <!--table 表单开始-->
          <el-table :data="benefitDataList" border :row-class-name="tableRowClassName" style="width: 100%">
            <el-table-column show-overflow-tooltip type="index" label="序号" width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="proportions" label="分成比例"></el-table-column>
            <el-table-column show-overflow-tooltip prop="takeEffectTime" label="生效时间"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="设置时间"></el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.takeEffectStatus==1" size="mini" type="danger" @click="_deleteBenefit(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--table 表单结束-->
          <div class="self-page-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10,20]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-card>
      <div class="btn-row">
        <el-button size="small" type="primary" @click="backFn">返回</el-button>
      </div>

      <!--新增分成比例dialog-->
      <el-dialog title="新增分成比例" :visible.sync="isShowDialog" width="820px">
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">财务分成比例：</strong>
          </el-col>
          <el-col :span="18">
            平台：&nbsp;机构：&nbsp;医生&nbsp;&nbsp;=&nbsp;&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.platformRate" placeholder="输入整数"/>：&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.institutionRate" placeholder="输入整数"/>：&nbsp;
            <input type="number" class="input-benefit el-input__inner" v-model="benefitRate.doctorRate" placeholder="输入整数"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">&nbsp;</el-col>
          <el-col :span="18">
            <p class="notice-text">三项比例之和为100</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="m_b_15">
          <el-col :span="6" style="text-align: right">
            <strong class="title-note">生效时间：</strong>
          </el-col>
          <el-col :span="18">
            <el-date-picker v-model="takeEffectTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
            </el-date-picker>
          </el-col>
        </el-row>

        <div class="btn-row">
          <el-button size="small" type="primary" @click="_addBenefiItem">确定</el-button>
          <el-button size="small" type="primary" @click="closeDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import headerTop from '@/components/headTop.vue';
import { mapGetters } from "vuex";

//引入getDoctorList的方法
import {getInsProportionsList,addProportionItem,deleteProportionItem,ERR_OK} from "@/api/api.js";

export default {
  data(){
    return{

      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      searchParams:{
        pageSize:10,
        currentPage:1,
        providerServiceUserId:"",
        providerServiceUserType:1
      },
      isShowDialog:false,
      totalCount:0,
      benefitDataList:[],

      //分成比例，平台 机构 医生
      benefitRate:{
        platformRate:"",
        institutionRate:"",
        doctorRate:""
      },
      takeEffectTime:"",//生鲜时间
      proportions:"",//分成比例拼接字符串逗号分隔
    }
  },

  methods:{
    //获取分成比例数据
    getBenefitLists(){
      var params={
        currentPage:this.searchParams.currentPage,
        pageSize:this.searchParams.pageSize,
        providerServiceUserId: this.$route.params.id,
        providerServiceUserType:this.searchParams.providerServiceUserType,
      };
      getInsProportionsList(params).then(res => {
        if(res.code===ERR_OK){
          this.isShowDialog=false;
          this.benefitDataList=res.data.list;
          this.totalCount=res.data.totalCount;
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },

    //分成比例返回
    backFn(){
      window.history.go(-1)
    },

    //分页处理每页显示条数方法
    handleSizeChange(val){
      this.searchParams.pageSize=val;
      this.getBenefitLists();
    },

    //当前页码变化方法
    handleCurrentChange(val){
      this.searchParams.currentPage=val;
      this.getBenefitLists();
    },
    tableRowClassName({row, rowIndex}) {
      if(row.takeEffectStatus === '2'){
        return 'active'
      }else {
        return ''
      }
    },

    //关闭dialog
    closeDialog(){
      this.isShowDialog=false;
    },

    //显示分成比例dialog
    showDialogBenefit(){
      this.isShowDialog=true;
    },

    //增加分成比例
    _addBenefiItem(){
      if(!this.benefitRate.platformRate){
        this.$alert("平台分成不能为空", '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      if(this.benefitRate.platformRate.indexOf(".") > -1){
        this.$alert("平台分成不能为小数", '提示', {
          confirmButtonText: '确定',
        });
        return
      }

      if(!this.benefitRate.institutionRate){
        this.$alert("机构分成不能为空", '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      if(this.benefitRate.institutionRate.indexOf(".") > -1){
        this.$alert("机构分成不能为小数", '提示', {
          confirmButtonText: '确定',
        });
        return
      }

      if(!this.benefitRate.doctorRate){
        this.$alert("医生分成不能为空", '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      if(this.benefitRate.doctorRate.indexOf(".") > -1){
        this.$alert("医生分成不能为小数", '提示', {
          confirmButtonText: '确定',
        });
        return
      }

      if(parseInt(this.benefitRate.platformRate)+parseInt(this.benefitRate.institutionRate)+parseInt(this.benefitRate.doctorRate) !==100){
        this.$alert("比例之和要为100", '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      if(!this.takeEffectTime){
        this.$alert("请设置生效时间", '提示', {
          confirmButtonText: '确定',
        });
        return
      }

      var id=this.$route.params.id,userId=this.$route.params.userId;
      var proportions=this.benefitRate.platformRate+","+this.benefitRate.institutionRate+","+this.benefitRate.doctorRate;
      var params={
        providerServiceUserId:id,
        userId:userId,
        takeEffectTime:this.takeEffectTime,
        proportions:proportions,
        providerServiceUserType: 1
      };

      addProportionItem(params).then(res => {
        if(res.code===ERR_OK){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.isShowDialog=false;
          this.getBenefitLists();
        }else{
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
          })
        }
      }).catch(()=>{
        this.$message.error('网络错误!请稍后重试')
      })
    },

    //删除分成
    _deleteBenefit(item){
      this.$confirm('确定要删除吗？')
        .then(_ => {
          let params={
            id:item.insProportionsId
          };
          deleteProportionItem(params).then(res => {
            if(res.code===ERR_OK){
              this.getBenefitLists();

            }else{
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定',
              })
            }
          }).catch(()=>{
            this.$message.error('网络错误!请稍后重试')
          })
        });
    }
  },


  activated: function(){
    this.getBenefitLists();
  },

  components:{
    headerTop
  },

  computed:{
    ...mapGetters(['getDoctorRolesList','getInstitutionArr'])
  }
}
</script>

<style lang="less" scoped>
  .el-select {display: block;}
  .el-input {margin-bottom: 15px;}
  .el-button--mini {padding: 7px 10px;}
  .title-note {line-height: 40px;}
  .btn-row {text-align: center;padding-top: 20px;}
  .service-label-box {padding-top: 12px;line-height: 18px;}
  .service-label {padding: 0 5px 0 3px;}
  .service-label input[type='checkbox'] {margin: 3px 3px 0 0;display: inline-block;vertical-align: top;}
  .input-benefit {display: inline-block;width: 100px;}
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none;}
  input[type='number'] {-moz-appearance: textfield;}
  .notice-text{color:red;font-size: 12px;}
</style>
