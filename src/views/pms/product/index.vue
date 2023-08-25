<template>
  <div class="app-container" v-if="show">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="上架状态" prop="publishStatus">
         <DictRadio v-model="queryParams.publishStatus" @change="handleQuery" size="small"
                   :radioData="dict.type.pms_publish_status" :showAll="'all'"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.nameLike"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌" prop="brandName">
        <el-input
          v-model="queryParams.brandNameLike"
          placeholder="请输入品牌名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="productCategoryName">
        <el-input
          v-model="queryParams.productCategoryNameLike"
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

        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="pmsProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主图" align="center" prop="pic">
        <template slot-scope="{ row }">
          <el-image v-if="row.pic" :src="row.pic" :preview-src-list="[row.pic]" class="small-img circle-img"/>
        </template>
      </el-table-column>
      <el-table-column label="名称/编码" min-width="200" align="center" prop="outProductId">
        <template slot-scope="{ row }">
          <div>名称：{{row.name}}</div>
          <div v-if="row.outProductId">编码：{{row.outProductId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="品牌/分类" align="center" prop="brandName">
        <template slot-scope="{ row }">
          <div v-if="row.brandName">品牌：{{row.brandName}}</div>
          <div v-if="row.productCategoryName">分类：{{row.productCategoryName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="价格/排序" align="center" prop="price">
        <template slot-scope="{ row }">
          <div v-if="row.price">价格：{{row.price}}</div>
          <div v-if="row.sort">排序：{{row.sort}}</div>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="publishStatus">
        <template slot-scope="{ row }">
          <dict-tag :value="row.publishStatus" prop-name="pms_publish_status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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
  </div>
</template>

<script>
import {delPmsProduct, listPmsProduct} from "@/api/pms/product";
import {isStarRepo} from "@/utils/is-star-plugin";
import {mapGetters} from "vuex";

export default {
  name: "PmsProduct",
  dicts: ['pms_publish_status'],
  data() {
    return {
      show: false,
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
    };
  },
  async created() {
    const res = await isStarRepo('zccbbg', 'RuoYi-Mall', this.userId, 'https://mall.ichengle.top/pms/product', 'ruoyi-mall-商城', 'https://gitee.com/zccbbg/RuoYi-Mall')
    this.show = res;
    if (res) {
      this.getList();
    }
  },
  computed:{
    ...mapGetters(['userId']),
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
      this.$router.push({ path: '/product/edit' });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/product/edit', query: { id: row.id } });
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
  }
};
</script>
