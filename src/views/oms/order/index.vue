<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="订单状态" prop="status">
        <DictRadio v-model="queryParams.status" :radioData="dict.type.oms_order_status" size="small" :show-all="'all'" :filter="['11', '12', '13', '14']"></DictRadio>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderSn">
        <el-input v-model.trim="queryParams.orderSn" placeholder="请输入订单编号" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
<!--      <el-form-item label="支付方式" prop="payType">-->
<!--        <el-select v-model="queryParams.payType" placeholder="请选择支付方式" clearable size="small">-->
<!--          <el-option v-for="(item, index) in dict.type.oms_pay_type" :label="item.label" :value="item.value"/>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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

    <el-table v-loading="loading" :data="omsOrderList" border @selection-change="handleSelectionChange" cell-class-name="my-cell">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="收件信息" prop="receiverName" width="280">
        <template v-slot="scope">
          <div>
            <span>{{ getHiddenName(scope.row.receiverName) }} {{ scope.row.receiverPhone }}</span>
            <el-button
              size="mini"
              type="text"
              @click="handleWatch()"
              style="margin-left: 10px"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate()"
            >修改</el-button>
          </div>
          <div>
            <span>{{ scope.row.receiverProvince }}{{ scope.row.receiverCity }}{{ scope.row.receiverDistrict }}</span>
            <span>{{ getHiddenDetailAddress(scope.row.receiverDetailAddress) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注留言"  prop="note" width="160">
        <template v-slot="scope">
          <div>
            <span v-if="scope.row.merchantNote" class="note-title" style="margin-right: 10px">平台备注</span>
            <el-button
              size="mini"
              type="text"
              @click="handleSaveNote(scope.row)"
            >{{ scope.row.merchantNote ? '修改' : '添加平台备注' }}</el-button>
          </div>
          <div v-if="scope.row.merchantNote">{{ scope.row.merchantNote }}</div>
          <div v-if="scope.row.note" class="note-title">买家备注</div>
          <div v-if="scope.row.note">{{ scope.row.note }}</div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间/支付时间"  prop="payTime" width="200" >
        <template slot-scope="scope">
          <div v-if="scope.row.createTime">{{ parseTime(scope.row.createTime, '{mm}-{dd} {hh}:{ii}')}} 下单</div>
          <div v-if="scope.row.payTime">{{ parseTime(scope.row.payTime, '{mm}-{dd} {hh}:{ii}')}} 支付</div>
        </template>
      </el-table-column>
      <el-table-column label="合计"  prop="totalAmount" width="140">
        <template v-slot="scope">
          <div>
            <span>总数： </span>
            <span style="color: red;">{{ scope.row.buyNum }}</span>
          </div>
          <div>总价： ￥{{ scope.row.totalAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品规格"  prop="productList" width="340">
        <template v-slot="scope">
          <div v-for="item in scope.row.productList" class="product-container">
            <el-popover
              placement="right"
              trigger="hover">
              <el-image :src="item.pic" style="width: 350px;height: 350px"/>
              <el-image slot="reference" class="small-img product-item" :src="item.pic" style="width: 40px;height: 40px"/>
            </el-popover>
            <div class="product-item" style="margin-left: 5px">
              <div class="sp-data">
                <span v-for="(value, key) in JSON.parse(item.spData)">{{ key }}：{{ value }}&nbsp;</span>
              </div>
              <div class="product-item quantity">
                <span style="margin-right: 10px">￥{{ item.salePrice }}</span>
                <span>x{{ item.buyNum }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态"  prop="status" width="270">
        <template v-slot="scope">
          <div>
            <el-tag :type="getOrderStatusTag(scope.row.status)" style="margin-right: 10px">
              {{ getOrderStatusText(scope.row.status) }}
            </el-tag>
            <el-button
              size="mini"
              type="text"
              @click="handleDelivery(scope.row)"
              :disabled="scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 3"
            >编辑</el-button>
          </div>
          <div v-if="scope.row.deliverySn">物流单号：{{ scope.row.deliverySn}}
            <el-link @click="copy(scope.row.deliverySn)" :underline="false"><i class="el-icon-document-copy el-icon--right"></i> </el-link>
          </div>
          <div v-if="scope.row.deliveryTime">发货时间：{{ parseTime(scope.row.deliveryTime, '')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号/操作"  class-name="small-padding fixed-width" width="220"  fixed="right">
        <template slot-scope="scope">
          <div>
            {{ scope.row.orderSn }}
<!--            <el-link-->
<!--              size="mini"-->
<!--              icon="el-icon-document-copy"-->
<!--              @click="copyOrderSn(scope.row.orderSn)"-->
<!--            ></el-link>-->
            <el-link @click="copy(scope.row.orderSn)" :underline="false"><i class="el-icon-document-copy el-icon--right"></i> </el-link>
          </div>
          <el-button
            size="mini"
            type="text"
            @click="goDetail(scope.row)"
            v-hasPermi="['oms:order:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="showLog(scope.row.id)"
            v-hasPermi="['oms:order:log']"
          >日志</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelivery(scope.row)"
            :disabled="scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 3"
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

    <!-- 发货对话框 -->
    <el-dialog :title="deliveryObj.title" :visible.sync="deliveryObj.open" width="500px" append-to-body>
      <el-form ref="deliveryForm" :model="deliveryObj.form" :rules="deliveryObj.rules" label-width="100px">
        <el-form-item label="快递公司" prop="expressName">
          <el-select v-model="deliveryObj.form.expressName" placeholder="请选择快递公司" clearable size="small" filterable>
<!--            <el-option v-for="(item, index) in experssList" :label="item.expressName" :value="item.expressCode"/>-->
            <el-option label="顺丰速运" value="1"/>
            <el-option label="申通快递" value="2"/>
            <el-option label="圆通快递" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressSn">
          <el-input v-model="deliveryObj.form.expressSn" placeholder="请输入快递单号" controls-position="right" :min="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelivery('deliveryForm')">确
          定
        </el-button>
        <el-button @click="cancelDelivery">取 消</el-button>
      </div>
    </el-dialog>
    <!--  保存商家备注对话框  -->
    <el-dialog :title="noteObj.title" :visible.sync="noteObj.open" width="500px" append-to-body>
      <el-form ref="noteForm" :model="noteObj.form" label-width="100px">
        <el-form-item label="备注" prop="merchantNote">
          <el-input type="textarea" v-model="noteObj.form.merchantNote" controls-position="right" :min="0" :rows="3"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitNoteForm()">
          确认修改
        </el-button>
        <el-button size="small" @click="cancelNote">取 消</el-button>
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
            <br>
            <h4>备注：{{ item.note }}</h4>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { listOmsOrder, getOmsOrder, delOmsOrder, addOmsOrder, updateOmsOrder, exportOmsOrder, saveMerchantNote, deliverProduct, viewLog } from "@/api/oms/order";
import AddressSelector from "@/views/components/AddressSelector/index.vue";
import dateUtil from '@/utils/DateUtil';
import fa from "element-ui/src/locale/lang/fa";

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
      showMoreCondition: false,
      deliveryObj: {
        title: '订单发货',
        form: {
          orderId: null,
          expressName: null,
          expressSn: null
        },
        open: false,
        rules:{
          expressName: [
            {required: true, message: "快递公司不能为空", trigger: "change"}
          ],
          expressSn: [
            {required: true, message: "快递单号不能为空", trigger: "blur"}
          ]
        }
      },
      noteObj: {
        title: null,
        form: {
          id: null,
          merchantNote: null
        },
        open: false
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
    const { phone } = this.$route.query
    if (phone){
      this.queryParams.userPhone = phone
    }
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
    handleUpdate() {
      this.$modal.msgError("无操作权限");
    },
    handleWatch() {
      this.$modal.msgError("无操作权限");
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
    getOrderStatusTag(status){
      switch (status){
        case 0:
        case 1:
          return 'info';
        case 2:
          return 'primary';
        case 3:
          return 'success';
        case 4:
          return 'warning';
        case 5:
          return 'danger';
      }
    },
    getOrderStatusText(status){
      switch (status){
        case 0:
          return '待付款';
        case 1:
          return '待发货';
        case 2:
          return '已发货';
        case 3:
          return '已完成';
        case  4:
          return '已关闭';
        case 5:
          return '无效订单';
      }
    },
    getLogEvent(status){
      switch (status){
        case 0:
          return '用户下单';
        case 1:
          return '用户支付成功';
        case 2:
          return '平台发货';
        case 3:
          return '用户确认收货';
        case  4:
          return '取消订单';
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
      this.$router.push({path: '/order/detail', query: {id}})
    },
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
    handleDelivery(row){
      this.deliveryObj.form.orderId = row.id
      this.deliveryObj.open = true
    },
    submitDelivery(){
      this.$refs['deliveryForm'].validate((valid) => {
        if (valid){
          deliverProduct(this.deliveryObj.form).then(resp => {
            this.$modal.msgSuccess('发货成功')
            this.cancelDelivery()
            this.getList()
          })
        }
      })
    },
    cancelDelivery(){
      this.deliveryObj.open = false
      this.deliveryObj.form.orderId = null
      this.deliveryObj.form.expressName = null
      this.deliveryObj.form.expressSn = null
    },
    handleSaveNote(row){
      const merchantNote = row.merchantNote
      if (merchantNote){
        this.noteObj.title = '修改平台备注'
      }else {
        this.noteObj.title = '添加平台备注'
      }
      this.noteObj.form.id = row.id
      this.noteObj.form.merchantNote = row.merchantNote
      this.noteObj.open = true
    },
    //备注保存
    submitNoteForm(){
      saveMerchantNote(this.noteObj.form).then(resp => {
        if (resp > 0){
          this.$modal.msgSuccess('修改成功')
          this.cancelNote()
          this.getList()
        }
      })
    },
    cancelNote(){
      this.noteObj.open = false
      this.noteObj.form.id = null
      this.noteObj.form.merchantNote = null
    },
    showLog(orderId){
      this.logObj.loading = true
      viewLog(orderId).then((response) => {
        this.logObj.logList = response
        this.logObj.open = true
        this.logObj.loading = false
      })
    }
  }

};
</script>
<style lang="scss">
.product-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 340px;
  .product-item{
    margin: auto;
    width: 290px;
    .sp-data{
      font-size: 13px;
    }
    .quantity{
      font-weight: bold;
      font-size: 13px;
    }
  }
}
.note-title{
  font-weight: bold;
}
.el-table .my-cell {
  vertical-align: top
}
.el-link.el-link--default {
  color: #409eff;
}
.el-select{
  width: 100%;
}
</style>
