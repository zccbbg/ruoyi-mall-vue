<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户备注" prop="mark">
        <el-input
          v-model="queryParams.mark"
          placeholder="请输入用户备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="帐号启用状态:0->禁用；1->启用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择帐号启用状态:0->禁用；1->启用" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入头像"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别：0->未知；1->男；2->女" prop="gender">
        <el-input
          v-model="queryParams.gender"
          placeholder="请输入性别：0->未知；1->男；2->女"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="用户所在城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入用户所在城市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户所在省份" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入用户所在省份"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户所在国家" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入用户所在国家"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.birthday"
            type="datetime"
            value-format="yyyy-MM-dd"
            placeholder="选择生日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="推广员id" prop="spreadUid">
        <el-input
          v-model="queryParams.spreadUid"
          placeholder="请输入推广员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推广员关联时间" prop="spreadTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.spreadTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择推广员关联时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户剩余积分" prop="integral">
        <el-input
          v-model="queryParams.integral"
          placeholder="请输入用户剩余积分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['ums:member:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="umsMemberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="手机号码" align="center" prop="phone" />
      <el-table-column label="用户备注" align="center" prop="mark" />
      <el-table-column label="帐号启用状态:0->禁用；1->启用" align="center" prop="status" />
      <el-table-column label="头像" align="center" prop="avatar" />
      <el-table-column label="性别：0->未知；1->男；2->女" align="center" prop="gender" />
      <el-table-column label="用户所在城市" align="center" prop="city" />
      <el-table-column label="用户所在省份" align="center" prop="province" />
      <el-table-column label="用户所在国家" align="center" prop="country" />
      <el-table-column label="公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注" align="center" prop="remark" />
      <el-table-column label="生日" align="center" prop="birthday" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广员id" align="center" prop="spreadUid" />
      <el-table-column label="推广员关联时间" align="center" prop="spreadTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.spreadTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" prop="level" />
      <el-table-column label="用户剩余积分" align="center" prop="integral" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ums:member:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ums:member:remove']"
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

    <!-- 添加或修改会员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="用户备注" prop="mark">
          <el-input v-model="form.mark" placeholder="请输入用户备注" />
        </el-form-item>
        <el-form-item label="帐号启用状态:0->禁用；1->启用">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="性别：0->未知；1->男；2->女" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别：0->未知；1->男；2->女" />
        </el-form-item>
        <el-form-item label="用户所在城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入用户所在城市" />
        </el-form-item>
        <el-form-item label="用户所在省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入用户所在省份" />
        </el-form-item>
        <el-form-item label="用户所在国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入用户所在国家" />
        </el-form-item>
        <el-form-item label="公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable size="small"
                        v-model="form.birthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推广员id" prop="spreadUid">
          <el-input v-model="form.spreadUid" placeholder="请输入推广员id" />
        </el-form-item>
        <el-form-item label="推广员关联时间" prop="spreadTime">
          <el-date-picker clearable size="small"
                        v-model="form.spreadTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择推广员关联时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="用户剩余积分" prop="integral">
          <el-input v-model="form.integral" placeholder="请输入用户剩余积分" />
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
import { listUmsMember, getUmsMember, delUmsMember, addUmsMember, updateUmsMember, exportUmsMember } from "@/api/ums/member";

export default {
  name: "UmsMember",
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
      // 会员信息表格数据
      umsMemberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        password: null,
        phone: null,
        mark: null,
        status: null,
        avatar: null,
        gender: null,
        city: null,
        province: null,
        country: null,
        birthday: null,
        spreadUid: null,
        spreadTime: null,
        level: null,
        integral: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        level: [
          { required: true, message: "等级不能为空", trigger: "blur" }
        ],
        integral: [
          { required: true, message: "用户剩余积分不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会员信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listUmsMember(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.umsMemberList = content;
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
        nickname: null,
        password: null,
        phone: null,
        mark: null,
        status: 0,
        avatar: null,
        gender: null,
        city: null,
        province: null,
        country: null,
        remark: null,
        birthday: null,
        spreadUid: null,
        spreadTime: null,
        level: null,
        integral: null,
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
      this.title = "添加会员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUmsMember(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改会员信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUmsMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUmsMember(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除会员信息编号为"' + ids + '"的数据项？').then(function() {
        return delUmsMember(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有会员信息数据项？').then(() => {
        this.exportLoading = true;
        return exportUmsMember(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
