<template>
  <div class="page-wrapper">
    <header-top></header-top>
    <div class="page-container"
         v-loading="loading3"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.7)">
      <el-header height="30">
        <el-form id="SearchBar" :inline="true" :model="searchParams" class="demo-form-inline">
          <el-form-item label="机构编号">
            <el-input v-model="searchParams.selectInstitutionCode" placeholder="机构编号" clearable></el-input>
          </el-form-item>

          <el-form-item label="机构名称">
            <el-input v-model="searchParams.selectInstitutionName" placeholder="机构名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReset()">清空</el-button>
            <el-button type="primary" @click="doSearch()">搜索</el-button>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <!-- 修改 -->
        <el-dialog
          title="修改"
          v-loading.fullscreen.lock="loading2"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
          v-if="dialogEditVisible"
          :visible.sync="dialogEditVisible"
          width="900px"
          :before-close="handleCloseEidt">
          <template :model="editTable">
            <!-- 修改==基本信息 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>基本信息</strong>
              </div>
              <el-form
                :inline="true"
                label-position="left"
                label-width="100px"
                class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构编号:" class="is-required">
                  <el-col :span="16">
                    <el-input
                      readonly
                      v-model="editTable.institutionCode"
                      @change="codeChange"
                      placeholder="请输入机构编号"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="机构名称:" class="is-required">
                  <el-col :span="16">
                    <el-input
                      v-model="editTable.institutionName"
                      placeholder="请输入机构名称"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
              <el-form
                :inline="true"
                label-position="left"
                label-width="100px"
                class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构地址:" class="is-required">
                  <el-col :span="16">
                    <el-input v-model="editTable.institutionAddr" placeholder="请输入机构地址"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="机构类型:" class="is-required">
                  <!--<el-select v-model="editTable.institutionCategory" placeholder="请选择机构类型">
                    <el-option label="医院" :value="1"></el-option>
                    <el-option label="供应商" :value="2"></el-option>
                  </el-select>-->
                  <el-select v-model="editTable.institutionType" placeholder="请选择机构类型">
                    <el-option label="好卓第三方机构" :value="0"></el-option>
                    <el-option label="优健康第三方机构" :value="1"></el-option>
                    <el-option label="好卓服务机构" :value="2"></el-option>
                  </el-select>

                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" :model="addTable"
                       label-width="100px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="省份:" class="is-required">
                  <el-col :span="16">
                    <el-select v-model="editTable.provinceId" value-key="id" clearable filterable placeholder="请选择机构省份" @change="GetlistGetRrovinceChild(editTable.provinceId)">
                      <el-option v-for="(item,index) in RrovinceList" :key="index" :label="item.regionName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="城市:" class="is-required">
                  <el-col :span="16">
                    <el-select v-model="editTable.cityId" value-key="id" clearable filterable placeholder="请选择机构城市">
                      <el-option v-for="(item,index) in RrovinceChildList" :key="index" :label="item.regionName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-form>
              <el-form
                :inline="true"
                label-position="left"
                label-width="100px"
                class="demo-form-inline demo-ruleForm">
                <el-form-item class="dateSel" label="工作日选择:">
                  <el-select v-model="dataEdit.DateSel" @change="dateEdit" multiple placeholder="请选择">
                    <el-option label="星期一" value="周一"></el-option>
                    <el-option label="星期二" value="周二"></el-option>
                    <el-option label="星期三" value="周三"></el-option>
                    <el-option label="星期四" value="周四"></el-option>
                    <el-option label="星期五" value="周五"></el-option>
                    <el-option label="星期六" value="周六"></el-option>
                    <el-option label="星期七" value="周日"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item class="dateSel" label="请选择客服:">
                  <el-select
                    v-model="editTable.customerServiceUserId"
                    placeholder="请选择">
                    <el-option v-for="item in institutionUserList" :label="item.userName" :value="item.userId"
                               :key="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
              <el-form
                :inline="true"
                label-position="left"
                label-width="100px"
                class="demo-form-inline demo-ruleForm">
                <el-form-item label="经度:" label-width="90px" style="margin-left:10px;">
                  <el-input v-model="editTable.longitude" type="number"
                            placeholder="请输入经度"></el-input>
                </el-form-item>
                <el-form-item label="纬度:" label-width="90px" style="margin-left:10px;">
                  <el-input v-model="editTable.latitude" type="number"
                            placeholder="请输入纬度"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
            <!-- 修改==推广设置 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>推广设置</strong>
              </div>
              <!--<el-form :inline="true" label-position="left" :model="editTable" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="地推链接:">
                  <el-col>
                    <el-input v-model="editTable.institutionExtensionUrl "
                              placeholder="请输入地推链接" readonly></el-input>
                    <el-button type="primary" @click="EditCreateLink">生成地推链接</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="二维码链接:">
                  <el-col>
                    <el-input v-model="editTable.institutionExtensionUrl "
                              placeholder="请输入二维码链接" readonly></el-input>
                    <el-button type="primary" @click="CreateQR">生成二维码链接</el-button>
                  </el-col>
                </el-form-item>
              </el-form>-->
              <el-form
                :inline="true"
                label-position="left"
                label-width="90px"
                class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构地推Logo:" :label-width="formLabelWidth150" class="is-required">
                  <Insuploadimg
                    name="first-edit"
                    :imageHeight="'150'"
                    :imageWidth="'570'"
                    @emitSuccess="handImgSuccess"
                    @emitError="handImgError"
                    :btnType="'PNG'"
                    :imageSrc="editTable.extensionLogoUrl"
                    :imgKey="extensImgKey"
                    :urlName="'logo_'+editTable.institutionCode"
                    v-if="showExtens"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传后缀为'.png'格式的图片,<br/>尺寸:570X150</span>
                </el-form-item>
                <el-form-item label="机构宣传Logo:" :label-width="formLabelWidth150" class="is-required">
                  <Insuploadimg
                    name="second-edit"
                    @emitSuccess="handDituiSuccess"
                    @emitError="handImgError"
                    :imageHeight="'580'"
                    :imageWidth="'750'"
                    :btnType="'JPEG'"
                    :imageSrc="editTable.extensionImageUrl"
                    :imgKey="extensImgKey"
                    :urlName="'bg_'+editTable.institutionCode"
                    v-if="showExtens"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传后缀为'.jpg'格式的图片,<br/>尺寸:750X580</span>
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" label-width="90px"
                       class="demo-form-inline">
                <el-form-item label="供应商主图:" :label-width="formLabelWidth150">
                  <Insuploadimg
                    name="main-add"
                    @emitSuccess="mainPictureSuccess"
                    @emitError="handImgError"
                    :imageHeight="'480'"
                    :imageWidth="'750'"
                    :imageSrc="editTable.mainPicture"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传JPEG或PNG格式的图片,<br/>尺寸:750x480</span>
                </el-form-item>
              </el-form>
            </el-card>
            <!-- 修改==APP推广 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>APP展示</strong>
              </div>
              <el-form :inline="true" :model="editTable" label-position="left" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="是否可看付费项:" label-width="150px">
                  <template>
                    <el-radio v-model="editTable.checkFee" :label="1">是</el-radio>
                    <el-radio v-model="editTable.checkFee" :label="0">否</el-radio>
                  </template>
                </el-form-item>
                <el-form-item label="体检报告LOGO:" label-width="140px" style="margin-left:10px;">
                  <Insuploadimg
                    name="three-edit"
                    :imageHeight="'120'"
                    :imageWidth="'120'"
                    @emitSuccess="handTijianSuccess"
                    @emitError="handImgError"
                    :imageSrc="editTable.medicalExamReportLogo"
                    :urlName="editTable.institutionCode"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传JPEG或PNG格式的图片,<br/>尺寸:120X120</span>
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="editTable" label-position="left" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构简介:" label-width="150px">
                  <el-input
                    style="width:360px;"
                    resize="none"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                    v-model="editTable.synopsis"
                    placeholder="请输入商品描述"></el-input>
                </el-form-item>
              </el-form>
              <el-form :model="editTable" label-position="left" label-width="150px"
                       class="demo-form-inline demo-ruleForm instion-style">
                <el-form-item label="机构App展示网页:（注:上传bannner图片尺寸为750X480）">
                  <el-col>
                    <msg-tinymce v-model="editTable.institutionDesc" :url="Url" :with-credentials='false'
                                 :editorHeight='200'></msg-tinymce>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-card>
          </template>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doHandleEdit()">确定</el-button>
            <el-button size="small" type="primary" @click="_doCancel()">取消</el-button>
          </div>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog
          title="查看"
          :visible.sync="dialogCheckVisible"
          width=800px>
          <!--查看==基本信息-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>基本信息</strong>
            </div>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构编号：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.institutionCode}}</div>
              </el-col>
              <el-col :span="3"><span>机构名称：</span></el-col>
              <el-col :span="9">
                <div>{{selectTable.institutionName}}({{selectTable.extCode}})</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构地址：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.institutionAddr}}</div>
              </el-col>
              <el-col :span="3"><span>机构类型：</span></el-col>
              <el-col :span="9">
              <!--   <div v-if="selectTable.institutionCategory===1">医院</div>
                <div v-if="selectTable.institutionCategory===2">供应商</div>-->
            <div v-if="selectTable.institutionType ===0">好卓第三方机构</div>
                <div v-if="selectTable.institutionType ===1">优健康第三方机构</div>
                <div v-if="selectTable.institutionType ===2">好卓服务机构</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>省份：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.provinceId}}</div>
              </el-col>
              <el-col :span="3"><span>城市：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.cityId}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>工作时间：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.serviceDate}}</div>
              </el-col>
              <!-- <el-col :span="3"><span>客服名称：</span></el-col>
              <el-col :span="9">
                <div>{{custormUserSelect(selectTable.customerServiceUserId)}}</div>
              </el-col> -->
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构经度：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">{{selectTable.longitude}}</div>
              </el-col>
              <el-col :span="3"><span>机构纬度：</span></el-col>
              <el-col :span="9">
                <div>{{selectTable.latitude}}</div>
              </el-col>
            </el-row>
          </el-card>
          <!--查看==推广设置-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>推广信息</strong>
            </div>
            <el-row :gutter="20">
              <el-col :span="3"><span>地推链接：</span></el-col>
              <el-col :span="9">
                <div v-if="selectTable.institutionExtensionUrl&&selectTable.institutionExtensionUrl!=='http://t.cn/..'"
                     class="grid-content">{{selectTable.institutionExtensionUrl}}
                </div>
                <span v-else>暂无数据</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构地推LOGO：</span></el-col>
              <el-col :span="9"><img :src="`${InsLogoUrl}${selectTable.institutionCode+'.png?checkImg='}${checkImg}`"
                                     alt="暂无图片" style="vertical-align: middle;width:100px;height:100px;"></el-col>
              <el-col :span="3"><span>机构地推宣传图：</span></el-col>
              <el-col :span="9"><img :src="`${InsImageUrl}${selectTable.institutionCode+'.jpg?checkImg='}${checkImg}||`"
                                     alt="暂无图片" style="vertical-align: middle;width:100px;height:100px;"></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>供应商主图：</span></el-col>
              <el-col :span="9">
                <img :src="`${selectTable.mainPicture}`"
                     alt="暂无图片"
                     style="vertical-align: middle;width:100px;height:100px;">
              </el-col>
            </el-row>
          </el-card>
          <!--查看==APP展示-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>APP展示</strong>
            </div>
            <el-row :gutter="20">
              <el-col :span="3"><span>是否可付费项：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">
                  <span v-if="selectTable.checkFee===1">是</span>
                  <span v-if="selectTable.checkFee===0">否</span>
                  <span v-if="selectTable.checkFee!==0&&selectTable.checkFee!==1">暂无数据</span>
                </div>
              </el-col>
              <el-col :span="3"><span>体检报告logo：</span></el-col>
              <el-col :span="9"><img :src="`${selectTable.medicalExamReportLogo}`" alt="暂无图片"
                                     style="vertical-align: middle;width:100px;height:100px;"></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构简介：</span></el-col>
              <el-col :span="9">
                <div class="grid-content">
                  <span>{{selectTable.synopsis}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"><span>机构APP展示网页：</span></el-col>
              <el-col :span="9">
                <el-button type="primary" size="mini" @click="previewPage">预 览</el-button>
              </el-col>
            </el-row>
          </el-card>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="dialogCheckVisible = false">确定</el-button>
            <el-button size="small" type="primary" @click="dialogCheckVisible = false">取消</el-button>
          </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog
          title="新增"
          v-loading.fullscreen.lock="loading2"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
          :visible.sync="dialogAddVisible" width="900px" :before-close="handleCloseAdd">
          <template :model="addTable">
            <!-- 新增==基本信息 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>基本信息</strong>
              </div>
              <el-form :inline="true" label-position="left" :model="addTable"
                       label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构编号:" class="is-required">
                  <el-col :span="16">
                    <el-input v-model="addTable.institutionCode" @change="codeChange"
                              placeholder="请输入机构编号"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="机构名称:" class="is-required">
                  <el-col :span="16">
                    <el-input v-model="addTable.institutionName" placeholder="请输入机构名称"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" :model="addTable"
                       label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构地址:" class="is-required">
                  <el-col :span="16">
                    <el-input v-model="addTable.institutionAddr" placeholder="请输入机构地址"
                              el></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="机构类型:" class="is-required">
                  <el-select v-model="addTable.institutionType" placeholder="请选择机构类型">
                    <el-option label="好卓第三方机构" :value="0"></el-option>
                    <el-option label="优健康第三方机构" :value="1"></el-option>
                    <el-option label="好卓服务机构" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                </el-form>
                <el-form :inline="true" label-position="left" :model="addTable"
                       label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="省份:" class="is-required">
                  <el-col :span="16">
                    <el-select v-model="addTable.provinceId" clearable filterable placeholder="请选择机构省份" @change="GetlistGetRrovinceChild(addTable.provinceId)">
                      <el-option v-for="(item,index) in RrovinceList" :key="index" :label="item.regionName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="城市:" class="is-required">
                  <el-col :span="16">
                    <el-select v-model="addTable.cityId" clearable filterable placeholder="请选择机构城市">
                      <el-option v-for="(item,index) in RrovinceChildList" :key="index" :label="item.regionName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" :model="addTable" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-col :span="12">
                  <el-form-item class="dateSel" label="工作日选择:" style="padding-right:0;"
                                label-width="90px">
                    <el-select v-model="addTable.DateSel" @change="dateHandle" multiple placeholder="请选择">
                      <el-option label="星期一" value="周一"></el-option>
                      <el-option label="星期二" value="周二"></el-option>
                      <el-option label="星期三" value="周三"></el-option>
                      <el-option label="星期四" value="周四"></el-option>
                      <el-option label="星期五" value="周五"></el-option>
                      <el-option label="星期六" value="周六"></el-option>
                      <el-option label="星期七" value="周日"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="经度:" label-width="80px" style="margin-left:10px;">
                    <el-input v-model="addTable.longitude" type="number"
                              placeholder="请输入经度"></el-input>
                  </el-form-item>
                  <el-form-item label="纬度:" label-width="80px" style="margin-left:10px;">
                    <el-input v-model="addTable.latitude" type="number"
                              placeholder="请输入纬度"></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-card>
            <!-- 新增==推广设置 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>推广设置</strong>
              </div>
              <el-form :inline="true" label-position="left" :model="addTable" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构地推Logo:" :label-width="formLabelWidth150" class="is-required">
                  <Insuploadimg
                    name="first-add"
                    :imageHeight="'150'"
                    :imageWidth="'570'"
                    @emitSuccess="handNewImgSuccess"
                    @emitError="handImgError"
                    :btnType="'PNG'"
                    :imageSrc="addTable.extensionLogoUrl"
                    :imgKey="extensImgKey"
                    :urlName="'logo_'+addTable.institutionCode"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传后缀为'.png'格式的图片,<br/>尺寸:570X150</span>
                </el-form-item>
                <el-form-item label="机构宣传Logo:" :label-width="formLabelWidth150" class="is-required">
                  <Insuploadimg
                    name="second-add"
                    @emitSuccess="handNewDituiSuccess"
                    @emitError="handImgError"
                    :imageHeight="'580'"
                    :imageWidth="'750'"
                    :btnType="'JPEG'"
                    :imageSrc="addTable.extensionImageUrl"
                    :imgKey="extensImgKey"
                    :urlName="'bg_'+addTable.institutionCode"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传后缀为'.jpg'格式的图片,<br/>尺寸:750X580</span>
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" :model="addTable" label-width="90px"
                       class="demo-form-inline">
                <el-form-item label="供应商主图:" :label-width="formLabelWidth150">
                  <Insuploadimg
                    name="main-add"
                    @emitSuccess="mainNewPictureSuccess"
                    @emitError="handImgError"
                    :imageHeight="'480'"
                    :imageWidth="'750'"
                    :imageSrc="addTable.mainPicture"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传JPEG或PNG格式的图片,<br/>尺寸:750x480</span>
                </el-form-item>
              </el-form>
            </el-card>
            <!-- 新增==APP展示 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <strong>APP展示</strong>
              </div>
              <el-form :inline="true" :model="addTable" label-position="left" label-width="150px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="是否可看付费项:">
                  <template>
                    <el-radio v-model="addTable.checkFee" :label="1">是</el-radio>
                    <el-radio v-model="addTable.checkFee" :label="0">否</el-radio>
                  </template>
                </el-form-item>
                <el-form-item label="体检报告LOGO:" label-width="140px" style="margin-left:20px;">
                  <Insuploadimg
                    name="three-add"
                    @emitSuccess="handNewTijianSuccess"
                    @emitError="handImgError"
                    :imageHeight="'120'"
                    :imageWidth="'120'"
                    :imageSrc="addTable.medicalExamReportLogo"
                    :urlName="addTable.institutionCode"
                  ></Insuploadimg>
                  <span class="tipStyle">注:请上传JPEG或PNG格式的图片,<br/>尺寸:120X120</span>
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="addTable" label-position="left" label-width="90px"
                       class="demo-form-inline demo-ruleForm">
                <el-form-item label="机构简介:" label-width="150px">
                  <el-input
                    style="width:360px;"
                    resize="none"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                    v-model="addTable.synopsis"
                    placeholder="请输入商品描述"></el-input>
                </el-form-item>
              </el-form>
              <el-form :model="addTable" label-position="left" label-width="150px"
                       class="demo-form-inline demo-ruleForm instion-style">
                <el-form-item label="机构App展示网页:（注:上传bannner图片尺寸为750X480）">
                  <el-col>
                    <msg-tinymce v-model="addTable.institutionDesc" :url="Url" :with-credentials='false'
                                 :editorHeight='200'></msg-tinymce>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-card>
          </template>
          <div class="btn-row">
            <el-button size="small" type="primary" @click="_doAdd()">确定</el-button>
            <el-button size="small" type="primary" @click="_doAddCancel()">取消</el-button>
          </div>
        </el-dialog>
        <!-- 列表 -->
        <template>
          <el-table :data="tableData" border style="width: 100%" id="app">
            <el-table-column
              show-overflow-tooltip
              align="center" type="index"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center" prop="institutionCode" label="机构编号"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center" prop="institutionName" label="机构名称"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center" prop="institutionAddr" label="机构地址"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center" label="机构类型">
              <template slot-scope="scope">
                <span v-if="scope.row.institutionType===0">好卓第三方机构</span>
                <span v-if="scope.row.institutionType===1">优健康第三方机构</span>
                <span v-if="scope.row.institutionType===2">好卓服务机构</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="操作" width="220">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer height="30px">
        <div class="selPage">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.currentPage"
            :page-sizes="[10,20]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </el-footer>
    </div>
  </div>
</template>


<script>
  import {
    ERR_OK,
    PostInstitutionList,
    PostInstitutionSave,
    PostInstitutionUpdate,
    Insdelete,
    Insinfo,
    InslistAllInstitution,
    getShortLink,
    createRequestToken,
    listGetRrovince,
    listGetRrovinceChild,
    listAllUserInfoByInstitutionId//获取当前机构下所有用户列表
  } from '@/api/api'
  import {getStore, EncodeUserId, IsAlert} from "@/config/mUtils.js"
  import MsgTinymce from '@/components/tinymce'
  import {inslongLink, extensImgKey, envInsLogoUrl, envInsImageUrl, preview_path, previwUrl} from '@/config/env'
  import headerTop from '@/components/headTop.vue'
  import Insuploadimg from '@/components/uploadImg/InsUploadImg.vue'
  import VueQArt from 'vue-qart'

  export default {
    components: {
      headerTop,
      Insuploadimg,
      VueQArt,
      MsgTinymce
    },
    data() {
      return {
        Url: 'http://v0.api.upyun.com/zhangshangtijian',
        userInfo: {},//用户信息
        activeNameAdd: 'first',
        activeNameEdit: 'first',
        title: "提示",//this.$alert的标题
        searchParams: {
          selectInstitutionCategory: '',
          selectInstitutionName: '',
          selectInstitutionCode: '',
          institutionType: '',
          currentPage: 1,
          pageSize: 10,
        }, //搜索时的数据
        totalCount: 0,
        tableData: [], //列表数据
        RrovinceList: [], //省份数据
        RrovinceChildList: [], //城市数据
        selectTable: {}, //查看单个数据
        longLinkUrl: '',//地推短连接
        editTable: {
          provinceId:'',//省份
          cityId:'',//城市
          institutionType: '',
          institutionCategory: '',//机构类型/
          institutionName: '',//机构名称/
          institutionAddr: '',//机构地址/
          institutionCode: '',//机构编号/
          whetherExtension: 1,//是否推广(0否 1是)//
          medicalExamReportLogo: '',//体检报告LOGO链接//
          institutionExtensionUrl: '',//地推链接
          institutionDesc: '',//描述
          institutionId: '1',//机构id
          updateUser: '1',//修改人ID
          whetherDelete: 1,//是否删除（0否 1是)
          extensionLogoUrl: '', /*医院地推logo*/
          extensionImageUrl: '', /*医院宣传图*/
          extensionLogoUrlTime: null,
          extensionImageUrlTime: null,
          medicalExamReportLogoTime: null,
          bannerLogoTime: null,
          checkFee: 1,//是否可查看付费项（是：1；否：0）默认为是；当选择否时，报告详情页面则需要修改
          latitude: '', //纬度 ,
          longitude: '',// 经度 ,
          serviceDate: '',// 服务时间（多个日期）
          DateSel: [],//初始服务时间
          customerServiceUserId: '',
          mainPicture: '',//供应商主图
          synopsis: ''//商品描述
        }, //修改单个数据
        dataEdit: {
          DateSel: []
        },
        /*新增*/
        addTable: {
          provinceId: '',//省份
          cityId: '',//城市
          institutionType: '',
          institutionCategory: '',//机构类型/
          institutionName: '',//机构名称/
          institutionAddr: '',//机构地址/
          institutionCode: '',//机构编号/
          whetherExtension: 1,//是否推广(0否 1是)//
          medicalExamReportLogo: '',//体检报告LOGO链接//
          institutionExtensionUrl: '',//地推链接
          createUser: '',//创建人ID
          institutionDesc: '',//描述
          whetherDelete: 1,//是否删除（0否 1是)
          extensionLogoUrl: '', /*医院地推logo*/
          extensionImageUrl: '', /*医院宣传图*/
          extensionLogoUrlTime: null,
          extensionImageUrlTime: null,
          medicalExamReportLogoTime: null,
          bannerLogoTime: null,
          checkFee: 1,//是否可查看付费项（是：1；否：0）默认为是；当选择否时，报告详情页面则需要修改
          latitude: '', //纬度 ,
          longitude: '',// 经度 ,
          serviceDate: '',// 服务时间（多个日期）
          DateSel: [],//初始服务时间
          mainPicture: '',//供应商主图
          synopsis: ''//商品描述
        },
        /*医院地推logo&&医院宣传图*/
        extensImgKey: extensImgKey,
        InsLogoUrl: envInsLogoUrl,
        InsImageUrl: envInsImageUrl,
        dialogCheckVisible: false, //查看
        dialogEditVisible: false, //修改
        dialogAddVisible: false, //新增
        formLabelWidth: '120px',
        formLabelWidth150: '150px',
        showExtens: true,//清除缓存用
        loading2: false,
        loading3: false,
        doubleClick: false,
        checkImg: 1,
        institutionUserList: []
      }
    },
    methods: {
      /*上传图片失败*/
      handImgError(res) {
        IsAlert('图片上传失败！', '错误', 'error');
      },
      /*修改医院地推LOGO*/
      handImgSuccess(res) {
        this.showExtens = false;
        if (res.status === 200) {
          this.showExtens = true;
          this.$message({
            message: '图片保存成功',
            type: 'success'
          });
          this.editTable.extensionLogoUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.editTable.extensionLogoUrlTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*修改医院地推宣传图*/
      handDituiSuccess(res) {
        this.showExtens = false;
        if (res.status === 200) {
          this.showExtens = true;
          this.$message({
            message: '图片保存成功',
            type: 'success'
          });
          this.editTable.extensionImageUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.editTable.extensionImageUrlTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*修改供应商主图*/
      mainPictureSuccess(res) {
        this.showExtens = false;
        if (res.status === 200) {
          this.showExtens = true;
          this.editTable.mainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*修改体检报告LOGO*/
      handTijianSuccess(res) {
        this.showExtens = false;
        if (res.status === 200) {
          this.showExtens = true;
          this.$message({
            message: '图片保存成功',
            type: 'success'
          });
          this.editTable.medicalExamReportLogo =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.editTable.medicalExamReportLogoTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*新增医院地推LOGO*/
      handNewImgSuccess(res) {
        this.showExtens = false
        if (res.status === 200) {
          this.showExtens = true;
          this.addTable.extensionLogoUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.addTable.extensionLogoUrlTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*新增供应商主图*/
      mainNewPictureSuccess(res) {
        this.showExtens = false;
        if (res.status === 200) {
          this.showExtens = true;
          this.addTable.mainPicture =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*新增医院地推宣传图*/
      handNewDituiSuccess(res) {
        this.showExtens = false
        if (res.status === 200) {
          this.showExtens = true;
          this.addTable.extensionImageUrl =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.addTable.extensionImageUrlTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*新增体检报告LOGO*/
      handNewTijianSuccess(res) {
        this.showExtens = false
        if (res.status === 200) {
          this.showExtens = true;
          this.addTable.medicalExamReportLogo =
            'http://zhangshangtijian.b0.upaiyun.com' + res.data.url;
          this.addTable.medicalExamReportLogoTime = res.data.time;
        } else {
          IsAlert(res.msg, '错误', 'error');
        }
      },
      /*搜索方法*/
      doSearch() {
        this.searchParams.currentPage = 1;
        this.getList()
      },
      /*选择每页条数*/
      handleSizeChange(size) {
        this.searchParams.pageSize = size;
        this.getList()
      },
      /*选择当前页*/
      handleCurrentChange(currentPage) {
        this.searchParams.currentPage = currentPage;
        this.getList()
      },
      /*查询参数初始化*/
      handleReset() {
        this.searchParams.selectInstitutionName = '';
        this.searchParams.selectInstitutionCode = '';
        this.searchParams.currentPage = 1;
        this.searchParams.pageSize = 10;
        this.getList();
        return false
      },
      /*选择时间的数据处理*/
      dateHandle() {
        this.addTable.serviceDate = this.addTable.DateSel.join(',');
      },
      dateEdit() {
        this.editTable.serviceDate = this.dataEdit.DateSel.join(',');
      },
      /*新增*/
      handleAdd() {
        this.RrovinceChildList = [];//城市置空
        this.dialogAddVisible = true;
      },
      /*确定新增*/
      _doAdd() {
        this.addTable.createUser = EncodeUserId(this.userInfo.userId);
        let params = {
          provinceId: this.addTable.provinceId,//省份
          cityId: this.addTable.cityId,//城市
          createUser: this.addTable.createUser,
          institutionAddr: this.addTable.institutionAddr,
          institutionCode: this.addTable.institutionCode,
          institutionDesc: this.addTable.institutionDesc,
          institutionExtensionUrl: this.addTable.institutionExtensionUrl,
          institutionName: this.addTable.institutionName,
          institutionType: this.addTable.institutionType,
          medicalExamReportLogo: this.addTable.medicalExamReportLogo,
          whetherDelete: this.addTable.whetherDelete,
          whetherExtension: this.addTable.whetherExtension,
          checkFee: this.addTable.checkFee,
          latitude: this.addTable.latitude,
          longitude: this.addTable.longitude,
          serviceDate: this.addTable.serviceDate,
          mainPicture: this.addTable.mainPicture,
          synopsis: this.addTable.synopsis
        };
        if (!this.paramsCheck(this.addTable)) {
          return;
        }
        if (this.doubleClick) {
          this.$message({
            message: '请不要重复点击!',
            type: 'warning'
          });
          return;
        }
        this.doubleClick = true;
        PostInstitutionSave(params).then(response => {
          if (response.code === ERR_OK) {
            this.doubleClick = false;
            this.getList();
            IsAlert('新增成功!', '成功', 'success');
            this.handleCloseAdd()
          } else {
            this.doubleClick = false;
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*取消新增*/
      _doAddCancel() {
        this.handleCloseAdd()
        this.$message({
          type: 'warning',
          message: '取消新增'
        })
      },
      handleCloseAdd() {
        //新增弹窗重置数据
        this.searchParams.pageSize = 10;
        this.searchParams.currentPage = 1;
        this.getList();
        this.activeNameAdd = "first";
        this.addTable.cityId = '';//城市/
        this.addTable.provinceId = '';//省份/
        this.addTable.institutionCategory = '';//机构类型/
        this.addTable.institutionName = '';//机构名称/
        this.addTable.institutionAddr = '';//机构地址/
        this.addTable.institutionCode = '';//机构编号/
        this.addTable.whetherExtension = 1;//是否推广(0否 1是)//
        this.addTable.medicalExamReportLogo = '';//体检报告LOGO链接//
        this.addTable.institutionExtensionUrl = '';//地推链接
        this.addTable.createUser = '';//创建人ID
        this.addTable.institutionDesc = '1';//描述
        this.addTable.institutionId = '1';//机构id
        this.addTable.updateUser = '1';//修改人ID
        this.addTable.whetherDelete = 1;//是否删除（0否 1是)
        this.addTable.extensionLogoUrl = '';
        this.addTable.institutionType = '';
        this.addTable.extensionImageUrl = '';
        this.addTable.checkFee = 1;//是否可查看付费项（是：1；否：0）默认为是；当选择否时，报告详情页面则需要修改
        this.addTable.latitude = ''; //纬度 ,
        this.addTable.longitude = '';// 经度 ,
        this.addTable.serviceDate = '';// 服务时间（多个日期）
        this.addTable.DateSel = [];//初始服务时间
        this.addTable.mainPicture = '';//机构主图
        this.addTable.synopsis = '';//机构主图
        this.dialogAddVisible = false
      },
      /*机构code改变*/
      codeChange() {
        if (this.dialogAddVisible) {
          this.addTable.extensionImageUrl = '';
          this.addTable.extensionLogoUrl = '';
        } else if (this.dialogEditVisible) {
          this.editTable.extensionImageUrl = '';
          this.editTable.extensionLogoUrl = '';
          this.refreshImg();
        }
      },
      /*预览网页*/
      previewPage() {
        let url = previwUrl + this.selectTable.institutionCode;
        window.open(url)
      },
      /*生成地推短连接(调第三方)*/
      CreateLink() {
        let that = this;
        if (this.addTable.institutionCode === '') {
          IsAlert('请输入机构编号！', '提示', 'warning');
          return;
        } else if (this.addTable.institutionName === '') {
          IsAlert('请输入机构名称！', '提示', 'warning');
          return;
        } else if (this.addTable.extensionLogoUrl === '') {
          IsAlert('请上传地推LOGO！', '提示', 'warning');
          return;
        } else if (this.addTable.extensionImageUrl === '') {
          IsAlert('请上传医院地推宣传图！', '提示', 'warning');
          return;
        }
        let longLink = inslongLink + this.addTable.institutionCode + "/" + this.addTable.institutionName;
        let parLink = {
          longLink: inslongLink + this.addTable.institutionCode + "/" + this.addTable.institutionName + "/" + createRequestToken(longLink)
        };
        this.loading2 = true;
        /*长链接改为短链接*/
        getShortLink(parLink).then((res) => {
          if (res.code === ERR_OK) {
            this.addTable.institutionExtensionUrl = res.data;
            this.longLinkUrl = res.data;
            setTimeout(function () {
              that.loading2 = false;
            }, 500);
          } else {
            setTimeout(function () {
              that.loading2 = false;
            }, 500);
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      /*修改生成地推短链接(调第三方)*/
      EditCreateLink() {
        let that = this;
        if (this.editTable.institutionCode === '') {
          IsAlert('请输入机构编号！', '提示', 'warning');
          return;
        } else if (this.editTable.institutionName === '') {
          IsAlert('请输入机构名称！', '提示', 'warning');
          return;
        }
        let longLink = inslongLink + this.editTable.institutionCode + "/" + this.editTable.institutionName;
        let parLink = {
          longLink: inslongLink + this.editTable.institutionCode + "/" + this.editTable.institutionName + "/" + createRequestToken(longLink)
        };
        this.loading2 = true;
        /*长链接改为短链接*/
        getShortLink(parLink).then((res) => {
          if (res.code === ERR_OK) {
            this.editTable.institutionExtensionUrl = res.data;
            this.longLinkUrl = res.data;
            setTimeout(function () {
              that.loading2 = false;
            }, 500);
          } else {
            setTimeout(function () {
              that.loading2 = false;
            }, 500);
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
      },
      /*查看*/
      handleCheck(index, row) {
        let params = {
          id: row.institutionId
        };
        let params2 = {
              level: 2,
              parentId: row.provinceId,
        };
        this.GetlistGetRrovinceChild(row.provinceId);
        // this.getInstitutionUser(row.institutionId);
        this.loading3 = true;
        /*查看详情*/
        Insinfo(params).then((res) => {
          if (res.code === ERR_OK) {
            this.selectTable = res.data;
            if (this.selectTable.provinceId) {//根据省份获取城市
              listGetRrovinceChild(params2)
              .then((res) => {
                if (res.code === ERR_OK) {
                  this.RrovinceChildList =[];
                  this.RrovinceChildList = res.data;
                  let provinceId = {};
                  let cityId = {};
                  provinceId = this.RrovinceList.find((item)=>{
                    return item.id+'' === this.selectTable.provinceId;
                  });
                  this.selectTable.provinceId = (provinceId)? provinceId.regionName:'未选择';
                  cityId = this.RrovinceChildList.find((item)=>{
                    return item.id+"" === this.selectTable.cityId;
                  });
                  this.selectTable.cityId = (cityId)? cityId.regionName:'未选择';
                } else {
                  IsAlert(res.msg, '提示', 'Warning')
                }
              }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            });
            }else{
              this.selectTable.cityId = '未选择';
              this.selectTable.provinceId = '未选择';
            }
            this.checkImg = Date.parse(new Date());
            let that = this;
            let longLink = inslongLink + res.data.institutionCode + "/" + res.data.institutionName;
            let parLink = {
              longLink: inslongLink + res.data.institutionCode + "/" + res.data.institutionName + "/" + createRequestToken(longLink)
            };
            getShortLink(parLink).then((res) => {
              if (res.code === ERR_OK) {
                that.selectTable.institutionExtensionUrl = res.data;
                that.loading3 = false;
                that.dialogCheckVisible = true;
              } else {
                that.loading3 = false;
                IsAlert(res.msg, '错误', 'error');
                that.loading3 = false;
              }
            }).catch(() => {
              this.$message.error('网络错误!请稍后重试')
            });
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*修改*/
      handleEdit(index, row) {
        let params = {
          id: row.institutionId
        };
        // this.getInstitutionUser(row.institutionId);
        /*查看详情*/
        Insinfo(params).then((res) => {
          if (res.code === ERR_OK) {
            res.data.institutionDesc = res.data.institutionDesc ? res.data.institutionDesc : '';
            this.editTable = res.data;
            if (res.data.serviceDate) {
              this.dataEdit.DateSel = res.data.serviceDate.split(',');
            } else {
              this.dataEdit.DateSel = [];
            };
            if (res.data.provinceId) {//有省份id
              this.GetlistGetRrovinceChild(res.data.provinceId)
            } else {
              this.RrovinceChildList = [];//重置城市
            }
            /*医院地推logo*/
            this.editTable.extensionLogoUrl = this.InsLogoUrl + res.data.institutionCode + '.png';
            /*医院宣传图*/
            this.editTable.extensionImageUrl = this.InsImageUrl + res.data.institutionCode + '.jpg';
            this.editTable.extensionLogoUrlTime = Math.random();
            this.editTable.extensionImageUrlTime = Math.random();
            this.editTable.provinceId=this.editTable.provinceId ? Number(this.editTable.provinceId) : '';
            this.editTable.cityId=this.editTable.cityId ? Number(this.editTable.cityId) : '';
            this.dialogEditVisible = true;
          } else {
            IsAlert(res.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*请求参数验证*/
      paramsCheck(params) {
        if (params.institutionCode === '' || params.institutionName === '' || params.institutionAddr === '' || params.institutionType==='') {
          IsAlert('请完善基础信息！', '提示', 'warning');
          return false;
        } else if (params.extensionLogoUrl === '') {
          IsAlert('请上传地推LOGO！', '提示', 'warning');
          return false
        } else if (params.extensionImageUrl === '') {
          IsAlert('请上传医院地推宣传图！', '提示', 'warning');
          return false
        } else if (params.medicalExamReportLogo === '') {
          IsAlert('请上传体检报告logo！', '提示', 'warning');
          return false
        } else {
          return true;
        }
      },
      /*确定修改*/
      _doHandleEdit() {
        this.editTable.updateUser = EncodeUserId(this.userInfo.userId);
        let params = {
          provinceId: this.editTable.provinceId,//省份
          cityId: this.editTable.cityId,//城市
          institutionAddr: this.editTable.institutionAddr,
          institutionCode: this.editTable.institutionCode,
          institutionDesc: this.editTable.institutionDesc,
          institutionExtensionUrl: this.editTable.institutionExtensionUrl,
          institutionId: this.editTable.institutionId,
          institutionName: this.editTable.institutionName,
          institutionType: this.editTable.institutionType,
          medicalExamReportLogo: this.editTable.medicalExamReportLogo,
          updateUser: this.editTable.updateUser,
          whetherDelete: this.editTable.whetherDelete,
          whetherExtension: this.editTable.whetherExtension,
          checkFee: this.editTable.checkFee,
          latitude: this.editTable.latitude,
          longitude: this.editTable.longitude,
          serviceDate: this.editTable.serviceDate,
          mainPicture: this.editTable.mainPicture,
          synopsis: this.editTable.synopsis
        };
        if (!this.paramsCheck(this.editTable)) {
          return;
        }
        PostInstitutionUpdate(params).then(response => {
          if (response.code === ERR_OK) {
            IsAlert('修改成功!', '成功', 'success');
          } else {
            IsAlert(response.msg, '错误', 'error');
          }
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        });
        this.handleCloseEidt();
      },
      //取消修改
      _doCancel() {
        this.handleCloseEidt();
        this.$message({
          type: 'warning',
          message: '取消修改'
        })
      },
      handleCloseEidt() {
        this.activeNameEdit = "first";
        this.editTable.cityId = '';//城市/
        this.editTable.provinceId = '';//省份/
        this.editTable.institutionCategory = '';//机构类型/
        this.editTable.institutionName = '';//机构名称/
        this.editTable.institutionAddr = '';//机构地址/
        this.editTable.institutionCode = '';//机构编号/
        this.editTable.whetherExtension = 1;//是否推广(0否 1是)//
        this.editTable.medicalExamReportLogo = '';//体检报告LOGO链接//
        this.editTable.institutionExtensionUrl = '';//地推链接
        this.editTable.institutionDesc = '1';//描述
        this.editTable.institutionId = '1';//机构id
        this.editTable.updateUser = '1';//修改人ID
        this.editTable.whetherDelete = 1;//是否删除（0否 1是)
        this.editTable.extensionLogoUrl = '';
        this.editTable.institutionType = '';/*医院地推logo*/
        this.editTable.extensionImageUrl = '';/*医院宣传图*/
        this.editTable.checkFee = 1;//是否可查看付费项（是：1；否：0）默认为是；
        this.editTable.latitude = ''; //纬度 ,
        this.editTable.longitude = '';// 经度 ,
        this.editTable.serviceDate = '';// 服务时间（多个日期）
        this.editTable.DateSel = [];//初始服务时间
        this.editTable.synopsis = '';//机构简介
        this.editTable.mainPicture = '';//机构主图
        this.getList();
        //编辑弹窗重置数据
        this.dialogEditVisible = false
      },
      /*获取机构列表*/
      getList() {
        let params = {
          selectInstitutionCategory: this.searchParams.selectInstitutionCategory,
          selectInstitutionName: this.searchParams.selectInstitutionName,
          selectInstitutionCode: this.searchParams.selectInstitutionCode,
          institutionType: this.searchParams.institutionType,
          currentPage: this.searchParams.currentPage,
          pageSize: this.searchParams.pageSize,
        };
        PostInstitutionList(params).then(response => {
          this.tableData = [];
          this.tableData = response.data.list;
          this.totalCount = response.data.totalCount
        }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*刷新图片*/
      refreshImg() {
        this.showExtens = false;
        let that = this;
        setTimeout(function () {
          that.showExtens = true;
        }, 200)
      },
      /*获取省级区域列表信息*/
      GetlistGetRrovince() {
        let params = {};
        listGetRrovince(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.RrovinceList = res.data
            } else {
              IsAlert(res.msg, '提示', 'Warning')
            }
          }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
      },
      /*获取市级区域列表信息*/
      GetlistGetRrovinceChild(val) {
        let params = {
          level: 2,
          parentId: val,
        };
        if (val) {
          listGetRrovinceChild(params)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.RrovinceChildList =[];
              this.RrovinceChildList = res.data;
            } else {
              IsAlert(res.msg, '提示', 'Warning')
            }
          }).catch(() => {
          this.$message.error('网络错误!请稍后重试')
        })
        } else {
          this.addTable.cityId = '';
          this.editTable.cityId = '';
          this.RrovinceChildList = [];
        }
      },
      custormUserSelect(val) {
        let userValue = '';
        this.institutionUserList.filter((v) => {
          if (v.userId === val) {
            userValue = v.userName;
          }
        });
        return userValue;
      }
    },
    activated: function () {
      // this.upImgUrl =
      this.userInfo = JSON.parse(getStore('userMesage'));
      this.getList();
      this.GetlistGetRrovince();
    }
  }
</script>

<style lang="less">
  // 上传样式
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
</style>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .grid-content {
    min-height: 12px;
  }

  /*  .dateSel /deep/ .el-input.el-input--suffix {
      width: 350px;
      margin-right:0;
    }*/
  .demo-ruleForm /deep/ .el-col.el-col-16 {
    height: 40px;
  }

  .demo-ruleForm /deep/ .el-input {
    width: 200px;
  }

  .demo-ruleForm.el-form.el-form--inline {
    display: flex;
    align-content: space-between;
  }

  .demo-ruleForm /deep/ .el-form-item {
    flex: 1;
    margin-bottom: 0px;
  }

  .box-card {
    margin-bottom: 10px;
    .tipStyle {
      line-height: 24px;
      margin-top: 10px;
      display: inline-block;
      color: rgb(245, 108, 108);
    }
  }

  .selPage {
    margin-top: 20px;
    text-align: center;
  }

  /*.minwidth {
    min-width: 150px;
  }
  .minwidthB {
    min-width: 250px;
  }*/
  .el-select {
    display: block;
  }

  .el-input {
    margin-bottom: 15px;
  }

  .el-form {
    margin-top: 15px;
  }

  /*查看选中项*/
  .messageTitle {
    padding: 5px 5px;
    border-bottom: 1px solid #c9c9c9;
    font-size: 17px;
    font-weight: 600;
  }

  .messageTitle p {
    margin-left: 20px;
    display: flex;
  }

  .messageMain {
    padding: 5px;
  }

  .messageBody {
    margin-top: 20px;
  }

  .messageBody li {
    margin-bottom: 5px;
  }

  .messageBody .messageli {
    display: flex;
    padding: 0 20px 0 40px;
    overflow: hidden;
  }

  .messageBody span {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
    text-align: left;
  }

  .msgfr {
    flex: 1;
  }

  .msgfl {
    flex: 1;
  }

  .ml20 {
    margin-left: 10px;
  }

  .cir-style {
    background: #f60;
    /*width: 30px;*/
    height: 20px;
    line-height: 20px;
    padding: 5px 20px;
    border-radius: 15px;
    font-weight: 400;
    color: #fff;
  }

  .cir-bstyle {
    background: #3c8dbc;
    /*width: 30px;*/
    height: 20px;
    line-height: 20px;
    padding: 5px 20px;
    border-radius: 15px;
    font-weight: 400;
    color: #fff;
  }

  .reStyle {
    text-align: center;
    margin: 30px;
  }

  .img-style {
    width: 200px;
    height: 200px;
    box-sizing: content-box;
    vertical-align: top;
  }

  .el-upload__tip {
    width: calc(100% - 150px);
    float: right;
    font-size: 12px;
    line-height: 20px;
    display: inline-block;
    margin-top: 20px;
    margin-right: 10px;
  }

  .btn-row {
    text-align: center;
    padding-top: 20px;
  }

  .el-header, .el-main, .el-footer {
    padding: 0;
    min-width: 500px
  }

  .instion-style /deep/ .el-form-item__label {
    line-height: 24px;
    margin-top: 10px;
    display: inline-block;
  }
</style>
