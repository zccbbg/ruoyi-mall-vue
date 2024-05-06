<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="统计日期" prop="date">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                        :clearable="true" :picker-options='pickerOptions' range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="awsSystemStatisticsList" @selection-change="handleSelectionChange" border>
      <el-table-column label="统计日期" prop="date" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录用户数" prop="loginMemberCount"/>
      <el-table-column label="注册用户数" prop="registerMemberCount"/>
      <el-table-column label="加购用户数" prop="addCartMemberCount"/>
      <el-table-column label="下单用户数" prop="createOrderMemberCount"/>
      <el-table-column label="成交用户数" prop="dealMemberCount"/>
      <el-table-column label="下单数" prop="orderCount"/>
      <el-table-column label="成交数" prop="dealCount"/>
      <el-table-column label="成交金额" prop="dealAmount">
        <template v-slot="scope">
          ￥{{ scope.row.dealAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="售后数" prop="aftersaleCount"/>
      <el-table-column label="售后金额" prop="aftersaleAmount">
        <template v-slot="scope">
          ￥{{ scope.row.aftersaleAmount.toFixed(2) }}
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

  </div>
</template>

<script>
import {
  addAwsSystemStatistics,
  delAwsSystemStatistics,
  exportAwsSystemStatistics,
  getAwsSystemStatistics,
  listAwsSystemStatistics,
  updateAwsSystemStatistics
} from "@/api/aws/systemStatistics";
import dateUtil from "@/utils/DateUtil";

export default {
  name: "AwsSystemStatistics",
  data() {
    return {
      // 遮罩层
      loading: true,
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort()
      },
      dateRange: [],
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
      // 系统数据统计表格数据
      awsSystemStatisticsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        date: [
          { required: true, message: "统计日期不能为空", trigger: "blur" }
        ],
        loginMemberCount: [
          { required: true, message: "登录用户数不能为空", trigger: "blur" }
        ],
        registerMemberCount: [
          { required: true, message: "注册用户数不能为空", trigger: "blur" }
        ],
        addCartMemberCount: [
          { required: true, message: "加购用户数不能为空", trigger: "blur" }
        ],
        createOrderMemberCount: [
          { required: true, message: "下单用户数不能为空", trigger: "blur" }
        ],
        dealMemberCount: [
          { required: true, message: "成交用户数不能为空", trigger: "blur" }
        ],
        orderCount: [
          { required: true, message: "下单数不能为空", trigger: "blur" }
        ],
        dealCount: [
          { required: true, message: "成交数不能为空", trigger: "blur" }
        ],
        dealAmount: [
          { required: true, message: "成交金额不能为空", trigger: "blur" }
        ],
        aftersaleCount: [
          { required: true, message: "售后数不能为空", trigger: "blur" }
        ],
        aftersaleAmount: [
          { required: true, message: "售后金额不能为空", trigger: "blur" }
        ]
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统数据统计列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      let query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      if (this.dateRange && this.dateRange.length > 0){
        query = {...this.addDateRange3(query, this.dateRange)}
      }
      listAwsSystemStatistics(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.awsSystemStatisticsList = content;
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
        date: null,
        loginMemberCount: null,
        registerMemberCount: null,
        addCartMemberCount: null,
        createOrderMemberCount: null,
        dealMemberCount: null,
        orderCount: null,
        dealCount: null,
        dealAmount: null,
        aftersaleCount: null,
        aftersaleAmount: null
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
      this.title = "添加系统数据统计";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAwsSystemStatistics(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改系统数据统计";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAwsSystemStatistics(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAwsSystemStatistics(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统数据统计编号为"' + ids + '"的数据项？').then(function() {
        return delAwsSystemStatistics(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有系统数据统计数据项？').then(() => {
        this.exportLoading = true;
        return exportAwsSystemStatistics(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
