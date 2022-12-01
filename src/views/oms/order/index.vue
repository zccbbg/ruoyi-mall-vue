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
      <el-form-item label="用户帐号" prop="memberUsername">
        <el-input
          v-model="queryParams.memberUsername"
          placeholder="请输入用户帐号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单总金额" prop="totalAmount">
        <el-input
          v-model="queryParams.totalAmount"
          placeholder="请输入订单总金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购价" prop="purchasePrice">
        <el-input
          v-model="queryParams.purchasePrice"
          placeholder="请输入采购价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应付金额" prop="payAmount">
        <el-input
          v-model="queryParams.payAmount"
          placeholder="请输入应付金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运费金额" prop="freightAmount">
        <el-input
          v-model="queryParams.freightAmount"
          placeholder="请输入运费金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付方式：0->未支付；1->支付宝；2->微信" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付方式：0->未支付；1->支付宝；2->微信" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态，枚举值：1：无售后或售后关闭，2：售后处理中，3：退款中，4： 退款成功" prop="refundStatus">
        <el-select v-model="queryParams.refundStatus" placeholder="请选择退款状态，枚举值：1：无售后或售后关闭，2：售后处理中，3：退款中，4： 退款成功" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="物流公司(配送方式)" prop="deliveryCompany">
        <el-input
          v-model="queryParams.deliveryCompany"
          placeholder="请输入物流公司(配送方式)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物流单号" prop="deliverySn">
        <el-input
          v-model="queryParams.deliverySn"
          placeholder="请输入物流单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自动确认时间" prop="autoConfirmDay">
        <el-input
          v-model="queryParams.autoConfirmDay"
          placeholder="请输入自动确认时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人姓名" prop="receiverName">
        <el-input
          v-model="queryParams.receiverName"
          placeholder="请输入收货人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人电话" prop="receiverPhone">
        <el-input
          v-model="queryParams.receiverPhone"
          placeholder="请输入收货人电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人邮编" prop="receiverPostCode">
        <el-input
          v-model="queryParams.receiverPostCode"
          placeholder="请输入收货人邮编"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份/直辖市" prop="receiverProvince">
        <el-input
          v-model="queryParams.receiverProvince"
          placeholder="请输入省份/直辖市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市" prop="receiverCity">
        <el-input
          v-model="queryParams.receiverCity"
          placeholder="请输入城市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区" prop="receiverDistrict">
        <el-input
          v-model="queryParams.receiverDistrict"
          placeholder="请输入区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份/直辖市id" prop="receiverProvinceId">
        <el-input
          v-model="queryParams.receiverProvinceId"
          placeholder="请输入省份/直辖市id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市id" prop="receiverCityId">
        <el-input
          v-model="queryParams.receiverCityId"
          placeholder="请输入城市id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区id" prop="receiverDistrictId">
        <el-input
          v-model="queryParams.receiverDistrictId"
          placeholder="请输入区id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="receiverDetailAddress">
        <el-input
          v-model="queryParams.receiverDetailAddress"
          placeholder="请输入详细地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="确认收货状态：0->未确认；1->已确认" prop="confirmStatus">
        <el-select v-model="queryParams.confirmStatus" placeholder="请选择确认收货状态：0->未确认；1->已确认" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="删除状态：0->未删除；1->已删除" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="请选择删除状态：0->未删除；1->已删除" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付时间" prop="paymentTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.paymentTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择支付时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发货时间" prop="deliveryTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.deliveryTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择发货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="确认收货时间" prop="receiveTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.receiveTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择确认收货时间">
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
          v-hasPermi="['oms:order:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="omsOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="MEMBER_ID" align="center" prop="memberId" />
      <el-table-column label="用户帐号" align="center" prop="memberUsername" />
      <el-table-column label="订单总金额" align="center" prop="totalAmount" />
      <el-table-column label="采购价" align="center" prop="purchasePrice" />
      <el-table-column label="应付金额" align="center" prop="payAmount" />
      <el-table-column label="运费金额" align="center" prop="freightAmount" />
      <el-table-column label="支付方式：0->未支付；1->支付宝；2->微信" align="center" prop="payType" />
      <el-table-column label="订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单" align="center" prop="status" />
      <el-table-column label="退款状态，枚举值：1：无售后或售后关闭，2：售后处理中，3：退款中，4： 退款成功" align="center" prop="refundStatus" />
      <el-table-column label="物流公司(配送方式)" align="center" prop="deliveryCompany" />
      <el-table-column label="物流单号" align="center" prop="deliverySn" />
      <el-table-column label="自动确认时间" align="center" prop="autoConfirmDay" />
      <el-table-column label="收货人姓名" align="center" prop="receiverName" />
      <el-table-column label="收货人电话" align="center" prop="receiverPhone" />
      <el-table-column label="收货人邮编" align="center" prop="receiverPostCode" />
      <el-table-column label="省份/直辖市" align="center" prop="receiverProvince" />
      <el-table-column label="城市" align="center" prop="receiverCity" />
      <el-table-column label="区" align="center" prop="receiverDistrict" />
      <el-table-column label="省份/直辖市id" align="center" prop="receiverProvinceId" />
      <el-table-column label="城市id" align="center" prop="receiverCityId" />
      <el-table-column label="区id" align="center" prop="receiverDistrictId" />
      <el-table-column label="详细地址" align="center" prop="receiverDetailAddress" />
      <el-table-column label="订单备注" align="center" prop="note" />
      <el-table-column label="确认收货状态：0->未确认；1->已确认" align="center" prop="confirmStatus" />
      <el-table-column label="删除状态：0->未删除；1->已删除" align="center" prop="deleteStatus" />
      <el-table-column label="支付时间" align="center" prop="paymentTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.paymentTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="deliveryTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认收货时间" align="center" prop="receiveTime" width="180" >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.receiveTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:order:remove']"
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

    <!-- 添加或修改订单表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="MEMBER_ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入MEMBER_ID" />
        </el-form-item>
        <el-form-item label="用户帐号" prop="memberUsername">
          <el-input v-model="form.memberUsername" placeholder="请输入用户帐号" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入订单总金额" />
        </el-form-item>
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input v-model="form.purchasePrice" placeholder="请输入采购价" />
        </el-form-item>
        <el-form-item label="应付金额" prop="payAmount">
          <el-input v-model="form.payAmount" placeholder="请输入应付金额" />
        </el-form-item>
        <el-form-item label="运费金额" prop="freightAmount">
          <el-input v-model="form.freightAmount" placeholder="请输入运费金额" />
        </el-form-item>
        <el-form-item label="支付方式：0->未支付；1->支付宝；2->微信" prop="payType">
          <el-select v-model="form.payType" placeholder="请选择支付方式：0->未支付；1->支付宝；2->微信">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款状态，枚举值：1：无售后或售后关闭，2：售后处理中，3：退款中，4： 退款成功">
          <el-radio-group v-model="form.refundStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流公司(配送方式)" prop="deliveryCompany">
          <el-input v-model="form.deliveryCompany" placeholder="请输入物流公司(配送方式)" />
        </el-form-item>
        <el-form-item label="物流单号" prop="deliverySn">
          <el-input v-model="form.deliverySn" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="自动确认时间" prop="autoConfirmDay">
          <el-input v-model="form.autoConfirmDay" placeholder="请输入自动确认时间" />
        </el-form-item>
        <el-form-item label="收货人姓名" prop="receiverName">
          <el-input v-model="form.receiverName" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiverPhone">
          <el-input v-model="form.receiverPhone" placeholder="请输入收货人电话" />
        </el-form-item>
        <el-form-item label="收货人邮编" prop="receiverPostCode">
          <el-input v-model="form.receiverPostCode" placeholder="请输入收货人邮编" />
        </el-form-item>
        <el-form-item label="省份/直辖市" prop="receiverProvince">
          <el-input v-model="form.receiverProvince" placeholder="请输入省份/直辖市" />
        </el-form-item>
        <el-form-item label="城市" prop="receiverCity">
          <el-input v-model="form.receiverCity" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区" prop="receiverDistrict">
          <el-input v-model="form.receiverDistrict" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="省份/直辖市id" prop="receiverProvinceId">
          <el-input v-model="form.receiverProvinceId" placeholder="请输入省份/直辖市id" />
        </el-form-item>
        <el-form-item label="城市id" prop="receiverCityId">
          <el-input v-model="form.receiverCityId" placeholder="请输入城市id" />
        </el-form-item>
        <el-form-item label="区id" prop="receiverDistrictId">
          <el-input v-model="form.receiverDistrictId" placeholder="请输入区id" />
        </el-form-item>
        <el-form-item label="详细地址" prop="receiverDetailAddress">
          <el-input v-model="form.receiverDetailAddress" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="订单备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="确认收货状态：0->未确认；1->已确认">
          <el-radio-group v-model="form.confirmStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除状态：0->未删除；1->已删除">
          <el-radio-group v-model="form.deleteStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付时间" prop="paymentTime">
          <el-date-picker clearable size="small"
                        v-model="form.paymentTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择支付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发货时间" prop="deliveryTime">
          <el-date-picker clearable size="small"
                        v-model="form.deliveryTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择发货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认收货时间" prop="receiveTime">
          <el-date-picker clearable size="small"
                        v-model="form.receiveTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择确认收货时间">
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
import { listOmsOrder, getOmsOrder, delOmsOrder, addOmsOrder, updateOmsOrder, exportOmsOrder } from "@/api/oms/order";

export default {
  name: "OmsOrder",
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
        memberId: null,
        memberUsername: null,
        totalAmount: null,
        purchasePrice: null,
        payAmount: null,
        freightAmount: null,
        payType: null,
        status: null,
        refundStatus: null,
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
        confirmStatus: null,
        deleteStatus: null,
        paymentTime: null,
        deliveryTime: null,
        receiveTime: null,
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
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
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
        refundStatus: 0,
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
    }
  }
};
</script>
