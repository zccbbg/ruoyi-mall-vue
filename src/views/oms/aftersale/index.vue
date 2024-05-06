<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="申请状态" prop="status">
        <DictRadio v-model="queryParams.status" :radioData="dict.type.oms_aftersale_status" size="small" :show-all="'all'" @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="售后类型" prop="type">
        <DictRadio v-model="queryParams.type" :radioData="dict.type.oms_aftersale_type" size="small" :show-all="'all'" @change="handleQuery"></DictRadio>
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
                        range-separator="至" size="small" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"
                        align="right"
                        @change="handleChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="omsAftersaleList" @selection-change="handleSelectionChange" border>
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="售后单号" prop="id" width="160"/>
      <el-table-column label="申请状态" prop="aftersaleStatus" width="80">
        <template v-slot="scope">
          <el-tag effect="plain" size="medium" :type="getAftersaleStatusTag(scope.row)">{{
              getAftersaleStatusText(scope.row)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" prop="nickName" width="120">
        <template v-slot="scope">
          <div>{{ scope.row.nickName }}</div>
          <div>{{ scope.row.phone }}</div>
          <div>{{ scope.row.mark }}</div>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" prop="applyReturnAmount" width="120"/>
      <el-table-column label="售后类型" prop="applyRefundType" width="80">
        <template v-slot="scope">
          <el-tag effect="plain" size="medium" :type="getAftersaleTypeTag(scope.row)">{{
              getAftersaleTypeText(scope.row)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="applyRefundTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyRefundTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" prop="handleTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.handleTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" prop="reason" width="220"/>
      <el-table-column label="处理备注" prop="note" width="150"/>
      <el-table-column label="处理人员" prop="handleMan" width="100"/>
      <el-table-column label="订单编号/操作" class-name="small-padding fixed-width" width="220" fixed="right">
        <template slot-scope="scope">
          <div>
            {{ scope.row.orderSn }}
            <el-link @click="copy(scope.row.orderSn)" :underline="false"><i
              class="el-icon-document-copy el-icon--right"></i></el-link>
          </div>
          <el-button size="mini" type="text" @click="handleDetail(scope.row.orderId)"
                     v-hasPermi="['oms:aftersale:query']">详情
          </el-button>
          <el-button size="mini" type="text" @click="showLog(scope.row.orderId)"
                     v-hasPermi="['oms:aftersale:log']">日志
          </el-button>
          <el-button size="mini" type="text" @click="approve(scope.row, 1)"
                     v-if="scope.row.aftersaleStatus == 0" v-hasPermi="['manager:oms:aftersale:update']">同意
          </el-button>
          <el-button size="mini" type="text" @click="handleOpen(scope.row, 2)" class="red"
                     v-if="scope.row.aftersaleStatus == 0" v-hasPermi="['manager:oms:aftersale:update']">拒绝
          </el-button>
          <el-button size="mini" type="text" @click="confirmReceive(scope.row, 3)"
                     v-if="scope.row.aftersaleStatus == 1 && scope.row.applyRefundType == 2"
                     v-hasPermi="['manager:oms:aftersale:update']">确认收货
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <InBody v-show="total>0">
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </InBody>

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
    <!--  日志  -->
    <el-dialog :title="logObj.title" :visible.sync="logObj.open" width="500px" append-to-body>
      <el-timeline>
        <el-timeline-item v-for="item in logObj.logList" placement="top" :timestamp="parseTime(item.createTime, '')">
          <el-card>
            <h4>{{ getLogEvent(item.orderStatus) }}</h4>
            <br>
            <h4>操作人：{{ item.operateMan }}</h4>
            <br v-if="item.note">
            <h4 v-if="item.note">备注：{{ item.note }}</h4>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {
  addOmsAftersale,
  dealWithAftersale,
  delOmsAftersale,
  exportOmsAftersale,
  getOmsAftersale,
  listOmsAftersale,
  updateOmsAftersale,
  viewLog
} from "@/api/oms/aftersale";
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
        remark: null,
        id: null,
      },
      rules: {
        remark: [
          {required: true, message: '请输入拒绝理由', trigger: 'blur'}
        ]
      },
      logObj: {
        title: '日志',
        logList: null,
        open: false,
        loading: false
      }
    };
  },
  created() {
    const { status } = this.$route.query
    if (status){
      this.queryParams.status = status
    }
    this.getList();
  },
  methods: {
    copy(data) {
      let url = data;
      let oInput = document.createElement('input');
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value)
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$modal.msgSuccess('复制成功');
      oInput.remove()
    },
    /** 查询订单售后列表 */
    getList() {
      if (this.queryParams.Time) {
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
    approve(order, type) {
      this.$confirm(`您确定要同意售后单号为【${order.id}】的售后申请吗？`, '温馨提示', {type: 'warning'}).then(
        () => {
          this.updateOrderForm.orderId = order.orderId
          this.updateOrderForm.optType = type
          dealWithAftersale(this.updateOrderForm).then((response) => {
            this.cancel()
            this.$message.success('操作成功')
            this.getList()
          })
        }
      )
    },
    /** 拒绝 */
    handleOpen(order, type) {
      this.updateOrderForm.orderId = order.orderId
      this.updateOrderForm.optType = type
      this.updateOrderForm.id = order.id
      this.open = true
    },
    confirmReceive(orderId, type) {
      this.$confirm(`您确认收到售后单号为【${order.id}】的货物了吗？`, '温馨提示', {type: 'warning'}).then(
        () => {
          this.updateOrderForm.orderId = orderId
          this.updateOrderForm.optType = type
          dealWithAftersale(this.updateOrderForm).then((response) => {
            this.cancel()
            this.$message.success('操作成功')
            this.getList()
          })
        })
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
        remark: null,
        id: null,
      }
    },
    submitUpdate(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`您确定要拒绝售后单号为【${this.updateOrderForm.id}】的售后申请了吗？`, '温馨提示', {type: 'warning'}).then(
            () => {
              dealWithAftersale(this.updateOrderForm).then((response) => {
                this.cancel()
                this.$message.success('操作成功')
                this.getList()
              })
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
    showLog(orderId){
      this.logObj.loading = true
      viewLog(orderId).then((response) => {
        this.logObj.logList = response
        this.logObj.open = true
        this.logObj.loading = false
      })
    },
    getLogEvent(status){
      switch (status){
        case 11:
          return '用户申请售后';
        case 12:
          return '平台同意售后申请';
        case 13:
          return '售后完成';
        case 14:
          return '平台拒绝售后';
      }
    },
  }
};
</script>
