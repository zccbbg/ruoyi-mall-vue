<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="payment_id" prop="paymentId">
        <el-input
          v-model="queryParams.paymentId"
          placeholder="请输入payment_id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户 ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="请输入用户 ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="OPENID" prop="openid">
        <el-input
          v-model="queryParams.openid"
          placeholder="请输入OPENID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真实姓名，提现需要" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入真实姓名，提现需要"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题|商品名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题|商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号 支付时是payId 其他为orderId" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号 支付时是payId 其他为orderId"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额，单位分" prop="money">
        <el-input
          v-model="queryParams.money"
          placeholder="请输入金额，单位分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="交易类型" prop="opType">
        <el-select v-model="queryParams.opType" placeholder="请选择交易类型" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="paymentStatus">
        <el-select v-model="queryParams.paymentStatus" placeholder="请选择状态" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="附加数据" prop="attach">
        <el-input
          v-model="queryParams.attach"
          placeholder="请输入附加数据"
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
          v-hasPermi="['pms:wechatPaymentHistory:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="omsWechatPaymentHistoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="payment_id" align="center" prop="paymentId" />
      <el-table-column label="用户 ID" align="center" prop="memberId" />
      <el-table-column label="OPENID" align="center" prop="openid" />
      <el-table-column label="真实姓名，提现需要" align="center" prop="realName" />
      <el-table-column label="标题|商品名称" align="center" prop="title" />
      <el-table-column label="订单号 支付时是payId 其他为orderId" align="center" prop="orderId" />
      <el-table-column label="金额，单位分" align="center" prop="money" />
      <el-table-column label="交易类型" align="center" prop="opType" />
      <el-table-column label="状态" align="center" prop="paymentStatus" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="附加数据" align="center" prop="attach" />
      <el-table-column label="响应内容" align="center" prop="responseBody" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:wechatPaymentHistory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:wechatPaymentHistory:remove']"
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

    <!-- 添加或修改微信订单表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="payment_id" prop="paymentId">
          <el-input v-model="form.paymentId" placeholder="请输入payment_id" />
        </el-form-item>
        <el-form-item label="用户 ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入用户 ID" />
        </el-form-item>
        <el-form-item label="OPENID" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入OPENID" />
        </el-form-item>
        <el-form-item label="真实姓名，提现需要" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名，提现需要" />
        </el-form-item>
        <el-form-item label="标题|商品名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题|商品名称" />
        </el-form-item>
        <el-form-item label="订单号 支付时是payId 其他为orderId" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单号 支付时是payId 其他为orderId" />
        </el-form-item>
        <el-form-item label="金额，单位分" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额，单位分" />
        </el-form-item>
        <el-form-item label="交易类型" prop="opType">
          <el-select v-model="form.opType" placeholder="请选择交易类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.paymentStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="附加数据" prop="attach">
          <el-input v-model="form.attach" placeholder="请输入附加数据" />
        </el-form-item>
        <el-form-item label="响应内容" prop="responseBody">
          <el-input v-model="form.responseBody" type="textarea" placeholder="请输入内容" />
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
import { listOmsWechatPaymentHistory, getOmsWechatPaymentHistory, delOmsWechatPaymentHistory, addOmsWechatPaymentHistory, updateOmsWechatPaymentHistory, exportOmsWechatPaymentHistory } from "@/api/oms/wechatPaymentHistory";

export default {
  name: "OmsWechatPaymentHistory",
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
      // 微信订单表表格数据
      omsWechatPaymentHistoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paymentId: null,
        memberId: null,
        openid: null,
        realName: null,
        title: null,
        orderId: null,
        money: null,
        opType: null,
        paymentStatus: null,
        attach: null,
        responseBody: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "用户 ID不能为空", trigger: "blur" }
        ],
        openid: [
          { required: true, message: "OPENID不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题|商品名称不能为空", trigger: "blur" }
        ],
        orderId: [
          { required: true, message: "订单号 支付时是payId 其他为orderId不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额，单位分不能为空", trigger: "blur" }
        ],
        opType: [
          { required: true, message: "交易类型不能为空", trigger: "change" }
        ],
        paymentStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询微信订单表列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listOmsWechatPaymentHistory(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsWechatPaymentHistoryList = content;
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
        paymentId: null,
        memberId: null,
        openid: null,
        realName: null,
        title: null,
        orderId: null,
        money: null,
        opType: null,
        paymentStatus: 0,
        remark: null,
        attach: null,
        responseBody: null,
        createBy: null,
        createTime: null,
        updateBy: null,
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
      this.title = "添加微信订单表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOmsWechatPaymentHistory(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改微信订单表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOmsWechatPaymentHistory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsWechatPaymentHistory(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除微信订单表编号为"' + ids + '"的数据项？').then(function() {
        return delOmsWechatPaymentHistory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有微信订单表数据项？').then(() => {
        this.exportLoading = true;
        return exportOmsWechatPaymentHistory(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
