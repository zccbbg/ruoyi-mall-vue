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
      <el-form-item label="退款金额" prop="returnAmount">
        <el-input
          v-model="queryParams.returnAmount"
          placeholder="请输入退款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售后类型：1：退款，2：退货退款" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择售后类型：1：退款，2：退货退款" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理时间" prop="handleTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.handleTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择处理时间">
        </el-date-picker>
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
      <template v-if="showMoreCondition">
      <el-form-item label="原因" prop="reason">
        <el-input
          v-model="queryParams.reason"
          placeholder="请输入原因"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理人员" prop="handleMan">
        <el-input
          v-model="queryParams.handleMan"
          placeholder="请输入处理人员"
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
          v-hasPermi="['oms:refund:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="omsRefundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="MEMBER_ID" align="center" prop="memberId" />
      <el-table-column label="订单id" align="center" prop="orderId" />
      <el-table-column label="退款金额" align="center" prop="returnAmount" />
      <el-table-column label="售后类型：1：退款，2：退货退款" align="center" prop="type" />
      <el-table-column label="申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝" align="center" prop="status" />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.handleTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货数量" align="center" prop="quantity" />
      <el-table-column label="原因" align="center" prop="reason" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="凭证图片，以逗号隔开" align="center" prop="proofPics" />
      <el-table-column label="处理备注" align="center" prop="handleNote" />
      <el-table-column label="处理人员" align="center" prop="handleMan" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:refund:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:refund:remove']"
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
        <el-form-item label="退款金额" prop="returnAmount">
          <el-input v-model="form.returnAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="售后类型：1：退款，2：退货退款" prop="type">
          <el-select v-model="form.type" placeholder="请选择售后类型：1：退款，2：退货退款">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理时间" prop="handleTime">
          <el-date-picker clearable size="small"
                        v-model="form.handleTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入退货数量" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入原因" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="凭证图片，以逗号隔开" prop="proofPics">
          <el-input v-model="form.proofPics" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理备注" prop="handleNote">
          <el-input v-model="form.handleNote" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理人员" prop="handleMan">
          <el-input v-model="form.handleMan" placeholder="请输入处理人员" />
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
import { listOmsRefund, getOmsRefund, delOmsRefund, addOmsRefund, updateOmsRefund, exportOmsRefund } from "@/api/oms/refund";

export default {
  name: "OmsRefund",
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
      omsRefundList: [],
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
        returnAmount: null,
        type: null,
        status: null,
        handleTime: null,
        quantity: null,
        reason: null,
        description: null,
        proofPics: null,
        handleNote: null,
        handleMan: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "MEMBER_ID不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
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
      listOmsRefund(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsRefundList = content;
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
        returnAmount: null,
        type: null,
        status: 0,
        handleTime: null,
        quantity: null,
        reason: null,
        description: null,
        proofPics: null,
        handleNote: null,
        handleMan: null,
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
      getOmsRefund(id).then(response => {
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
            updateOmsRefund(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsRefund(this.form).then(response => {
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
        return delOmsRefund(ids);
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
        return exportOmsRefund(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
