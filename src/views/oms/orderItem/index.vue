<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="订单id" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="PRODUCT_ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入PRODUCT_ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编码" prop="outProductId">
        <el-input
          v-model="queryParams.outProductId"
          placeholder="请输入商品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品sku id" prop="skuId">
        <el-input
          v-model="queryParams.skuId"
          placeholder="请输入商品sku id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sku编码" prop="outSkuId">
        <el-input
          v-model="queryParams.outSkuId"
          placeholder="请输入sku编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品快照id" prop="productSnapshotId">
        <el-input
          v-model="queryParams.productSnapshotId"
          placeholder="请输入商品快照id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sku快照id" prop="skuSnapshotId">
        <el-input
          v-model="queryParams.skuSnapshotId"
          placeholder="请输入sku快照id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="展示图片" prop="pic">
        <el-input
          v-model="queryParams.pic"
          placeholder="请输入展示图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="PRODUCT_NAME" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入PRODUCT_NAME"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售价格" prop="salePrice">
        <el-input
          v-model="queryParams.salePrice"
          placeholder="请输入销售价格"
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
      <el-form-item label="购买数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入购买数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品分类id" prop="productCategoryId">
        <el-input
          v-model="queryParams.productCategoryId"
          placeholder="请输入商品分类id"
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
          v-hasPermi="['oms:orderItem:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="omsOrderItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单id" align="center" prop="orderId" />
      <el-table-column label="PRODUCT_ID" align="center" prop="productId" />
      <el-table-column label="商品编码" align="center" prop="outProductId" />
      <el-table-column label="商品sku id" align="center" prop="skuId" />
      <el-table-column label="sku编码" align="center" prop="outSkuId" />
      <el-table-column label="商品快照id" align="center" prop="productSnapshotId" />
      <el-table-column label="sku快照id" align="center" prop="skuSnapshotId" />
      <el-table-column label="展示图片" align="center" prop="pic" />
      <el-table-column label="PRODUCT_NAME" align="center" prop="productName" />
      <el-table-column label="销售价格" align="center" prop="salePrice" />
      <el-table-column label="采购价" align="center" prop="purchasePrice" />
      <el-table-column label="购买数量" align="center" prop="quantity" />
      <el-table-column label="商品分类id" align="center" prop="productCategoryId" />
      <el-table-column label="商品sku属性:[{"key":"颜色","value":"颜色"},{"key":"容量","value":"4G"}]" align="center" prop="spData" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:orderItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:orderItem:remove']"
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

    <!-- 添加或修改订单中所包含的商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="PRODUCT_ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入PRODUCT_ID" />
        </el-form-item>
        <el-form-item label="商品编码" prop="outProductId">
          <el-input v-model="form.outProductId" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品sku id" prop="skuId">
          <el-input v-model="form.skuId" placeholder="请输入商品sku id" />
        </el-form-item>
        <el-form-item label="sku编码" prop="outSkuId">
          <el-input v-model="form.outSkuId" placeholder="请输入sku编码" />
        </el-form-item>
        <el-form-item label="商品快照id" prop="productSnapshotId">
          <el-input v-model="form.productSnapshotId" placeholder="请输入商品快照id" />
        </el-form-item>
        <el-form-item label="sku快照id" prop="skuSnapshotId">
          <el-input v-model="form.skuSnapshotId" placeholder="请输入sku快照id" />
        </el-form-item>
        <el-form-item label="展示图片" prop="pic">
          <el-input v-model="form.pic" placeholder="请输入展示图片" />
        </el-form-item>
        <el-form-item label="PRODUCT_NAME" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入PRODUCT_NAME" />
        </el-form-item>
        <el-form-item label="销售价格" prop="salePrice">
          <el-input v-model="form.salePrice" placeholder="请输入销售价格" />
        </el-form-item>
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input v-model="form.purchasePrice" placeholder="请输入采购价" />
        </el-form-item>
        <el-form-item label="购买数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入购买数量" />
        </el-form-item>
        <el-form-item label="商品分类id" prop="productCategoryId">
          <el-input v-model="form.productCategoryId" placeholder="请输入商品分类id" />
        </el-form-item>
        <el-form-item label="商品sku属性:[{"key":"颜色","value":"颜色"},{"key":"容量","value":"4G"}]" prop="spData">
          <el-input v-model="form.spData" type="textarea" placeholder="请输入内容" />
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
import { listOmsOrderItem, getOmsOrderItem, delOmsOrderItem, addOmsOrderItem, updateOmsOrderItem, exportOmsOrderItem } from "@/api/oms/orderItem";

export default {
  name: "OmsOrderItem",
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
      // 订单中所包含的商品表格数据
      omsOrderItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        productId: null,
        outProductId: null,
        skuId: null,
        outSkuId: null,
        productSnapshotId: null,
        skuSnapshotId: null,
        pic: null,
        productName: null,
        salePrice: null,
        purchasePrice: null,
        quantity: null,
        productCategoryId: null,
        spData: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        outProductId: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        outSkuId: [
          { required: true, message: "sku编码不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单中所包含的商品列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listOmsOrderItem(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.omsOrderItemList = content;
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
        orderId: null,
        productId: null,
        outProductId: null,
        skuId: null,
        outSkuId: null,
        productSnapshotId: null,
        skuSnapshotId: null,
        pic: null,
        productName: null,
        salePrice: null,
        purchasePrice: null,
        quantity: null,
        productCategoryId: null,
        spData: null,
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
      this.title = "添加订单中所包含的商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOmsOrderItem(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改订单中所包含的商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOmsOrderItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOmsOrderItem(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除订单中所包含的商品编号为"' + ids + '"的数据项？').then(function() {
        return delOmsOrderItem(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有订单中所包含的商品数据项？').then(() => {
        this.exportLoading = true;
        return exportOmsOrderItem(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
