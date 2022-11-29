<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="0->失效；1->有效" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择0->失效；1->有效" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="展示图片" prop="pic">
        <el-input
          v-model="queryParams.pic"
          placeholder="请输入展示图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU ID" prop="skuId">
        <el-input
          v-model="queryParams.skuId"
          placeholder="请输入SKU ID"
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
      <template v-if="showMoreCondition">
      <el-form-item label="商品数量" prop="cartNum">
        <el-input
          v-model="queryParams.cartNum"
          placeholder="请输入商品数量"
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
          v-hasPermi="['ums:memberCart:add']"
        >新增</el-button>
      </el-col>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="umsMemberCartList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="0->失效；1->有效" align="center" prop="status" />
      <el-table-column label="用户ID" align="center" prop="memberId" />
      <el-table-column label="商品ID" align="center" prop="productId" />
      <el-table-column label="展示图片" align="center" prop="pic" />
      <el-table-column label="SKU ID" align="center" prop="skuId" />
      <el-table-column label="PRODUCT_NAME" align="center" prop="productName" />
      <el-table-column label="商品属性" align="center" prop="spData" />
      <el-table-column label="商品数量" align="center" prop="cartNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ums:memberCart:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ums:memberCart:remove']"
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

    <!-- 添加或修改购物车对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="0->失效；1->有效">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="展示图片" prop="pic">
          <el-input v-model="form.pic" placeholder="请输入展示图片" />
        </el-form-item>
        <el-form-item label="SKU ID" prop="skuId">
          <el-input v-model="form.skuId" placeholder="请输入SKU ID" />
        </el-form-item>
        <el-form-item label="PRODUCT_NAME" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入PRODUCT_NAME" />
        </el-form-item>
        <el-form-item label="商品属性" prop="spData">
          <el-input v-model="form.spData" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商品数量" prop="cartNum">
          <el-input v-model="form.cartNum" placeholder="请输入商品数量" />
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
import { listUmsMemberCart, getUmsMemberCart, delUmsMemberCart, addUmsMemberCart, updateUmsMemberCart, exportUmsMemberCart } from "@/api/ums/memberCart";

export default {
  name: "UmsMemberCart",
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
      // 购物车表格数据
      umsMemberCartList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        memberId: null,
        productId: null,
        pic: null,
        skuId: null,
        productName: null,
        spData: null,
        cartNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        productId: [
          { required: true, message: "商品ID不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "PRODUCT_NAME不能为空", trigger: "blur" }
        ],
        cartNum: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询购物车列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listUmsMemberCart(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.umsMemberCartList = content;
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
        status: 0,
        memberId: null,
        productId: null,
        pic: null,
        skuId: null,
        productName: null,
        spData: null,
        cartNum: null,
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
      this.title = "添加购物车";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUmsMemberCart(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改购物车";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUmsMemberCart(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUmsMemberCart(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除购物车编号为"' + ids + '"的数据项？').then(function() {
        return delUmsMemberCart(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有购物车数据项？').then(() => {
        this.exportLoading = true;
        return exportUmsMemberCart(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
