<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌" prop="brandName">
        <el-input
          v-model="queryParams.brandName"
          placeholder="请输入品牌名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编码" prop="outProductId">
        <el-input
          v-model="queryParams.outProductId"
          placeholder="请输入商品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="上架状态" prop="publishStatus">
        <el-select v-model="queryParams.publishStatus" placeholder="请选择上架状态：0->下架；1->上架" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['pms:product:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="pmsProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="outProductId"/>
      <el-table-column label="主图" align="center" prop="pic"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="价格" align="center" prop="price"/>
      <el-table-column label="上架状态" align="center" prop="publishStatus"/>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:product:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:product:remove']"
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

    <!-- 添加或修改商品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="BRAND_ID" prop="brandId">
          <el-input v-model="form.brandId" placeholder="请输入BRAND_ID" />
        </el-form-item>
        <el-form-item label="CATEGORY_ID" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入CATEGORY_ID" />
        </el-form-item>
        <el-form-item label="商品编码" prop="outProductId">
          <el-input v-model="form.outProductId" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="NAME" prop="name">
          <el-input v-model="form.name" placeholder="请输入NAME" />
        </el-form-item>
        <el-form-item label="主图" prop="pic">
          <el-input v-model="form.pic" placeholder="请输入主图" />
        </el-form-item>
        <el-form-item label="画册图片，连产品图片限制为5张，以逗号分割" prop="albumPics">
          <el-input v-model="form.albumPics" placeholder="请输入画册图片，连产品图片限制为5张，以逗号分割" />
        </el-form-item>
        <el-form-item label="上架状态：0->下架；1->上架">
          <el-radio-group v-model="form.publishStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="PRICE" prop="price">
          <el-input v-model="form.price" placeholder="请输入PRICE" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="商品重量，默认为克" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入商品重量，默认为克" />
        </el-form-item>
        <el-form-item label="产品详情网页内容" prop="detailHtml">
          <el-input v-model="form.detailHtml" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="移动端网页详情" prop="detailMobileHtml">
          <el-input v-model="form.detailMobileHtml" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="商品分类名称" prop="productCategoryName">
          <el-input v-model="form.productCategoryName" placeholder="请输入商品分类名称" />
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
import { listPmsProduct, getPmsProduct, delPmsProduct, addPmsProduct, updatePmsProduct, exportPmsProduct } from "@/api/pms/product";

export default {
  name: "PmsProduct",
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
      // 商品信息表格数据
      pmsProductList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        brandId: null,
        categoryId: null,
        outProductId: null,
        name: null,
        pic: null,
        albumPics: null,
        publishStatus: null,
        sort: null,
        price: null,
        unit: null,
        weight: null,
        detailHtml: null,
        detailMobileHtml: null,
        brandName: null,
        productCategoryName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        outProductId: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "NAME不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listPmsProduct(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.pmsProductList = content;
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
        brandId: null,
        categoryId: null,
        outProductId: null,
        name: null,
        pic: null,
        albumPics: null,
        publishStatus: 0,
        sort: null,
        price: null,
        unit: null,
        weight: null,
        detailHtml: null,
        detailMobileHtml: null,
        brandName: null,
        productCategoryName: null,
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
      this.title = "添加商品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPmsProduct(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改商品信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePmsProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPmsProduct(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除商品信息编号为"' + ids + '"的数据项？').then(function() {
        return delPmsProduct(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有商品信息数据项？').then(() => {
        this.exportLoading = true;
        return exportPmsProduct(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
