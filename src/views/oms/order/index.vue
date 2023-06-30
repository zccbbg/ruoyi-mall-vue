<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable size="small">
          <el-option v-for="(item, index) in dict.type.oms_order_status" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderId">
        <el-input v-model.trim="queryParams.orderSn" placeholder="请输入订单编号" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付方式" clearable size="small">
          <el-option v-for="(item, index) in dict.type.oms_pay_type" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="商品名称" prop="productName">-->
<!--        <el-input v-model.trim="queryParams.productName" placeholder="请输入商品名称" clearable size="small"-->
<!--                  @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
      <el-form-item label="会员手机号" prop="userPhone">
        <el-input v-model.trim="queryParams.userPhone" placeholder="请输入会员手机号" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="省市区" prop="provinces">
        <address-selector v-model="queryParams.provinces"></address-selector>
      </el-form-item>
      <el-form-item label="下单时间" prop="Time">
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
<!--        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>-->
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="omsOrderList" border>
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="收件信息" align="center" prop="receiverName" width="180">
        <template v-slot="scope">
          <div>{{ getHiddenName(scope.row.receiverName) }} {{ scope.row.receiverPhone }}</div>
          <div>{{ getHiddenDetailAddress(scope.row.receiverDetailAddress) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单备注" align="center" prop="note" width="180"/>
      <el-table-column label="支付时间/发货时间" align="center" prop="payTime" width="220" >
        <template slot-scope="scope">
          <div v-if="scope.row.payTime">{{ parseTime(scope.row.payTime, '')}} 支付</div>
          <div v-if="scope.row.deliveryTime">{{ parseTime(scope.row.deliveryTime, '')}} 发货</div>
        </template>
      </el-table-column>
      <el-table-column label="合计" align="center" prop="totalAmount" width="220">
        <template v-slot="scope">
          <span>总数量:</span>
          <span style="color: red;margin-right: 8px">{{ scope.row.buyNum }}</span>
          <span>总价:￥{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品规格" align="center" prop="productList" width="180">
        <template v-slot="scope">
          <div v-for="item in scope.row.productList" class="product-container">
            <el-popover
              placement="right"
              trigger="hover">
              <el-image :src="item.pic" style="width: 350px;height: 350px"/>
              <el-image slot="reference" class="small-img product-item" :src="item.pic" style="width: 35px;height: 35px"/>
            </el-popover>
            <div class="product-item">￥{{ item.salePrice }}</div>
            <div class="product-item quantity">x{{ item.buyNum }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template v-slot="scope">
          <el-tag :type="getOrderTypeTag(scope.row.status)">
            {{ getOrderTypeText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" prop="payType">
        <template v-slot="scope">
          <el-tag :type="getPayTypeTag(scope.row.payType)">
            {{ getPayTypeText(scope.row.payType) }}
          </el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="确认收货时间" align="center" prop="receiveTime" width="180" >-->
<!--        <template slot-scope="scope">-->
<!--            <span>{{ parseTime(scope.row.receiveTime, '')}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="下单时间" align="center" prop="createTime" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号/操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.orderSn }}</div>
          <el-button
            size="mini"
            type="text"
            @click="goDetail(scope.row)"
            v-hasPermi="['oms:order:detail']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="goDetail(scope.row)"
            v-hasPermi="['oms:order:detail']"
          >发货</el-button>
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
  </div>
</template>

<script>
import { listOmsOrder, getOmsOrder, delOmsOrder, addOmsOrder, updateOmsOrder, exportOmsOrder } from "@/api/oms/order";
import AddressSelector from "@/views/components/AddressSelector/index.vue";
import dateUtil from '@/utils/DateUtil';

export default {
  name: "OmsOrder",
  dicts: ["oms_order_status","oms_pay_type"],
  components: {
    AddressSelector
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort2()
      },
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
      // 订单表表格数据
      omsOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        payType: null,
        status: null,
        Time:[],
        provinces: [],
        receiverProvinceId: null,
        receiverCityId: null,
        receiverDistrictId: null,
        orderSn: null,
        productName: null,
        userPhone: null,
        startTime: null,
        endTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "MEMBER_ID不能为空", trigger: "blur" }
        ],
        receiverName: [
          { required: true, message: "收货人姓名不能为空", trigger: "blur" }
        ],
        receiverPhone: [
          { required: true, message: "收货人电话不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单表列表 */
    getList() {
      if (this.queryParams.Time) {
        this.queryParams.startTime = this.queryParams.Time[0]
        this.queryParams.endTime = this.queryParams.Time[1]
      }
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      if (query.provinces) {
        const [receiverProvinceId,receiverCityId,receiverDistrictId] =query.provinces
        query.receiverProvinceId = receiverProvinceId
        query.receiverCityId = receiverCityId
        query.receiverDistrictId = receiverDistrictId
      } else {
        query.receiverProvinceId = null
        query.receiverCityId = null
        query.receiverDistrictId = null
      }
      const pageReq = {page: pageNum - 1, size: pageSize};
      listOmsOrder(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsOrderList = content;
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
        memberUsername: null,
        totalAmount: null,
        purchasePrice: null,
        payAmount: null,
        freightAmount: null,
        payType: null,
        status: 0,
        aftersaleStatus: 0,
        deliveryCompany: null,
        deliverySn: null,
        autoConfirmDay: null,
        receiverName: null,
        receiverPhone: null,
        receiverPostCode: null,
        receiverProvince: null,
        receiverCity: null,
        receiverDistrict: null,
        receiverProvinceId: null,
        receiverCityId: null,
        receiverDistrictId: null,
        receiverDetailAddress: null,
        note: null,
        confirmStatus: 0,
        deleteStatus: 0,
        paymentTime: null,
        deliveryTime: null,
        receiveTime: null,
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
      this.title = "添加订单表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOmsOrder(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改订单表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOmsOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除订单表编号为"' + ids + '"的数据项？').then(function() {
        return delOmsOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有订单表数据项？').then(() => {
        this.exportLoading = true;
        return exportOmsOrder(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    },
    //时间搜索条件change方法
    handleChange(value) {
      if (!value) {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    getOrderTypeTag(status){
      switch (status){
        case 0:
        case 1:
          return 'info';
        case 2:
          return 'primary';
        case 3:
          return 'success';
        case  4:
          return 'warning';
        case 5:
          return 'danger';
      }
    },
    getOrderTypeText(status){
      switch (status){
        case 0:
          return '待付款';
        case 1:
          return '待发货';
        case 2:
          return '待发货';
        case 3:
          return '已发货';
        case  4:
          return '已关闭';
        case 5:
          return '无效订单';
      }
    },
    getPayTypeTag(type){
      switch (type){
        case 0:
          return 'info';
        case 1:
          return 'primary';
        case 2:
          return 'success';
      }
    },
    getPayTypeText(type){
      switch (type){
        case 0:
          return '未支付';
        case 1:
          return '支付宝';
        case 2:
          return '微信';
      }
    },
    goDetail(row){
      const id = row.id
      this.$router.push({path: '/order/detail', query: {id}})    }
    }
};
</script>
<style lang="scss" scoped>
.product-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 150px;
  .product-item{
    margin: auto;
    width: 60px;
  }
  .quantity{
    font-weight: bold;
  }
}
</style>
