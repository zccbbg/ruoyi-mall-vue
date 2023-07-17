<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="申请状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择申请状态" clearable size="small">
          <el-option v-for="(item, index) in dict.type.oms_aftersale_status" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="售后类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择售后类型" clearable size="small">
          <el-option v-for="(item, index) in dict.type.oms_aftersale_type" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="orderSn">
        <el-input v-model.trim="queryParams.orderSn" placeholder="请输入订单号" clearable size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="售后单号" prop="id">
        <el-input v-model.trim="queryParams.id" placeholder="请输入售后单号" clearable size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="会员手机号" prop="userPhone">
        <el-input v-model.trim="queryParams.userPhone" placeholder="请输入会员手机号" clearable size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="Time">
        <el-date-picker v-model="queryParams.Time" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至" size="small" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" align="right"
                        @change="handleChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="omsAftersaleList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="订单号" align="center" prop="orderSn" width="200"/>
      <el-table-column label="售后单号" align="center" prop="id" width="160"/>
      <el-table-column label="申请状态" align="center" prop="aftersaleStatus" width="80">
        <template v-slot="scope">
          <el-tag effect="plain" size="medium" :type="getAftersaleStatusTag(scope.row)">{{
              getAftersaleStatusText(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" prop="nickName" width="120">
        <template v-slot="scope">
          <div>{{ scope.row.nickName }}</div>
          <div>{{ scope.row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center" prop="applyReturnAmount" width="120"/>
      <el-table-column label="售后类型" align="center" prop="applyRefundType" width="80">
        <template v-slot="scope">
          <el-tag effect="plain" size="medium" :type="getAftersaleTypeTag(scope.row)">{{
              getAftersaleTypeText(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="handleTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.handleTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center" prop="reason" width="220"/>
      <el-table-column label="处理备注" align="center" prop="note" />
      <el-table-column label="处理人员" align="center" prop="handleMan" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.row.orderId)"
                     v-hasPermi="['oms:aftersale:query']">详情</el-button>
          <el-button size="mini" type="text"  @click="approve(scope.row.orderId, 1)"
                     v-if="scope.row.aftersaleStatus == 0" v-hasPermi="['manager:oms:aftersale:update']">同意</el-button>
          <el-button size="mini" type="text"  @click="handleOpen(scope.row.orderId, 2)"
                     v-if="scope.row.aftersaleStatus == 0" v-hasPermi="['manager:oms:aftersale:update']">拒绝</el-button>
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

    <!-- 拒绝对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="updateForm" :model="updateOrderForm" label-width="100px" :rules="rules">
        <el-form-item label="拒绝理由" prop="remark">
          <el-input v-model="updateOrderForm.remark" placeholder="请输入拒绝理由" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdate('updateForm')">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOmsAftersale, getOmsAftersale, delOmsAftersale, addOmsAftersale, updateOmsAftersale, exportOmsAftersale, dealWithAftersale } from "@/api/oms/aftersale";
import dateUtil from '@/utils/DateUtil';

export default {
  name: "OmsAftersale",
  dicts: ["oms_aftersale_type", "oms_aftersale_status"],
  data() {
    return {
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort2()
      },
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
      omsAftersaleList: [],
      // 弹出层标题
      title: "拒绝售后",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderSn: null,
        type: null,
        status: null,
        userPhone: null,
        Time: [],
        startTime: null,
        endTime: null
      },
      // 表单参数
      form: {},
      showMoreCondition: false,
      updateOrderForm: {
        orderId: null,
        optType: null,
        remark: null
      },
      rules: {
        remark: [
          {required: true, message: '请输入拒绝理由', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单售后列表 */
    getList() {
      if (this.queryParams.Time){
        this.queryParams.startTime = this.queryParams.Time[0]
        this.queryParams.endTime = this.queryParams.Time[1]
      }
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listOmsAftersale(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsAftersaleList = content;
        this.total = totalElements;
        this.loading = false;
      });
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
      getOmsAftersale(id).then(response => {
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
            updateOmsAftersale(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsAftersale(this.form).then(response => {
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
        return delOmsAftersale(ids);
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
        return exportOmsAftersale(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    },
    /** 售后详情 */
    handleDetail(orderId){
      const id = orderId
      this.$router.push({ path: '/aftersale/detail', query: { id } })
    },
    /** 同意售后 */
    approve(orderId, type){
      this.updateOrderForm.orderId = orderId
      this.updateOrderForm.optType = type
      dealWithAftersale(this.updateOrderForm).then((response) => {
        this.cancel()
        this.$message.success('操作成功')
        this.getList()
      })
    },
    /** 拒绝 */
    handleOpen(orderId, type){
      this.updateOrderForm.orderId = orderId
      this.updateOrderForm.optType = type
      this.open = true
    },
    getAftersaleStatusTag(row) {
      switch (row.aftersaleStatus) {
        case 0:
          return 'info'
        case 1:
          return 'primary'
        case 2:
          return 'success'
        case 3:
          return 'danger'
        case 4:
          return 'warning'
      }
    },
    getAftersaleStatusText(row) {
      switch (row.aftersaleStatus) {
        case 0:
          return '待处理'
        case 1:
          return '退货中'
        case 2:
          return '已完成'
        case 3:
          return '已拒绝'
        case 4:
          return '已关闭'
      }
    },
    getAftersaleTypeTag(row) {
      switch (row.applyRefundType) {
        case 1:
          return 'primary'
        case 2:
          return 'warning'
      }
    },
    getAftersaleTypeText(row) {
      switch (row.applyRefundType) {
        case 1:
          return '退款'
        case 2:
          return '退货退款'
      }
    },
    cancel() {
      this.open = false;
      this.updateOrderForm = {
        orderId: null,
        optType: null,
        remark: null
      }
    },
    submitUpdate(formName){
      this.$refs[formName].validate(valid => {
        if(valid){
          dealWithAftersale(this.updateOrderForm).then((response) => {
            this.cancel()
            this.$message.success('操作成功')
            this.getList()
          })
        }
      })
    },
    handleChange(value) {
      if (!value) {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
  }
};
</script>
