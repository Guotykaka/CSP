<template>
  <div class="type-select">
    <div class="sel_tag">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="1：">
          <el-select class="sel_style" v-model="tag1" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择">
            </el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="2：">
          <el-select class="sel_style" v-model="tag2" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="3：">
          <el-select class="sel_style" v-model="tag3" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择">
            </el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="4：">
          <el-select class="sel_style" v-model="tag4" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="5：">
          <el-select class="sel_style" v-model="tag5" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="6：">
          <el-select class="sel_style" v-model="tag6" size="medium" filterable
                     placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="7：" v-if="addCount>6">
          <el-select class="sel_style" v-model="tag7" size="medium"
                     filterable placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="8：" v-if="addCount>7">
          <el-select class="sel_style" v-model="tag8" size="medium"
                     filterable placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="9：" v-if="addCount>8">
          <el-select class="sel_style" v-model="tag9" size="medium"
                     filterable placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="10：" v-if="addCount>9">
          <el-select class="sel_style" v-model="tag10" size="medium"
                     filterable placeholder="请选择">
            <el-option label="请选择" value="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.columnId"
              :label="item.columnName"
              :value="item.columnId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addCount<10">
          <el-button class="sel_style" type="info" size="medium" @click="clearInputData">清 空
          </el-button>
        </el-form-item>
        <el-form-item v-if="addCount<10">
          <el-button v-if="addCount<10" class="sel_style" type="primary" size="medium" @click="showInput">新增选择
          </el-button>
        </el-form-item>
        <el-form-item v-if="addCount<10">
          <el-button v-if="addCount>6" class="sel_style" type="danger" size="medium" @click="clearInput">删除新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tag_btn">
      <el-button type="info" @click="cancleSave">取 消</el-button>
      <el-button type="primary" @click="saveTag">保 存</el-button>
    </div>
  </div>
</template>

<script>
  import {
    ERR_OK,
    newsQueryNewsCategory,
    queryNewsCategoryList,
    saveNewsCategory,
    updateNewsCategory,
    updateNewsCategoryNum,
    updateNewsCategoryStatus,
    queryNewsCategroyNum
  } from '@/api/api.js';
  export default {
    name: "typeSelect",
    data() {
      return {
        options: [],
        selList: [],
        tag1: '',
        tag2: '',
        tag3: '',
        tag4: '',
        tag5: '',
        tag6: '',
        tag7: '',
        tag8: '',
        tag9: '',
        tag10: '',
        addCount: 6,
        numList: []
      }
    },
    methods: {
      /*获取所有咨询栏目序号*/
      getqueryNewsCategroyNum() {
        let params = {}
        queryNewsCategroyNum(params).then((res) => {
          if (res.code === ERR_OK) {
            this.numList = res.data;
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*获取所有咨询栏目列表*/
      getCategoryList() {
        queryNewsCategoryList({}).then((res) => {
          if (res.code === ERR_OK) {
            this.options = res.data;
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*清空选择*/
      clearInputData() {
        this.tag1 = '';
        this.tag2 = '';
        this.tag3 = '';
        this.tag4 = '';
        this.tag5 = '';
        this.tag6 = '';
        this.tag7 = '';
        this.tag8 = '';
        this.tag9 = '';
        this.tag10 = '';
        this.selList = []
      },
      showInput() {
        this.addCount++;
      },
      clearInput() {
        this.addCount--;
        if(this.addCount<7){
          this.tag7='请选择'
        }
        if(this.addCount<8){
          this.tag8='请选择'
        }
        if(this.addCount<9){
          this.tag9='请选择'
        }
        if(this.addCount<10){
          this.tag10='请选择'
        }
      },
      /*取消保存*/
      cancleSave() {
        this.$emit('handleClick','four');
      },
      /*保存*/
      saveTag() {
        let list = [];
        if (this.tag1 === '' || this.tag1 === '请选择') {
          this.$alert('请选择第一个推荐', '提示');
          return;
        } else if (this.tag2 === '' || this.tag2 === '请选择') {
          this.$alert('请选择第二个推荐', '提示');
          return;
        } else if (this.tag3 === '' || this.tag3 === '请选择') {
          this.$alert('请选择第三个推荐', '提示');
          return;
        } else if (this.tag4 === '' || this.tag4 === '请选择') {
          this.$alert('请选择第四个推荐', '提示');
          return;
        } else if (this.tag5 === '' || this.tag5 === '请选择') {
          this.$alert('请选择第五个推荐', '提示');
          return;
        } else if (this.tag6 === '' || this.tag6 === '请选择') {
          this.$alert('请选择第六个推荐', '提示');
          return;
        }
        list.push(this.tag1);
        list.push(this.tag2);
        list.push(this.tag3);
        list.push(this.tag4);
        list.push(this.tag5);
        list.push(this.tag6);
        if (this.addCount > 6) {
          if (this.tag7 === '') {
            this.$alert('请选择第七个推荐', '提示');
            return;
          }
        }
        if (this.addCount > 7) {
          if (this.tag8 === '') {
            this.$alert('请选择第八个推荐', '提示');
            return;
          }
        }
        if (this.addCount > 8) {
          if (this.tag9 === '') {
            this.$alert('请选择第九个推荐', '提示')
            return;
          }
        }
        if (this.addCount > 9) {
          if (this.tag10 === '') {
            this.$alert('请选择第10个推荐', '提示')
            return;
          }
        }
        if (this.tag7 !== '' && this.tag7 !== '请选择') {
          list.push(this.tag7);
        }
        if (this.tag8 !== '' && this.tag8 !== '请选择') {
          list.push(this.tag8);
        }
        if (this.tag9 !== '' && this.tag9 !== '请选择') {
          list.push(this.tag9);
        }
        if (this.tag10 !== '' && this.tag10 !== '请选择') {
          list.push(this.tag10);
        }
        let params = {
          list: list
        };
        updateNewsCategoryNum(params).then((res) => {
          if (res.code === ERR_OK) {
            this.$alert('保存成功')
            this.$emit('handleClick','four')
          } else {
            this.$alert(res.msg, '提示')
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试')
        })
      }
    },
    watch: {
      numList() {
        this.addCount = this.numList.length;
        if (this.numList.length > 0) {
          this.numList.forEach((v) => {
            if (v.orderNum === 1) {
              this.tag1 = v.columnId;
              return;
            }
            if (v.orderNum === 2) {
              this.tag2 = v.columnId;
              return;
            }
            if (v.orderNum === 3) {
              this.tag3 = v.columnId;
              return;
            }
            if (v.orderNum === 4) {
              this.tag4 = v.columnId;
              return;
            }
            if (v.orderNum === 5) {
              this.tag5 = v.columnId;
              return;
            }
            if (v.orderNum === 6) {
              this.tag6 = v.columnId;
              return;
            }
            if (v.orderNum === 7) {
              this.tag7 = v.columnId;
              return;
            }
            if (v.orderNum === 8) {
              this.tag8 = v.columnId;
              return;
            }
            if (v.orderNum === 9) {
              this.tag9 = v.columnId;
              return;
            }
            if (v.orderNum === 10) {
              this.tag10 = v.columnId;
              return
            }
          })
        }
      },
      tag1(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j] === oldvalue) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j] === oldvalue) {
                  this.selList.splice(j, 1);
                }
              }
              this.tag1 = ''
            }
          }
        }
      },
      tag2(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j] === oldvalue) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j] === oldvalue) {
                  this.selList.splice(j, 1);
                }
              }
              this.tag2 = ''
            }

          }
        }
      },
      tag3(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag3 = ''
          }
        }
      },
      tag4(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag4 = ''
          }
        }
      },
      tag5(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag5 = ''
          }
        }
      },
      tag6(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag6 = ''
          }
        }
      },
      tag7(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag7 = ''
          }
        }
      },
      tag8(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag8 = ''
          }
        }
      },
      tag9(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag9 = ''
          }
        }
      },
      tag10(newvalue, oldvalue) {
        let ss = true;
        if (newvalue) {
          for (var i = 0; i < this.selList.length; i++) {
            if (this.selList[i] === newvalue) {
              this.$alert('请勿重复选择', '提示');
              ss = false
            }
          }
          if (ss) {
            if (newvalue !== '请选择') {
              this.selList.push(newvalue)
            }
            if (oldvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                  return;
                }
              }
            }
          } else {
            if (newvalue) {
              for (var j = 0; j < this.selList.length; j++) {
                if (this.selList[j].indexOf(oldvalue) === 0) {
                  this.selList.splice(j, 1);
                }
              }
            }
            this.tag10 = ''
          }
        }
      }
    },
    activated() {
      this.getCategoryList();
      this.getqueryNewsCategroyNum();
    },
    component: {}
  }
</script>

<style scoped lang="less">
  .type-select {
    width:100%;
    .sel_tag {
      font-size: 0;
    }
    .sel_style {
      margin-right: 10px;
    }
    .tag_btn {
      width:100%;
      position: fixed;
      bottom: 20px;
      left: 250px;
      right: 0;
      margin-left:-160px;
      text-align: center;
    }
  }
</style>
