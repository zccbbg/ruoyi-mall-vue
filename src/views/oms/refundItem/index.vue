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
      <el-form-item label="订单id" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子订单id" prop="orderItemId">
        <el-input
          v-model="queryParams.orderItemId"
          placeholder="请输入子订单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退款金额" prop="returnAmount">
        <el-input
          v-model="queryParams.returnAmount"
          placeholder="请输入退款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退货数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入退货数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['oms:refundItem:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="omsRefundItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="MEMBER_ID" align="center" prop="memberId" />
      <el-table-column label="订单id" align="center" prop="orderId" />
      <el-table-column label="子订单id" align="center" prop="orderItemId" />
      <el-table-column label="退款金额" align="center" prop="returnAmount" />
      <el-table-column label="退货数量" align="center" prop="quantity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:refundItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:refundItem:remove']"
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

    <!-- 添加或修改订单售后对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="MEMBER_ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入MEMBER_ID" />
        </el-form-item>
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="子订单id" prop="orderItemId">
          <el-input v-model="form.orderItemId" placeholder="请输入子订单id" />
        </el-form-item>
        <el-form-item label="退款金额" prop="returnAmount">
          <el-input v-model="form.returnAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入退货数量" />
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
import { listOmsRefundItem, getOmsRefundItem, delOmsRefundItem, addOmsRefundItem, updateOmsRefundItem, exportOmsRefundItem } from "@/api/oms/refundItem";

export default {
  name: "OmsRefundItem",
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
      // 订单售后表格数据
      omsRefundItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberId: null,
        orderId: null,
        orderItemId: null,
        returnAmount: null,
        quantity: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "MEMBER_ID不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单售后列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listOmsRefundItem(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsRefundItemList = content;
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
        orderId: null,
        orderItemId: null,
        returnAmount: null,
        quantity: null,
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
      this.title = "添加订单售后";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOmsRefundItem(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改订单售后";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOmsRefundItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsRefundItem(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除订单售后编号为"' + ids + '"的数据项？').then(function() {
        return delOmsRefundItem(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有订单售后数据项？').then(() => {
        this.exportLoading = true;
        return exportOmsRefundItem(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
