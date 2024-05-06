<template>
  <el-dialog :title="chooseSkuObj.title" :visible.sync="chooseSkuObj.open" :width="chooseSkuObj.width" append-to-body>
    <el-form ref="auditForm" inline :model="chooseSkuObj.queryParams" label-width="80px">
      <el-form-item label="菜品名称" prop="nameLike">
        <el-input
          size="small"
          placeholder="请输入菜品名称"
          v-model="chooseSkuObj.queryParams.nameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="菜品分类" prop="productCategoryName">
        <product-category-select v-model="chooseSkuObj.queryParams.categoryId"></product-category-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getSkuList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table class="mt20" :data="chooseSkuObj.list" ref="table" v-loading="chooseSkuObj.loading" max-height="500" border
              row-key="id" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
      <el-table-column label="菜品名称"  prop="name">
        <template v-slot="{row}">
          <div class="flex-center">
            <el-image v-if="row.pic" :src="row.pic" :preview-src-list="[row.pic]" class="small-img circle-img"/>
            <span class="ml5">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销量"  prop="sales"/>
      <el-table-column label="创建时间"  prop="createTime"/>
    </el-table>
    <pagination
      v-show="chooseSkuObj.total>0"
      :total="chooseSkuObj.total"
      :page.sync="chooseSkuObj.queryParams.pageNum"
      :limit.sync="chooseSkuObj.queryParams.pageSize"
      @pagination="getSkuList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="chooseSkuObj.open=false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {listPmsProduct} from "@/api/pms/product";
import ProductCategorySelect from "@/views/components/ProductCategorySelect.vue";

export default {
  components: {ProductCategorySelect},
  data() {
    return {
      selectSkuIds: [],
      selectProducts: [],
      chooseSkuObj: {
        loading: false,
        open: false,
        title: "选择菜品",
        list: [],
        width: '60%',
        queryParams: {
          pageNum: 1,
          categoryId: null,
          pageSize: 10,
          nameLike: null,
          publishStatus: 1,
          excludeProductIds: []
        },
        total: 0
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('onComplete', this.selectProducts)
      this.chooseSkuObj.open = false
    },
    async init(chooseProductId) {
      this.chooseSkuObj.queryParams.excludeProductIds = chooseProductId;
      this.chooseSkuObj.queryParams.pageNum = 1;
      await this.getSkuList();
      this.chooseSkuObj.open = true
      this.$nextTick(()=>{
        this.$refs.table.clearSelection()
      })
    },
    judge() {
      this.$nextTick(()=>{
        this.chooseSkuObj.list.forEach(ele => {
          if (this.selectProducts.some(item => item.id === ele.id)) {
            this.$refs.table.toggleRowSelection(ele, true)
          } else {
            this.$refs.table.toggleRowSelection(ele, false)
          }
        });
      })
    },
    handleSelectionChange(selection) {
      this.selectProducts = selection
    },
    async getSkuList() {
      this.chooseSkuObj.loading = true;
      const query = {...this.chooseSkuObj.queryParams, pageNum: undefined, pageSize: undefined};
      if (query.categoryId && Array.isArray(query.categoryId)) {
        query.categoryId = query.categoryId.pop()
      }
      const {pageNum, pageSize} = this.chooseSkuObj.queryParams;
      const pageReq = {page: pageNum - 1, size: pageSize};
      await listPmsProduct(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.chooseSkuObj.list = [...content];
        this.chooseSkuObj.total = totalElements;
        this.chooseSkuObj.loading = false;
      });
    },
  }
}
</script>

<style lang="stylus">
.line
  display flex
  align-items center
  margin-bottom: 5px;
  border-bottom 1px dashed #ccc

.line:last-child
  border-bottom 0 !important
  margin-bottom 0 !important
</style>
