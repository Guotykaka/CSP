<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container">

      <!-- 短信推送 -->
      <div>
        <el-header height="30">
          <!-- 操作行-->
          <el-row>
            <el-form id="SearchBar" :model="searchParams" :inline="true" class="demo-form-inline">
              <el-form-item label="计划名称：">
                <el-input v-model="searchParams.name" placeholder="请输入计划名称" @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="人群分类：">
                <el-select v-model="searchParams.crowdType" clearable placeholder="--请选择--">
                  <el-option label="团检" value="2"></el-option>
                  <el-option label="个检" value="3"></el-option>
                  <el-option label="全部" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="推送机构：">
                <el-input v-model="searchParams.institutionName" placeholder="请输入机构名称" @keyup.enter.native="doSearch()"
                          clearable></el-input>
              </el-form-item>
              <el-form-item label="执行状态：">
                <el-select v-model="searchParams.status" clearable placeholder="--请选择--">
                  <el-option label="执行中" value="1"></el-option>
                  <el-option label="已结束" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSearch()">查询</el-button>
                <el-button type="primary" @click="handleExcle()">导出Excle</el-button>
                <el-button type="primary" @click="handleAdd()" v-if="tabIndex==='1'">创建计划</el-button>
                <el-button type="primary" @click="dialogLastPushVisible = true" v-if="tabIndex==='5'">创建补发计划</el-button>
                <el-button type="primary" @click="handleAddYun()" v-if="tabIndex==='6'">创建运营短信计划</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>

        <el-main>
          <!--tab nav-->
          <el-tabs v-model="tabIndex" @tab-click="handleClick">
            <el-tab-pane label="一次计划" name="1">
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="crowdType" label="人群分类">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.crowdType === 1">全部</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 2">团检</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 3">个检</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="name" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="messageContent"
                                   label="短信内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="institutionName"
                                   label="推送机构"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="发送时间">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        {{timestampToTime(scope.row.startTime)}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="executeTime"
                                   label="执行时间"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="frontDay"
                                   label="前置天数（总检时间与落地时间差）"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="checkDay"
                                   label="体检报告前置天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="执行状态" min-width="100%">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.status === 1">执行中</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.status === 0">已结束</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" v-if="scope.row.status === 1"
                                 @click="handleAddNext(scope.$index, scope.row)">创建计划
                      </el-button>
                      <el-button size="mini" type="danger" v-if="scope.row.status === 1"
                                 @click="deleteMessage(scope.$index, scope.row)">结束
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="二次计划" name="2">
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="crowdType" label="人群分类">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.crowdType === 1">全部</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 2">团检</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 3">个检</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="name" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="messageContent"
                                   label="短信内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="institutionName"
                                   label="推送机构"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="发送时间（执行时间）">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        {{timestampToTime(scope.row.startTime)}}{{scope.row.executeTime}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="frontDay"
                                   label="前置发送天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="checkDay"
                                   label="体检报告前置天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="执行状态" min-width="100%">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.status === 1">执行中</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.status === 0">已结束</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" v-if="scope.row.status === 1"
                                 @click="deleteMessage(scope.$index, scope.row)">结束
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="补发" name="5">
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="crowdType" label="人群分类">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.crowdType === 1">全部</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 2">团检</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 3">个检</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="name" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="messageContent"
                                   label="短信内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="institutionName"
                                   label="推送机构"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="supplementStartTime"
                                   label="开始时间"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="supplementEndTime"
                                   label="结束时间"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="executeTime"
                                   label="执行时间"></el-table-column>
                  <!-- <el-table-column show-overflow-tooltip align="center" prop="startTime" label="补发日期">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        {{timestampToTime(scope.row.startTime)}}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column show-overflow-tooltip align="center" prop="checkDay"
                                   label="体检报告前置天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="执行状态" min-width="100%">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.status === 1">执行中</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.status === 0">已结束</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <!-- <el-button size="mini" type="primary" v-if="scope.row.status === 1"
                                 @click="handleAddLast(scope.$index, scope.row)">创建计划
                      </el-button> -->
                      <el-button size="mini" type="danger" v-if="scope.row.status === 1"
                                 @click="deleteSupNewPlan(scope.$index, scope.row)">结束
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <!-- <el-tab-pane label="补发二次计划" name="4">
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="crowdType" label="人群分类">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.crowdType === 1">全部</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 2">团检</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 3">个检</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="name" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="messageContent"
                                   label="短信内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="institutionName"
                                   label="推送机构"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="发送时间（执行时间）">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        {{timestampToTime(scope.row.startTime)}}{{scope.row.executeTime}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="frontDay"
                                   label="前置发送天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="checkDay"
                                   label="体检报告前置天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="执行状态" min-width="100%">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.status === 1">执行中</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.status === 0">已结束</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" v-if="scope.row.status === 1"
                                 @click="deleteMessage(scope.$index, scope.row)">结束
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane> -->
            <el-tab-pane label="运营短信" name="6">
              <template>
                <el-table :data="tableData" border style="width: 100%" id="app">
                  <el-table-column show-overflow-tooltip align="center" type="index" label=""></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="crowdType" label="人群分类">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.crowdType === 1">全部</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 2">团检</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.crowdType === 3">个检</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="name" label="计划名称"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="messageContent"
                                   label="短信内容"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="institutionName"
                                   label="推送机构"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="发送时间">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        {{timestampToTime(scope.row.startTime)}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="executeTime"
                                   label="执行时间"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="frontDay"
                                   label="前置天数（总检时间与落地时间差）"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" prop="checkDay"
                                   label="体检报告前置天数"></el-table-column>
                  <el-table-column show-overflow-tooltip align="center" label="执行状态" min-width="100%">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success" v-if="scope.row.status === 1">执行中</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.status === 0">已结束</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" v-if="scope.row.status === 1"
                                 @click="doEdit(scope.$index, scope.row)">编辑
                      </el-button>
                      <el-button size="mini" type="danger" v-if="scope.row.status === 1"
                                 @click="deleteMessage(scope.$index, scope.row)">结束
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
          </el-tabs>
          <!-- 列表 -->


        </el-main>
        <div class="self-page-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="searchParams.currentPage" :page-sizes="[10,20]"
                         :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <!-- 导出Excale -->
      <el-dialog title="导出Excle" :visible.sync="dialogExcleVisible" width=600px :before-close="handleCloseExcle">
        <el-form :model="excleTable">
          <el-form-item label="日期范围:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="excleTable.time"
              @change="getselTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发送机构:" :label-width="formLabelWidth" class="m_b_5">
            <el-select v-model="excleTable.institutionCode" filterable multiple collapse-tags placeholder="请选择发送机构"
                       class="selectnerMsg">
              <el-option v-for="item in InsList" :key="item.institutionCode" :label="item.institutionName"
                         :value="item.institutionCode">
              </el-option>
            </el-select>
            <div style="color:#F56C6C;">不选即全选</div>
          </el-form-item>
          <el-form-item label="计划分类：" :label-width="formLabelWidth">
            <el-select v-model="excleTable.type" clearable placeholder="请选择计划分类" multiple collapse-tags
                       class="selectnerMsg">
              <el-option label="一次计划" value="1"></el-option>
              <el-option label="二次计划" value="2"></el-option>
              <el-option label="补发计划" value="3"></el-option>
              <el-option label="补发二次计划" value="4"></el-option>
            </el-select>
            <div style="color:#F56C6C;">不选即全选</div>
          </el-form-item>
        </el-form>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doHandleExcle()">导出</el-button>
          <el-button size="small" type="primary" @click="handleCloseExcle()">取消</el-button>
        </div>
      </el-dialog>
      <!-- 创建一次计划弹窗 -->
      <el-dialog title="创建一次计划" :visible.sync="dialogAddVisible" width=660px :before-close="handleCloseAdd">
        <el-form :model="addTable" :rules="rulesAddOnce" ref="AddOnce">
          <el-form-item label="人群分类:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addTable.crowdType" label="1">全部</el-radio>
            <el-radio v-model="addTable.crowdType" label="2">团检</el-radio>
            <el-radio v-model="addTable.crowdType" label="3">个检</el-radio>
          </el-form-item>
          <el-form-item label="计划名称:" :label-width="formLabelWidth2" prop="name">
            <el-input v-model="addTable.name" placeholder="请输入计划名称" class="selectnerAdd"></el-input>
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="addTable.messageContent" maxlength='200' @input="conputed_once()">
              </el-input>
              <span>{{conputed_onceNum}}/200</span>
            </el-col>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel = true">选择模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="短信链接:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addTable.linkType" label="1">机构H5</el-radio>
            <el-radio v-model="addTable.linkType" label="2">应用商店</el-radio>
          </el-form-item>
          <!-- <el-form-item label="默认掌上体检发送短信:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addTable.checkSentInstitution" :label="1">是</el-radio>
            <el-radio v-model="addTable.checkSentInstitution" :label="2">否</el-radio>
          </el-form-item> -->
          <el-form-item label="发送机构:" :label-width="formLabelWidth2" prop="institution">
            <!-- <el-select v-model="addTable.institutionCode" filterable multiple collapse-tags placeholder="请选择发送机构" class="selectnerAdd">
                  <el-option v-for="item in InsList" :key="item.institutionCode" :label="item.institutionName" :value="item.institutionCode">
                  </el-option>
            </el-select> -->
            <el-select v-model="addTable.institution" value-key="institutionCode" clearable filterable
                       placeholder="请选择发送机构">
              <el-option v-for="item in InsList" :key="item.institutionCode" :label="item.institutionName"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间:" :label-width="formLabelWidth2" prop="startTime" class="m_b_5">
            <el-date-picker
              v-model="addTable.startTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间:" :label-width="formLabelWidth2" prop="executeTime" class="m_b_5">
            <!-- <el-date-picker
              v-model="addTable.executeTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker> -->
            <el-time-picker
              v-model="addTable.executeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择执行时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="前置天数:" :label-width="formLabelWidth2" prop="frontDay" class="m_b_5">
            <el-input-number v-model="addTable.frontDay" :min="0" :precision="0" placeholder="请输入前置天数"
                             class="elnum"></el-input-number>
            <div v-if="addTable.frontDay&&addTable.startTime" style="color:#F56C6C;">{{chengeTimeOnce}}客户落地到数据中心的时间
            </div>
          </el-form-item>
          <el-form-item label="报告体检时间前置天数:" :label-width="formLabelWidth2" prop="checkDay">
            <el-input-number v-model="addTable.checkDay" :min="0" :precision="0" placeholder="请输入报告体检时间前置天数"
                             class="elnum"></el-input-number>
          </el-form-item>
        </el-form>
        <!-- 短信模板 -->
          <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel"
            append-to-body>
             <el-form :model="addTable" :before-close="conputed_once">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
             <div>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
            </div>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_once()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddPushClear()">清空</el-button>
          <el-button size="small" type="primary" @click="submitForm('AddOnce')">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
        </div>

      </el-dialog>
      <!-- 创建二次计划弹窗 -->
      <el-dialog title="创建二次计划" :visible.sync="dialogNextVisible" width=660px :before-close="handleCloseAddSec">
        <el-form :model="addTable_SEC" :rules="rulesAddSec" ref="AddSec">
          <el-form-item label="人群分类:" :label-width="formLabelWidth2">
            <span v-if="addTable_SEC.crowdType === 1">全部</span>
            <span v-if="addTable_SEC.crowdType === 2">团检</span>
            <span v-if="addTable_SEC.crowdType === 3">个检</span>
          </el-form-item>
          <el-form-item label="计划名称:" :label-width="formLabelWidth2">
            {{addTable_SEC.name}}
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="addTable_SEC.messageContent" maxlength='200' @input="conputed_sec()">
              </el-input>
              <span>{{conputed_secNum}}/200</span>
            </el-col>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel_SEC = true">选择模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="发送机构:" :label-width="formLabelWidth2">
            {{addTable_SEC.institutionName}}
          </el-form-item>
          <el-form-item label="短信链接:" :label-width="formLabelWidth2">
            <span v-if="addTable_SEC.linkType === 1">机构H5</span>
            <span v-if="addTable_SEC.linkType === 2">应用商店</span>
          </el-form-item>
          <!-- <el-form-item label="默认掌上体检发送短信:" :label-width="formLabelWidth2">
            <span v-if="addTable_SEC.checkSentInstitution === 1">是</span>
            <span v-if="addTable_SEC.checkSentInstitution === 2">否</span>
          </el-form-item> -->
          <el-form-item label="执行时间:" :label-width="formLabelWidth2" prop="executeTime" class="m_b_5">
            <el-time-picker
              v-model="addTable_SEC.executeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择执行时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="前置天数:" :label-width="formLabelWidth2" prop="frontDay" class="m_b_5">
            <el-input-number v-model="addTable_SEC.frontDay" :min="0" :precision="0" placeholder="请输入前置天数"
                             class="elnum"></el-input-number>
            <div v-if="addTable_SEC.frontDay" style="color:#F56C6C;">二次计划将在{{chengeTime}}日开始执行</div>
          </el-form-item>
          <el-form-item label="报告体检时间前置天数:" :label-width="formLabelWidth2">
            {{addTable_SEC.checkDay}}
          </el-form-item>
        </el-form>
        <!-- 短信模板 -->
          <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel_SEC"
            append-to-body>
             <el-form :model="addTable_SEC" :before-close="conputed_sec">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_SEC.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_SEC.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_SEC.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_sec()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddClearSec()">清空</el-button>
          <el-button size="small" type="primary" @click="submitFormSec('AddSec')">确定</el-button>
          <el-button size="small" type="primary" @click="_doAddCancelSec()">取消</el-button>
        </div>

      </el-dialog>
      <!-- 创建补发计划弹窗 -->
      <el-dialog title="创建补发计划" :visible.sync="dialogLastPushVisible" width=660px :before-close="handleCloseLastPush">
        <el-form :model="addDataLast" :rules="rulesAddBufa" ref="AddBufa">
          <el-form-item label="人群分类:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addDataLast.crowdType" label="1">全部</el-radio>
            <el-radio v-model="addDataLast.crowdType" label="2">团检</el-radio>
            <el-radio v-model="addDataLast.crowdType" label="3">个检</el-radio>
          </el-form-item>
          <el-form-item label="计划名称:" :label-width="formLabelWidth2" prop="name">
            <el-input v-model="addDataLast.name" placeholder="请输入计划名称" class="selectnerAdd"></el-input>
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="addDataLast.messageContent" maxlength='200' @input="conputed_bufa()">
              </el-input>
              <span>{{conputed_bufaNum}}/200</span>
            </el-col>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel_bufa = true">选择模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="短信链接:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addDataLast.linkType" label="1">机构H5</el-radio>
            <el-radio v-model="addDataLast.linkType" label="2">应用商店</el-radio>
          </el-form-item>
          <!-- <el-form-item label="默认掌上体检发送短信:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addDataLast.checkSentInstitution" :label="1">是</el-radio>
            <el-radio v-model="addDataLast.checkSentInstitution" :label="2">否</el-radio>
          </el-form-item> -->
          <!-- <el-form-item label="发送机构:" :label-width="formLabelWidth2" prop="institution">
            <el-select v-model="addDataLast.institution" value-key="institutionCode" clearable filterable
                       placeholder="请选择发送机构">
              <el-option v-for="item in InsList" :key="item.institutionCode" :label="item.institutionName"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="发送机构:" :label-width="formLabelWidth2" prop="institution">
              <el-select class="orSec" v-model="addDataLast.institution" filterable multiple collapse-tags placeholder="请选择" @change='selectAll'>
                    <el-option v-for="(item,index) in InsList" :key="index" :label="item.institutionName" :value="item.institutionCode">
                    </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="选择日期:" :label-width="formLabelWidth2" prop="Time">
            <el-date-picker
              v-model="addDataLast.Time"
              @change="getTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间:" :label-width="formLabelWidth2" prop="executeTime" class="m_b_5">
            <el-time-picker
              v-model="addDataLast.executeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择执行时间">
            </el-time-picker>
          </el-form-item>
          <!-- <el-form-item label="补发日期:" :label-width="formLabelWidth2" prop="supplementTime" class="m_b_5">
            <el-date-picker
              v-model="addDataLast.supplementTime "
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
            <div v-if="addDataLast.supplementTime " style="color:#F56C6C;">
              将在{{addDataLast.supplementTime}}发送{{addDataLast.startTime}}至{{addDataLast.endTime}}客户落地到数据中心的数据
            </div>
          </el-form-item> -->
          <el-form-item label="报告体检时间前置天数:" :label-width="formLabelWidth2" prop="checkDay">
            <el-input-number v-model="addDataLast.checkDay" :min="0" :precision="0" placeholder="请输入报告体检时间前置天数"
                             class="elnum"></el-input-number>
          </el-form-item>
        </el-form>
        <!-- 短信模板 -->
          <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel_bufa"
            append-to-body>
             <el-form :model="addDataLast" :before-close="conputed_bufa">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addDataLast.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addDataLast.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addDataLast.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_bufa()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddPushClearBufa()">清空</el-button>
          <el-button size="small" type="primary" @click="submitForm('AddBufa')">确定</el-button>
          <el-button size="small" type="primary" @click="_doAddCancelBufa()">取消</el-button>
        </div>

      </el-dialog>
      <!-- 创建补发二次计划弹窗 -->
      <!-- <el-dialog title="创建补发二次计划" :visible.sync="dialogLastVisible" width=660px :before-close="handleCloseAddBufaSec">
        <el-form :model="addTable_last" :rules="rulesAddSec" ref="AddBufaSec">
          <el-form-item label="人群分类:" :label-width="formLabelWidth2">
            <span v-if="addTable_last.crowdType === 1">全部</span>
            <span v-if="addTable_last.crowdType === 2">团检</span>
            <span v-if="addTable_last.crowdType === 3">个检</span>
          </el-form-item>
          <el-form-item label="计划名称:" :label-width="formLabelWidth2">
            {{addTable_last.name}}
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="addTable_last.messageContent" maxlength='200' @input="conputed_last()">
              </el-input>
              <span>{{conputed_lastNum}}/200</span>
            </el-col>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel_last = true">选择模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="发送机构:" :label-width="formLabelWidth2">
            {{addTable_last.institutionName}}
          </el-form-item>
          <el-form-item label="短信链接:" :label-width="formLabelWidth2">
            <span v-if="addTable_last.linkType === 1">机构H5</span>
            <span v-if="addTable_last.linkType === 2">应用商店</span>
          </el-form-item>
          <el-form-item label="默认掌上体检发送短信:" :label-width="formLabelWidth2">
            <span v-if="addTable_last.checkSentInstitution === 1">是</span>
            <span v-if="addTable_last.checkSentInstitution === 2">否</span>
          </el-form-item>
          <el-form-item label="执行时间:" :label-width="formLabelWidth2" prop="executeTime" class="m_b_5">
            <el-time-picker
              v-model="addTable_last.executeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择执行时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="前置天数:" :label-width="formLabelWidth2" prop="frontDay" class="m_b_5">
            <el-input-number v-model="addTable_last.frontDay" :min="0" :precision="0" placeholder="请输入前置天数"
                             class="elnum"></el-input-number>
            <div v-if="addTable_last.frontDay" style="color:#F56C6C;">补发二次计划将在{{chengeBufaTime}}日开始执行</div>
          </el-form-item>
          <el-form-item label="报告体检时间前置天数:" :label-width="formLabelWidth2">
            {{addTable_last.checkDay}}
          </el-form-item>
        </el-form> -->
        <!-- 短信模板 -->
         <!-- <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel_last"
            append-to-body>
             <el-form :model="addTable_SEC" :before-close="conputed_last">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_last()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddClear()">清空</el-button>
          <el-button size="small" type="primary" @click="submitFormSec('AddBufaSec')">确定</el-button>
          <el-button size="small" type="primary" @click="_doAddCancelBufaSec()">取消</el-button>
        </div>
      </el-dialog> -->
      <!-- 创建运营短信计划 -->
      <el-dialog title="创建运营短信" :visible.sync="dialogLastVisible" width=660px :before-close="handleCloseAddYUNYING">
        <el-form :model="addTable_last" :rules="rulesAddOnce" ref="AddOnceYUN">
          <el-form-item label="人群分类:" :label-width="formLabelWidth2" class="is-required">
            <el-radio v-model="addTable_last.crowdType" label="1">全部</el-radio>
            <el-radio v-model="addTable_last.crowdType" label="2">团检</el-radio>
            <el-radio v-model="addTable_last.crowdType" label="3">个检</el-radio>
          </el-form-item>
          <el-form-item label="计划名称:" :label-width="formLabelWidth2" prop="name">
            <el-input v-model="addTable_last.name" placeholder="请输入计划名称" class="selectnerAdd"></el-input>
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="addTable_last.messageContent" maxlength='200' @input="conputed_last()">
              </el-input>
              <span>{{conputed_lastNum}}/200</span>
            </el-col>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel_last = true">选择模板</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="短信链接:" :label-width="formLabelWidth2" class="is-required">
            <!-- <el-radio v-model="addTable_last.linkType" label="1">机构H5</el-radio> -->
            <el-radio v-model="addTable_last.linkType" label="2">应用商店</el-radio>
          </el-form-item>
          <el-form-item label="发送机构:" :label-width="formLabelWidth2" prop="institution">
              <el-select class="orSec" v-model="addTable_last.institution" filterable multiple collapse-tags placeholder="请选择" @change='selectAll2'>
                    <el-option v-for="(item,index) in InsList" :key="index" :label="item.institutionName" :value="item.institutionCode">
                    </el-option>
              </el-select>
          </el-form-item>
          </el-form-item>
          <el-form-item label="开始时间:" :label-width="formLabelWidth2" prop="startTime" class="m_b_5">
            <el-date-picker
              v-model="addTable_last.startTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间:" :label-width="formLabelWidth2" prop="executeTime" class="m_b_5">
            <!-- <el-date-picker
              v-model="addTable.executeTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker> -->
            <el-time-picker
              v-model="addTable_last.executeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择执行时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="前置天数:" :label-width="formLabelWidth2" prop="frontDay" class="m_b_5">
            <el-input-number v-model="addTable_last.frontDay" :min="0" :precision="0" placeholder="请输入前置天数"
                             class="elnum"></el-input-number>
            <div v-if="addTable_last.frontDay&&addTable_last.startTime" style="color:#F56C6C;">{{chengeTimeYun}}客户落地到数据中心的时间
            </div>
          </el-form-item>
          <el-form-item label="报告体检时间前置天数:" :label-width="formLabelWidth2" prop="checkDay">
            <el-input-number v-model="addTable_last.checkDay" :min="0" :precision="0" placeholder="请输入报告体检时间前置天数"
                             class="elnum"></el-input-number>
          </el-form-item>
        </el-form>
        <!-- 短信模板 -->
          <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel_last"
            append-to-body>
             <el-form :model="addTable_SEC" :before-close="conputed_last">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="addTable_last.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_last()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddPushClearYUNYING()">清空</el-button>
          <el-button size="small" type="primary" @click="submitForm('AddOnceYUN')">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancelYUN()">取消</el-button>
        </div>

      </el-dialog>
      <!-- 编辑运营短信计划 -->
      <el-dialog title="编辑运营短信" :visible.sync="dialogEditLast" width=660px :before-close="handleCloseAddYUNYINGedit">
        <el-form :model="editTable_last" :rules="rulesEdit" ref="AddOnceYUNedit">
          <el-form-item label="内容:" :label-width="formLabelWidth2" prop="messageContent">
            <el-col :span="14">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入短信内容"
                v-model="editTable_last.messageContent" maxlength='200' @input="conputed_last_edit()" readonly>
              </el-input>
              <span>{{conputed_lastNum_edit}}/200</span>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label=" " :label-width="formLabelWidth2">
            <el-col :span="18">
              <el-button size="small" type="primary" @click="MsgModel_last_edit = true">选择模板</el-button>
            </el-col>
          </el-form-item> -->
          <el-form-item label="发送机构:" :label-width="formLabelWidth2" prop="institution">
              <el-select class="orSec" v-model="editTable_last.institution" filterable multiple collapse-tags placeholder="请选择" @change='selectAll3'>
                    <el-option v-for="(item,index) in InsList" :key="index" :label="item.institutionName" :value="item.institutionCode">
                    </el-option>
              </el-select>
          </el-form-item>
          </el-form-item>
        </el-form>
        <!-- 短信模板 -->
          <el-dialog
            width="500px"
            title="短信模板"
            :visible.sync="MsgModel_last_edit"
            append-to-body>
             <el-form :model="addTable_SEC" :before-close="conputed_last_edit">
                <el-form-item class="msgFlax" label="1." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="editTable_last.messageContent" :label="MsgList[0]">{{MsgList[0]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="2." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="editTable_last.messageContent" :label="MsgList[1]">{{MsgList[1]}}</el-radio>
                </el-form-item>
                <el-form-item class="msgFlax" label="3." :label-width="formLabelWidth3">
                  <el-radio class="message" v-model="editTable_last.messageContent" :label="MsgList[2]">{{MsgList[2]}}</el-radio>
                </el-form-item>
             </el-form>
              <ul>
                <li>注：</li>
                <li class="m_l_30">${checkDate}为到检时间；</li>
                <li class="m_l_30">${realName}为真实姓名。</li>
              </ul>
             <div class="btn-row">
              <el-button size="small" type="primary" @click="conputed_last_edit()">确定</el-button>
            </div>
          </el-dialog>
        <div class="btn-row">
          <el-button size="small" type="primary" @click="_doAddPushClearYUNYINGedit()">清空</el-button>
          <el-button size="small" type="primary" @click="submitFormEdit('AddOnceYUNedit')">保存</el-button>
          <el-button size="small" type="primary" @click="_doAddCancelYUNedit()">取消</el-button>
        </div>

      </el-dialog>
    </div>
  </div>

</template>


<script>
  import {
    ERR_OK,
    getMsgPushList,
    PostDeletePlan,
    PostFirstPlan,
    PostSupplePlan,
    getAllins,
    PostSecondPlan,
    PostSuppleSecPlan,
    getMSGTemplate,
    postBUFANewTemplate,//新补发计划
    postAddOperaTemplate,//运营计划
    postRemoveSupNewPlan,//结束补发计划(新)
    postCCSDetail,//运营计划详情
    postEditCCSDetail,//运营计划修改
  } from '@/api/api.js'
  import {getStore,EncodeUserId,selectAllPackage,IsAlert} from '@/config/mUtils.js'
  import headerTop from '@/components/headTop.vue'
  import {baseUrl} from '@/config/env.js'

  export default {
    components: {
      headerTop,
    },
    data() {
      return {
        oldOptions:[], // 用来储存上一次的数据
        selectAll_character:'quanxuan',
        conputed_onceNum: 0,//短信textarea字数提示
        conputed_secNum: 0,
        conputed_bufaNum: 0,
        conputed_lastNum: 0,
        conputed_lastNum_edit: 0,
        chengeTimeOnce: '',//弹窗红字提示
        chengeTimeYun: '',//弹窗红字提示
        chengeTimeYunEdit: '',//弹窗红字提示
        chengeTime: '',
        chengeBufaTime: '',
        MsgList: [],//短信模板数据
        tabIndex: "1",//当前状态index
        AdminUserId: '',//userId
        InsList: [],//机构列表数据
        totalCount: 0,
        searchParams: {
          crowdType: '',
          currentPage: 1,
          institutionName: "",
          name: "",
          pageSize: 10,
          status: '',
          type: 1
        },
        tableData: [], //列表数据
        excleTable: {type: [], institutionCode: [], time: [], startTime: '', endTime: ''},//excle参数
        addTable: { //新增一次计划数据
          checkDay: '30',
          crowdType: '1',
          executeTime: "",
          frontDay: '1',
          institution: {institutionName: '', institutionCode: ''},
          institutionCode: "",
          institutionName: "",
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          // checkSentInstitution:2,
        },
        addDataLast: {//新增补发数据
          checkDay: '30',
          crowdType: "1",
          Time: '',
          endTime: "",
          executeTime: "",
          institution: [],
          institutionList: [],
          institutionCode: [],
          institutionName: [],
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          // supplementTime: "",补发日期
          checkSentInstitution:2
        }, 
        addTable_SEC: {}, //新增二次计划数据
        addTable_last: {//（新增补发二次计划数据）现改为运营计划
          checkDay: '30',
          crowdType: '1',
          executeTime: "",
          frontDay: '1',
          institution: [],
          institutionList: [],
          institutionCode: [],
          institutionName: [],
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          checkSentInstitution:2,
        }, 
        editTable_last: {//（新增补发二次计划数据）现改为运营计划
          id: "",
          institution: [],
          institutionList: [],
          messageContent: "",
        }, 
        dialogExcleVisible: false, //Excale
        dialogEditVisible: false, //修改
        dialogAddVisible: false, //一次计划
        dialogNextVisible: false, //二次计划
        dialogLastPushVisible: false, //补发计划
        dialogLastVisible: false, //运营计划
        dialogEditLast: false, //编辑运营计划
        MsgModel: false, //短信模板弹窗
        MsgModel_SEC: false, //短信模板弹窗
        MsgModel_bufa: false, //短信模板弹窗
        MsgModel_last: false, //短信模板弹窗
        MsgModel_last_edit: false, //短信模板弹窗
        formLabelWidth: '120px',
        formLabelWidth2: '170px',
        formLabelWidth3: '20px',
        rulesAddOnce: {
          name: [
            {required: true, message: '请输入计划名称', trigger: 'blur'}
          ],
          frontDay: [
            {required: true, message: '请输入前置天数', trigger: 'blur'},
          ],
          checkDay: [
            {required: true, message: '报告体检时间前置天数', trigger: 'blur'},
          ],
          messageContent: [
            {required: true, message: '请输入短信内容', trigger: 'blur'}
          ],
          institution: [
            {required: true, message: '请选择发送机构', trigger: 'blur'}
          ],
          startTime: [
            {required: true, message: '请选择', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '请选择', trigger: 'blur'}
          ],
        },
        rulesAddBufa: {
          name: [
            {required: true, message: '请输入计划名称', trigger: 'blur'}
          ],
          frontDay: [
            {required: true, message: '请输入前置天数', trigger: 'blur'},
          ],
          checkDay: [
            {required: true, message: '报告体检时间前置天数', trigger: 'blur'},
          ],
          messageContent: [
            {required: true, message: '请输入短信内容', trigger: 'blur'}
          ],
          institution: [
            {required: true, message: '请选择发送机构', trigger: 'blur'}
          ],
          Time: [
            {required: true, message: '请选择', trigger: 'blur'}
          ],
          supplementTime: [
            {required: true, message: '请选择', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '请选择', trigger: 'blur'}
          ],
        },
        rulesAddSec: {
          messageContent: [
            {required: true, message: '请输入短信内容', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '请选择执行时间', trigger: 'blur'}
          ],
          frontDay: [
            {required: true, message: '请填写前置天数', trigger: 'blur'},
          ],
        },
        rulesAddBufaSec: {
          messageContent: [
            {required: true, message: '请输入短信内容', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '请选择执行时间', trigger: 'blur'}
          ],
          frontDay: [
            {required: true, message: '请填写前置天数', trigger: 'blur'},
          ],
        },
        rulesEdit: {
          messageContent: [
            {required: true, message: '请输入短信内容', trigger: 'blur'}
          ],
          institution: [
            {required: true, message: '请选择发送机构', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      changeValue(value) {//补发计划全选机构下拉框选择code，匹配出对应的对象
          this.addDataLast.institutionName=[];
            for (let index = 0; index < value.length; index++) {
              let obj = {};
              obj = this.InsList.find((item)=>{
                return item.institutionCode === value[index];
              });
              this.addDataLast.institutionList.push(obj);
          }
      },
      changeValue2(value) {//运营计划全选机构下拉框选择code，匹配出对应的对象
          this.addTable_last.institutionName=[];
            for (let index = 0; index < value.length; index++) {
              let obj = {};
              obj = this.InsList.find((item)=>{
                return item.institutionCode === value[index];
              });
              this.addTable_last.institutionList.push(obj);
          }
      },
      changeValue3(value) {//运营计划全选机构下拉框选择code，匹配出对应的对象
            this.editTable_last.institutionList=[];
            for (let index = 0; index < value.length; index++) {
              let obj = {};
              obj = this.InsList.find((item)=>{
                return item.institutionCode === value[index];
              });
              this.editTable_last.institutionList.push(obj);
          }
      },
      selectAll(val) {//补发计划全选机构
          let selectall = selectAllPackage(val,this.InsList,this.oldOptions,this.addDataLast.institution,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.addDataLast.institution = selectall[1];
          },
      selectAll2(val) {//运营计划全选机构
          let selectall = selectAllPackage(val,this.InsList,this.oldOptions,this.addTable_last.institution,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.addTable_last.institution = selectall[1];
          },
      selectAll3(val) {//运营计划全选机构
          let selectall = selectAllPackage(val,this.InsList,this.oldOptions,this.editTable_last.institution,this.selectAll_character);
          this.oldOptions = selectall[0];
          this.editTable_last.institution = selectall[1];
          },
      //字数提示
      conputed_once() {
        this.conputed_onceNum = this.addTable.messageContent.length;
        this.MsgModel = false;
      },
      conputed_sec() {
        this.conputed_secNum = this.addTable_SEC.messageContent.length;
        this.MsgModel_SEC = false;
      },
      conputed_bufa() {
        this.conputed_bufaNum = this.addDataLast.messageContent.length;
        this.MsgModel_bufa = false;
      },
      conputed_last() {
        this.conputed_lastNum = this.addTable_last.messageContent.length;
        this.MsgModel_last = false;
      },
      conputed_last_edit() {
        this.conputed_lastNum_edit = this.editTable_last.messageContent.length;
        this.MsgModel_last_edit = false;
      },
      //时间格式转换
      timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        return Y + M + D;
      },
      //运营计划落地时间提示
      changeYunTime() {
        let date = new Date(this.addTable_last.startTime);
        let time = date.getTime() - 86400000 * this.addTable_last.frontDay;
        this.chengeTimeYun = this.timestampToTime(time);
      },
      //一次计划落地时间提示
      changeOnceTime() {
        let date = new Date(this.addTable.startTime);
        let time = date.getTime() - 86400000 * this.addTable.frontDay;
        this.chengeTimeOnce = this.timestampToTime(time);
      },
      //二次计划时间提示
      changeSecTime() {
        let date = new Date(this.addTable_SEC.startTime);
        let time = date.getTime() + 86400000 * this.addTable_SEC.frontDay;
        this.chengeTime = this.timestampToTime(time);
      },
      //补发二次计划时间提示
      changeBufaTime() {
        let date = new Date(this.addTable_last.startTime);
        let time = date.getTime() + 86400000 * this.addTable_last.frontDay;
        this.chengeBufaTime = this.timestampToTime(time);
      },
      //补发计划时间控件change事件
      getTime() {
        if (this.addDataLast.Time) {
          this.addDataLast.startTime = this.addDataLast.Time[0];
          this.addDataLast.endTime = this.addDataLast.Time[1];
        }
      },
      //excle时间控件change事件
      getselTime() {
        if (this.excleTable.time) {
          this.excleTable.startTime = this.excleTable.time[0];
          this.excleTable.endTime = this.excleTable.time[1];
        }
      },
      handleClick() {//点击tab切换事件
        this.searchParams = {
          crowdType: '',
          currentPage: 1,
          institutionName: "",
          name: "",
          pageSize: 10,
          status: '',
          type: this.tabIndex
        },
          //  this.searchParams.type =this.tabIndex;
          this.getList();
      },
      handleSizeChange: function (size) {
        this.searchParams.pageSize = size;
        this.getList();
      },
      handleCurrentChange: function (currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList();
      },
      doSearch() {
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getList();
      },
      //导出Excle弹窗
      handleExcle() {
        this.dialogExcleVisible = true;
      },
      //清空导出Excle弹窗数据
      handleCloseExcle() {
        this.excleTable = {type: [], institutionCode: [], time: [], startTime: '', endTime: ''};
        this.dialogExcleVisible = false;
      },
      //导出Excle
      _doHandleExcle() {

        if (this.excleTable.startTime === '') {
          IsAlert('请选择日期！','提示','warning');
        } else {
          let insti = '&institutionCode=' + this.excleTable.institutionCode.toString();
          let typ = '&type=' + this.excleTable.type.toString();
          let institutionCode = this.excleTable.institutionCode.toString() === '' ? '' : insti;
          let type = this.excleTable.type.toString() === '' ? '' : typ;
          let paramString =
            '&startTime=' + this.excleTable.time[0] +
            '&endTime=' + this.excleTable.time[1] + institutionCode + type;
          let url = baseUrl + "ccs/ccsplan/exportMessageStatistics?" + paramString.toString();
          this.handleCloseExcle();
          window.open(url);
        }
      },
      //一次计划，补发计划表单验证（点击新增按钮后通过表单验证才能触发新增事件）
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.tabIndex === '1') {
              this._doAddPush();
            } else if (this.tabIndex === '5') {
              this._doAddnext();
            } else if (this.tabIndex === '6') {
              this._doAddPushYun();
            }
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      //二次计划，补发二次计划表单验证
      submitFormSec(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.tabIndex === '1') {
              this._doAddPushSec();
            } else if (this.tabIndex === '3') {
              this._doAddPushSupple();
            }
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      //取消表单验证
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 创建运营计划
      handleAddYun() {
        this.changeYunTime();
        this.dialogLastVisible = true;
      },
      // 创建一次计划
      handleAdd() {
        this.changeOnceTime();
        this.dialogAddVisible = true;
      },
      // 确定创建一次计划
      _doAddPush() {
        let params = {
          checkDay: this.addTable.checkDay,
          crowdType: this.addTable.crowdType,
          executeTime: this.addTable.executeTime,
          frontDay: this.addTable.frontDay,
          institutionCode: this.addTable.institution.institutionCode,
          institutionName: this.addTable.institution.institutionName,
          linkType: this.addTable.linkType,
          messageContent: this.addTable.messageContent,
          name: this.addTable.name,
          startTime: this.addTable.startTime,
          userId: this.AdminUserId,
          checkSentInstitution: 2,
        }
        PostFirstPlan(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseAdd();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      // 确定创建运营计划
      _doAddPushYun() {
        this.changeValue2(this.addTable_last.institution);
        let params = {
          checkDay: this.addTable_last.checkDay,
          crowdType: this.addTable_last.crowdType,
          executeTime: this.addTable_last.executeTime,
          frontDay: this.addTable_last.frontDay,
          // institutionCode: this.addTable_last.institution.institutionCode,
          // institutionName: this.addTable_last.institution.institutionName,
          institutionList: this.addTable_last.institutionList,
          linkType: this.addTable_last.linkType,
          messageContent: this.addTable_last.messageContent,
          name: this.addTable_last.name,
          startTime: this.addTable_last.startTime,
          userId: this.AdminUserId,
          checkSentInstitution: 1,
        }
        postAddOperaTemplate(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseAddYUNYING();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //一次计划取消按钮
      _doAddCancel() {
        this.handleCloseAdd();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      //运营计划取消按钮
      _doAddCancelYUN() {
        this.handleCloseAddYUNYING();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      //一次计划取消
      handleCloseAdd() {
        this._doAddPushClear();
        this.resetForm('AddOnce');
        this.dialogAddVisible = false;
      },
      //运营计划取消
      handleCloseAddYUNYING() {
        this._doAddPushClearYUNYING();
        this.resetForm('AddOnceYUN');
        this.dialogLastVisible = false;
      },
      //一次计划清空按钮
      _doAddPushClear() {
        this.addTable = {
          checkDay: '30',
          crowdType: '1',
          executeTime: "",
          frontDay: '1',
          institution: {institutionName: '', institutionCode: ''},
          institutionCode: "",
          institutionName: "",
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          // checkSentInstitution:2,
        };
        this.conputed_onceNum = 0;
      },
      //运营计划清空按钮
      _doAddPushClearYUNYING() {
        this.addTable_last = {
          checkDay: '30',
          crowdType: '1',
          executeTime: "",
          frontDay: '1',
          institution: [],
          institutionList: [],
          institutionCode: [],
          institutionName: [],
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          checkSentInstitution:2,
        };
        this.conputed_lastNum = 0;
      },
      doEdit(index, row){//编辑运营计划
        let params = {
          id:row.id
        }
        postCCSDetail(params).then(response => {
          
          this.editTable_last = {
            id: response.data.id,
            institution: response.data.institutionCodeList,
            institutionList: response.data.institutionCodeList,
            messageContent: response.data.messageContent,
          };
          this.conputed_last_edit();
          this.dialogEditLast = true;
        }).catch(()=>{
          this.$message.error('获取运营计划详情失败！');
        })
      },
      submitFormEdit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this._doEditDone();
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      _doEditDone(){//确定编辑运营计划
        this.changeValue3(this.editTable_last.institution);
        let params = {
          id: this.editTable_last.id,
          institutionList: this.editTable_last.institutionList,
          messageContent: this.editTable_last.messageContent,
        }
        postEditCCSDetail(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseAddYUNYINGedit();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('获取运营计划详情失败！');
        })
      },
      _doAddCancelYUNedit() {//编辑运营计划取消按钮
        this.handleCloseAddYUNYINGedit();
        this.$message({
          type: 'warning',
          message: '取消编辑'
        })
      },
      handleCloseAddYUNYINGedit() {//编辑运营计划取消
        this._doAddPushClearYUNYINGedit();
        this.resetForm('AddOnceYUNedit');
        this.dialogEditLast = false;
      },
      
      _doAddPushClearYUNYINGedit() {//编辑运营计划清空按钮
        this.editTable_last = {
          id: "",
          institution: [],
          institutionList: [],
          messageContent: "",
        };
        this.conputed_lastNum_edit = 0;
      },
      //新增二次计划弹窗
      handleAddNext(index, row) {
        let deap = JSON.stringify(row);
        this.addTable_SEC = JSON.parse(deap);
        this.addTable_SEC.frontDay = 1;
        this.changeSecTime();
        this.conputed_sec();
        this.dialogNextVisible = true;
      },
      //确定新增二次计划
      _doAddPushSec() {
        let params = {
          checkDay: this.addTable_SEC.checkDay,
          crowdType: this.addTable_SEC.crowdType,
          executeTime: this.addTable_SEC.executeTime,
          frontDay: this.addTable_SEC.frontDay,
          institutionCode: this.addTable_SEC.institutionCode,
          institutionName: this.addTable_SEC.institutionName,
          linkType: this.addTable_SEC.linkType,
          messageContent: this.addTable_SEC.messageContent,
          name: this.addTable_SEC.name,
          parentId: this.addTable_SEC.id,
          checkSentInstitution: 2,
          userId: this.AdminUserId
        };
        PostSecondPlan(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.dialogNextVisible = false;
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //二次计划取消按钮
      _doAddCancelSec() {
        this.handleCloseAddSec();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      //二次计划取消
      handleCloseAddSec() {
        this._doAddClearSec();
        this.resetForm('AddSec');
        this.dialogNextVisible = false;
      },
      //二次计划清空按钮
      _doAddClearSec() {
        this.addTable_SEC.executeTime = '';
        this.addTable_SEC.messageContent = '';
        this.addTable_SEC.frontDay = '';
        this.conputed_secNum = 0;
      },
      //确定新增补发计划
      _doAddnext() {
        this.changeValue(this.addDataLast.institution);
        let params = {
          checkDay: this.addDataLast.checkDay,
          crowdType: this.addDataLast.crowdType,
          supplementEndTime: this.addDataLast.Time[1] + ' 23:59:59',
          executeTime: this.addDataLast.executeTime,
          // institutionCode: this.addDataLast.institution.institutionCode,
          // institutionName: this.addDataLast.institution.institutionName,
          institutionList: this.addDataLast.institutionList,
          linkType: this.addDataLast.linkType,
          messageContent: this.addDataLast.messageContent,
          name: this.addDataLast.name,
          supplementStartTime: this.addDataLast.Time[0] + ' 00:00:00',
          // supplementTime: this.addDataLast.supplementTime,
          checkSentInstitution: 2,
          userId: this.AdminUserId
        }
        postBUFANewTemplate(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert(response.msg,'成功','success');
            this.handleCloseLastPush();
            this.getList();
          } else {
            IsAlert(response.msg,'错误','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //补发计划取消按钮
      _doAddCancelBufa() {
        this.handleCloseLastPush();
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      //补发计划取消
      handleCloseLastPush() {
        this._doAddPushClearBufa();
        this.resetForm('AddBufa');
        this.dialogLastPushVisible = false;
      },
      //补发计划清空按钮
      _doAddPushClearBufa() {//清空
        this.addDataLast = {
          checkDay: '30',
          crowdType: "1",
          Time: '',
          endTime: "",
          executeTime: "",
          institution: [],
          institutionList: [],
          institutionCode: [],
          institutionName: [],
          linkType: '2',
          messageContent: "",
          name: "",
          startTime: "",
          // supplementTime: "",补发日期
          checkSentInstitution:2
        };
        this.conputed_bufaNum = 0;//短信模板字数显示重置为0
      },


      // 新增补发二次计划
      // handleAddLast(index, row) {
      //   let deap = JSON.stringify(row);
      //   this.addTable_last = JSON.parse(deap);
      //   this.addTable_last.frontDay = 1;
      //   this.changeBufaTime();
      //   this.conputed_last();
      //   this.dialogLastVisible = true;
      // },
      //确定新增补发二次计划
      // _doAddPushSupple() {
      //   let params = {
      //     checkDay: this.addTable_last.checkDay,
      //     crowdType: this.addTable_last.crowdType,
      //     executeTime: this.addTable_last.executeTime,
      //     frontDay: this.addTable_last.frontDay,
      //     institutionCode: this.addTable_last.institutionCode,
      //     institutionName: this.addTable_last.institutionName,
      //     linkType: this.addTable_last.linkType,
      //     messageContent: this.addTable_last.messageContent,
      //     name: this.addTable_last.name,
      //     parentId: this.addTable_last.id,
      //     checkSentInstitution: this.addTable_last.checkSentInstitution,
      //     userId: this.AdminUserId
      //   };
      //   PostSuppleSecPlan(params).then(response => {
      //     if (response.code === ERR_OK) {
      //       this.$alert(response.msg, this.title);
      //       this.dialogLastVisible = false;
      //     } else {
      //       this.$alert(response.msg, this.title);
      //     }
      //   }).catch(()=>{
      //     this.$message.error('网络错误!请稍后重试');
      //   })
      // },
      //补发二次计划取消按钮
      // _doAddCancelBufaSec() {
      //   this.handleCloseAddBufaSec();
      //   this.$message({
      //     type: 'warning',
      //     message: '取消新增'
      //   })
      // },
      //补发二次计划取消
      // handleCloseAddBufaSec() {
      //   this._doAddClear();
      //   this.resetForm('AddBufaSec');
      //   this.dialogLastVisible = false;
      // },
      //补发二次计划清空按钮
      // _doAddClear() {
      //   this.addTable_last.executeTime = "",
      //     this.addTable_last.frontDay = "",
      //     this.addTable_last.messageContent = "",
      //     this.conputed_lastNum = 0;
      // },


      // 删除提示
      deleteMessage(index, row) {
        this.$confirm('此操作将结束该计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              id: row.id,
              userId: this.AdminUserId
            }
            PostDeletePlan(params).then(response => {
              if (response.code === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '计划结束!'
                })
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试');
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消结束计划'
            })
          })
      },
      deleteSupNewPlan(index, row) {//结束补发计划(新)
        this.$confirm('此操作将结束该计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            let params = {
              id: row.id,
              userId: this.AdminUserId
            }
            postRemoveSupNewPlan(params).then(response => {
              if (response.code === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '计划结束!'
                })
                this.getList();
              } else {
                IsAlert(response.msg,'错误','error');
              }
            }).catch(()=>{
              this.$message.error('网络错误!请稍后重试');
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning ',
              message: '已取消结束计划'
            })
          })
      },
      //获取列表
      getList() {
        let params = {
          crowdType: this.searchParams.crowdType,
          currentPage: this.searchParams.currentPage,
          institutionName: this.searchParams.institutionName,
          name: this.searchParams.name,
          pageSize: this.searchParams.pageSize,
          status: this.searchParams.status,
          type: this.searchParams.type
        }
        getMsgPushList(params).then(response => {
          if ((response.code === ERR_OK)) {
            this.tableData = [];
            this.tableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            IsAlert('获取短信推送列表失败','提示','error');
          }
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
        let partthis = getStore('userMesage');
        this.AdminUserId = EncodeUserId(JSON.parse(partthis).userId);
      },
      //获取机构列表
      getInsList() {
        let params = {}
        getAllins(params).then(response => {
          this.InsList = [];
          this.InsList = response.data;
          this.InsList.unshift({institutionCode: "quanxuan",institutionName: "全部选择"});
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
      //获取短信模板
      getMSGList() {
        let params = {};
        getMSGTemplate(params).then(response => {
          this.MsgList = [];
          this.MsgList = response;
        }).catch(()=>{
          this.$message.error('网络错误!请稍后重试');
        })
      },
    },
    watch: {
      'addTable.startTime': 'changeOnceTime',
      'addTable.frontDay': 'changeOnceTime',
      'addTable_last.startTime': 'changeYunTime',
      'addTable_last.frontDay': 'changeYunTime',
      'addTable_SEC.frontDay': 'changeSecTime',
      // 'addTable_last.frontDay': 'changeBufaTime',
    },
    activated: function () {
      this.tabIndex = '1';
      this.searchParams.type = '1';
      this.getList();
      this.getInsList();
      this.getMSGList();
    },
  }
</script>

<style lang="less" scoped>
  .m_b_5 {
    margin-bottom: 5px !important;
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

  .m_l_15 {
    margin-left: 15px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding:0;
  }
</style>
<style lang="less">
  .selectnerMsg {
    .el-input__inner {
      width: 350px;
      // border: 0;
    }
    // .el-input__suffix {
    //   display: none;
    // }
  }

  .elnum {
    padding-bottom: 15px;
    width: 220px;

  }

  .selectnerAdd {
    .el-input__inner {
      width: 220px;
    }
  }

  .message {
    display: flex !important;
    align-items: center;
    .el-radio__input {
      display: block;
      line-height: 210%;
    }
    .el-radio__label {
      display: block;
      word-break: normal;
      width: 400px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
    }
  }

  .msgFlax {
    display: flex !important;
    align-items: center;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
</style>

