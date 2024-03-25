<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="活动名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入活动名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="使用范围" prop="useScope">
        <DictRadio v-model="queryParams.useScope" @change="handleQuery" size="small"
                   :radioData="dict.type.coupon_use_scope" :showAll="'all'"/>
      </el-form-item>
      <el-form-item label="兑换类型" prop="couponType">
        <DictRadio v-model="queryParams.couponType" @change="handleQuery" size="small"
                   :radioData="dict.type.coupon_exchange_type" :showAll="'all'"/>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['act:couponActivity:opt']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="CouponActivityList">
      <el-table-column label="活动名称" align="center" prop="title"/>
      <el-table-column label="使用范围" align="center" prop="useScope">
        <template slot-scope="scope">
          <dict-tag :value="scope.row.useScope" prop-name="coupon_use_scope"/>
        </template>
      </el-table-column>
      <el-table-column label="优惠内容" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.minAmount">满{{ scope.row.minAmount }}元，优惠{{ scope.row.couponAmount }}元</span>
          <span v-else>无门槛，优惠{{ scope.row.couponAmount }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="发行总数" align="center" prop="totalCount"/>
      <el-table-column label="剩余总数" align="center" prop="leftCount"/>
      <el-table-column label="已使用" align="center" prop="useCount"/>
      <el-table-column label="每人限领" align="center" prop="userLimit"/>
      <el-table-column label="兑换类型" align="center" prop="couponType">
        <template slot-scope="scope">
          <dict-tag :value="scope.row.couponType" prop-name="coupon_exchange_type"/>
        </template>
      </el-table-column>
      <el-table-column label="要兑换的积分" align="center" prop="useIntegral"/>
      <el-table-column label="活动时间" align="center" prop="beginTime" width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.beginTime }}</p>
          <p> ~ </p>
          <p>{{ scope.row.endTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="seeCouponList(scope.row)"
          >领取记录
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['act:couponActivity:opt']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-if="scope.row.leftCount === scope.row.totalCount"
            v-hasPermi="['act:couponActivity:opt']"
          >删除
          </el-button>
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

    <!-- 添加或修改优惠券活动表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动名称"/>
        </el-form-item>
        <el-form-item label="发放数量" prop="totalCount">
          <el-input-number v-model="form.totalCount" placeholder="请输入发放数量" style="width:220px" :min="1"
                           :disabled="form.id"/>
        </el-form-item>
        <el-form-item label="每人限领" prop="userLimit">
          <el-input v-model="form.userLimit" style="width:220px">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低消费金额" prop="minAmount">
          <el-input v-model="form.minAmount" style="width:220px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券金额" prop="couponAmount">
          <el-input v-model="form.couponAmount" style="width:220px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="兑换类型" prop="couponType">
          <el-radio-group v-model="form.couponType" :disabled="form.id">
            <el-radio :label="1">免费兑换</el-radio>
            <el-radio :label="2">积分兑换</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="要兑换的积分" prop="useIntegral" v-if="form.couponType === 2">
          <el-input-number v-model="form.useIntegral" placeholder="请输入要兑换的积分" style="width:220px"
                           :disabled="form.id"/>
        </el-form-item>

        <el-form-item label="活动开始时间" prop="beginTime">
          <el-date-picker clearable size="small"
                          v-model="form.beginTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择活动开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker clearable size="small"
                          v-model="form.endTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择活动结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用范围" prop="useScope">
          <el-radio-group v-model="form.useScope" :disabled="form.id">
            <el-radio :label="1">全场通用</el-radio>
            <el-radio :label="2">指定商品可用</el-radio>
            <el-radio :label="3">指定商品不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品列表" prop="productIds" v-if="[2,3].includes(form.useScope)">
          <el-button @click="chooseSku" size="small">选择商品</el-button>
          <el-table :data="productList" class="mt10" max-height="300px">
            <el-table-column label="菜品信息">
              <template v-slot="{row}">
                <div class="flex-center">
                  <el-image v-if="row.pic" :src="row.pic" :preview-src-list="[row.pic]" class="small-img circle-img"/>
                  <span class="ml5">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="{row}">
                <span class="red ml5 pointer" @click="delProduct(row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <product-select ref="productSelect" @onComplete="completeProductIds"/>
    <receive-list ref="receiveListRef"/>
  </div>
</template>

<script>
import {
  listCouponActivity,
  delCouponActivity,
  addCouponActivity,
  updateCouponActivity,
  exportCouponActivity
} from "@/api/act/couponActivity";
import ProductSelect from "@/views/pms/product/productSelect.vue";
import receiveList from "@/views/act/couponActivity/receiveList.vue";

export default {
  name: "CouponActivity",
  components: {ProductSelect, receiveList},
  dicts: ['coupon_use_scope', 'coupon_exchange_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      productList: [],
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 优惠券活动表表格数据
      CouponActivityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        useScope: null,
        couponType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          {required: true, message: "活动名称不能为空", trigger: "blur"}
        ],
        useScope: [
          {required: true, message: "使用范围不能为空", trigger: "change"}
        ],
        totalCount: [
          {required: true, message: "发行总数不能为空", trigger: "blur"}
        ],
        userLimit: [
          {required: true, message: "每人限领不能为空", trigger: "blur"}
        ],
        couponAmount: [
          {required: true, message: "优惠券金额不能为空", trigger: "blur"}
        ],
        couponType: [
          {required: true, message: "兑换类型不能为空", trigger: "change"}
        ],
        beginTime: [
          {required: true, message: "活动开始时间不能为空", trigger: "change"}
        ],
        endTime: [
          {required: true, message: "活动结束时间不能为空", trigger: "change"}
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    delProduct(item) {
      this.productList = this.productList.filter(it => it.id !== item.id)
      this.completeProductIds([])
    },
    completeProductIds(products) {
      this.productList = this.productList.concat(products)
      if (!this.productList.length) {
        this.form.productIds = null
        return
      }
      this.form.productIds = this.productList.map(it => it.id).join()
    },
    chooseSku() {
      this.$refs.productSelect.init(this.productList.map(it => it.id))
    },
    /** 查询优惠券活动表列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listCouponActivity(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.CouponActivityList = content;
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
        title: null,
        useScope: 1,
        productIds: null,
        totalCount: null,
        userLimit: 1,
        couponAmount: null,
        minAmount: null,
        useIntegral: null,
        couponType: 1,
        beginTime: null,
        endTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.productList = []
      this.reset();
      this.open = true;
      this.title = "添加优惠券活动";
    },
    seeCouponList(row) {
      this.$refs.receiveListRef.init(row.id)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.productList = row.productList
      this.form = row;
      this.open = true;
      this.title = "修改优惠券活动";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            delete this.form.createTime
            updateCouponActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCouponActivity(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除优惠券活动【' + row.title + '】？').then(function () {
        return delCouponActivity(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有优惠券活动表数据项？').then(() => {
        this.exportLoading = true;
        return exportCouponActivity(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
