<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="MEMBER_ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="请输入MEMBER_ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段" prop="unionid">
        <el-input
          v-model="queryParams.unionid"
          placeholder="请输入只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户的标识，对当前公众号唯一" prop="openid">
        <el-input
          v-model="queryParams.openid"
          placeholder="请输入用户的标识，对当前公众号唯一"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小程序唯一身份ID" prop="routineOpenid">
        <el-input
          v-model="queryParams.routineOpenid"
          placeholder="请输入小程序唯一身份ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户所在的分组ID" prop="groupid">
        <el-input
          v-model="queryParams.groupid"
          placeholder="请输入用户所在的分组ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户被打上的标签ID列表" prop="tagidList">
        <el-input
          v-model="queryParams.tagidList"
          placeholder="请输入用户被打上的标签ID列表"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户是否订阅该公众号标识" prop="subscribe">
        <el-input
          v-model="queryParams.subscribe"
          placeholder="请输入用户是否订阅该公众号标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="关注公众号时间" prop="subscribeTime">
        <el-input
          v-model="queryParams.subscribeTime"
          placeholder="请输入关注公众号时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小程序用户会话密匙" prop="sessionKey">
        <el-input
          v-model="queryParams.sessionKey"
          placeholder="请输入小程序用户会话密匙"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="过期时间" prop="expiresIn">
        <el-input
          v-model="queryParams.expiresIn"
          placeholder="请输入过期时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="过期时间" prop="expireTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.expireTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择过期时间">
        </el-date-picker>
      </el-form-item>
    </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ums:memberWechat:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="umsMemberWechatList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="MEMBER_ID" align="center" prop="memberId" />
      <el-table-column label="只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段" align="center" prop="unionid" />
      <el-table-column label="用户的标识，对当前公众号唯一" align="center" prop="openid" />
      <el-table-column label="小程序唯一身份ID" align="center" prop="routineOpenid" />
      <el-table-column label="用户所在的分组ID" align="center" prop="groupid" />
      <el-table-column label="用户被打上的标签ID列表" align="center" prop="tagidList" />
      <el-table-column label="用户是否订阅该公众号标识" align="center" prop="subscribe" />
      <el-table-column label="关注公众号时间" align="center" prop="subscribeTime" />
      <el-table-column label="小程序用户会话密匙" align="center" prop="sessionKey" />
      <el-table-column label="token" align="center" prop="accessToken" />
      <el-table-column label="过期时间" align="center" prop="expiresIn" />
      <el-table-column label="刷新token" align="center" prop="refreshToken" />
      <el-table-column label="过期时间" align="center" prop="expireTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.expireTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ums:memberWechat:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ums:memberWechat:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户微信信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="MEMBER_ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入MEMBER_ID" />
        </el-form-item>
        <el-form-item label="只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段" prop="unionid">
          <el-input v-model="form.unionid" placeholder="请输入只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段" />
        </el-form-item>
        <el-form-item label="用户的标识，对当前公众号唯一" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入用户的标识，对当前公众号唯一" />
        </el-form-item>
        <el-form-item label="小程序唯一身份ID" prop="routineOpenid">
          <el-input v-model="form.routineOpenid" placeholder="请输入小程序唯一身份ID" />
        </el-form-item>
        <el-form-item label="用户所在的分组ID" prop="groupid">
          <el-input v-model="form.groupid" placeholder="请输入用户所在的分组ID" />
        </el-form-item>
        <el-form-item label="用户被打上的标签ID列表" prop="tagidList">
          <el-input v-model="form.tagidList" placeholder="请输入用户被打上的标签ID列表" />
        </el-form-item>
        <el-form-item label="用户是否订阅该公众号标识" prop="subscribe">
          <el-input v-model="form.subscribe" placeholder="请输入用户是否订阅该公众号标识" />
        </el-form-item>
        <el-form-item label="关注公众号时间" prop="subscribeTime">
          <el-input v-model="form.subscribeTime" placeholder="请输入关注公众号时间" />
        </el-form-item>
        <el-form-item label="小程序用户会话密匙" prop="sessionKey">
          <el-input v-model="form.sessionKey" placeholder="请输入小程序用户会话密匙" />
        </el-form-item>
        <el-form-item label="token" prop="accessToken">
          <el-input v-model="form.accessToken" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expiresIn">
          <el-input v-model="form.expiresIn" placeholder="请输入过期时间" />
        </el-form-item>
        <el-form-item label="刷新token" prop="refreshToken">
          <el-input v-model="form.refreshToken" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker clearable size="small"
                        v-model="form.expireTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择过期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUmsMemberWechat, getUmsMemberWechat, delUmsMemberWechat, addUmsMemberWechat, updateUmsMemberWechat, exportUmsMemberWechat } from "@/api/ums/memberWechat";

export default {
  name: "UmsMemberWechat",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户微信信息表格数据
      umsMemberWechatList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberId: null,
        unionid: null,
        openid: null,
        routineOpenid: null,
        groupid: null,
        tagidList: null,
        subscribe: null,
        subscribeTime: null,
        sessionKey: null,
        accessToken: null,
        expiresIn: null,
        refreshToken: null,
        expireTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户微信信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listUmsMemberWechat(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.umsMemberWechatList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        memberId: null,
        unionid: null,
        openid: null,
        routineOpenid: null,
        groupid: null,
        tagidList: null,
        subscribe: null,
        subscribeTime: null,
        sessionKey: null,
        accessToken: null,
        expiresIn: null,
        refreshToken: null,
        expireTime: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户微信信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUmsMemberWechat(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改用户微信信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUmsMemberWechat(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUmsMemberWechat(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户微信信息编号为"' + ids + '"的数据项？').then(function() {
        return delUmsMemberWechat(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有用户微信信息数据项？').then(() => {
        this.exportLoading = true;
        return exportUmsMemberWechat(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
