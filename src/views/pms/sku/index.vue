<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="PRODUCT_ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入PRODUCT_ID"
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
      <el-form-item label="PRICE" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入PRICE"
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
          v-hasPermi="['pms:sku:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pms:sku:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pms:sku:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['pms:sku:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pmsSkuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="PRODUCT_ID" align="center" prop="productId" v-if="columns[0].visible"/>
      <el-table-column label="sku编码" align="center" prop="outSkuId" v-if="columns[1].visible"/>
      <el-table-column label="PRICE" align="center" prop="price" v-if="columns[2].visible"/>
      <el-table-column label="展示图片" align="center" prop="pic" v-if="columns[3].visible"/>
      <el-table-column label="商品销售属性，json格式" align="center" prop="spData" v-if="columns[4].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:sku:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:sku:remove']"
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

    <!-- 添加或修改sku信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="PRODUCT_ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入PRODUCT_ID" />
        </el-form-item>
        <el-form-item label="sku编码" prop="outSkuId">
          <el-input v-model="form.outSkuId" placeholder="请输入sku编码" />
        </el-form-item>
        <el-form-item label="PRICE" prop="price">
          <el-input v-model="form.price" placeholder="请输入PRICE" />
        </el-form-item>
        <el-form-item label="展示图片" prop="pic">
          <el-input v-model="form.pic" placeholder="请输入展示图片" />
        </el-form-item>
        <el-form-item label="商品销售属性，json格式" prop="spData">
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
import { listPmsSku, getPmsSku, delPmsSku, addPmsSku, updatePmsSku, exportPmsSku } from "@/api/pms/sku";

export default {
  name: "PmsSku",
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
      // sku信息表格数据
      pmsSkuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productId: null,
        outSkuId: null,
        price: null,
        pic: null,
        spData: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        outSkuId: [
          { required: true, message: "sku编码不能为空", trigger: "blur" }
        ],
      },
      columns: [
            { key: 1, label: "PRODUCT_ID", visible:  true  },
            { key: 2, label: "sku编码", visible:  true  },
            { key: 3, label: "PRICE", visible:  true  },
            { key: 4, label: "展示图片", visible:  true  },
            { key: 5, label: "商品销售属性，json格式", visible:  true  },
                             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询sku信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listPmsSku(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.pmsSkuList = content;
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
        productId: null,
        outSkuId: null,
        price: null,
        pic: null,
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
      this.title = "添加sku信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPmsSku(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改sku信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePmsSku(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPmsSku(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除sku信息编号为"' + ids + '"的数据项？').then(function() {
        return delPmsSku(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有sku信息数据项？').then(() => {
        this.exportLoading = true;
        return exportPmsSku(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
