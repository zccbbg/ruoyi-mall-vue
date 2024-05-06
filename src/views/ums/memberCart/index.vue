<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="用户手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="用户手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="商品名称"
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

    <el-table v-loading="loading" :data="umsMemberCartList" @selection-change="handleSelectionChange" border cell-class-name="my-cell">
<!--      <el-table-column type="selection" width="55"  />-->
      <el-table-column label="用户信息"  prop="phoneHidden">
        <template v-slot="scope">
          <p>{{scope.row.phoneHidden}}</p>
          <p>{{scope.row.nickname}}</p>
        </template>
      </el-table-column>
      <el-table-column label="用户备注"  prop="mark" />
      <el-table-column label="商品名称"  prop="productName" />
      <el-table-column label="商品规格"  prop="spData">
        <template v-slot="scope">
          <div class="product-container">
            <el-popover
              placement="right"
              trigger="hover">
              <el-image :src="scope.row.pic" style="width: 350px;height: 350px"/>
              <el-image slot="reference" class="small-img product-item" :src="scope.row.pic" style="width: 40px;height: 40px"/>
            </el-popover>
            <div class="product-item" style="margin-left: 5px">
              <div class="sp-data">
                <span v-for="(value, key) in JSON.parse(scope.row.spData)">{{ key }}：{{ value }}&nbsp;</span>
              </div>
              <div class="product-item quantity">
                <span style="margin-right: 10px">￥{{ scope.row.price }}</span>
                <span>x{{ scope.row.quantity }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
<!--      <el-table-column label="价格"  prop="price">-->
<!--        <template v-slot="scope">-->
<!--          <div>{{ scope.row.price.toFixed(2) }}</div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="状态"  prop="skuIfExist">
        <template v-slot="scope">
          <el-tag effect="plain" size="medium" :type="scope.row.skuIfExist === 1 ? 'success' : 'error'">
            {{ scope.row.skuIfExist === 1 ? '有效' : '失效' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="加入时间"  prop="createTime">
        <template v-slot="scope">
          <div>{{ parseTime(scope.row.createTime, '')}}</div>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作"  class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['ums:memberCart:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['ums:memberCart:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <InBody v-show="total>0">
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </InBody>

  </div>
</template>

<script>
import {
  addUmsMemberCart,
  delUmsMemberCart,
  exportUmsMemberCart,
  getUmsMemberCart,
  listUmsMemberCart,
  updateUmsMemberCart
} from "@/api/ums/memberCart";

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
        productName: null,
        phone: null
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    const { phone } = this.$route.query
    if (phone){
      this.queryParams.phone = phone
    }
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
        quantity: null,
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
      // this.handleQuery();
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
<style lang="scss">
.product-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 180px;
  .product-item{
    margin: auto;
    width: 180px;
    .sp-data{
      font-size: 13px;
    }
    .quantity{
      font-weight: bold;
      font-size: 13px;
    }
  }
}
.el-table .my-cell {
  vertical-align: top
}
</style>
