<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
             class="ry_form">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.nameLike"
          placeholder="名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="层级" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="层级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示状态" prop="showStatus">
        <dict-select v-model="queryParams.showStatus" prop-name="sys_normal_disable"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="排序"
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
          v-hasPermi="['pms:productCategory:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="pmsProductCategoryList"
      :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
      @selection-change="handleSelectionChange"
      row-key="id">
      <el-table-column label="编号" align="center" prop="id" width="100"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="层级" align="center" prop="level"/>
      <el-table-column label="显示状态" align="center" prop="showStatus">
        <template v-slot="{ row }">
          <dict-tag :value="row.showStatus" prop-name="sys_normal_disable"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:productCategory:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:productCategory:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="上级分类" prop="parentId">
          <prod-category class="w200" v-model="form.parentId" :root="true"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="层级" prop="level">
          <el-input v-model="form.level" placeholder="层级：0->1级；1->2级"/>
        </el-form-item>
        <el-form-item label="显示状态">
          <dict-select v-model="form.showStatus" prop-name="sys_normal_disable"/>
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="顺序"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标"/>
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
import {
  listPmsProductCategory,
  getPmsProductCategory,
  delPmsProductCategory,
  addPmsProductCategory,
  updatePmsProductCategory,
  exportPmsProductCategory
} from "@/api/pms/productCategory";
import ProdCategory from "@/views/components/ProdCategory";

export default {
  name: "PmsProductCategory",
  components: {ProdCategory},
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
      // 商品分类表格数据
      pmsProductCategoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        parentId: null,
        nameLike: null,
        level: null,
        showStatus: null,
        sort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      const query = {...this.queryParams};
      listPmsProductCategory(query).then(rows => {
        const map = {}
        rows.forEach(it => {
          let list = map[it.parentId]
          if (!list) {
            list = [];
            map[it.parentId] = list;
          }
          list.push(it);
        })
        const idMap = {};
        rows.forEach((it, index) => idMap[it.id] = index);
        const rows1= [...rows]
        const removeIndex = new Set();
        for (let i = 0; i < rows1.length; i ++) {
          if (removeIndex.has(i)) {
            continue;
          }
          let n = rows1[i];
          while (idMap[n.parentId] !== undefined) {
            removeIndex.add(idMap[n.id]);
            n = rows[idMap[n.parentId]];
            n.children = map[n.id];
            continue;
          }
        }
        const idxs = [...removeIndex].sort();
        for (let i = idxs.length - 1; i >= 0; i--) {
          rows.splice(idxs[i], 1);
        }
        this.pmsProductCategoryList = rows;
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
        parentId: null,
        name: null,
        level: null,
        showStatus: 0,
        sort: null,
        icon: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPmsProductCategory(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改商品分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let p;
          if (this.form.id != null) {
            p = updatePmsProductCategory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            p = addPmsProductCategory(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
          p.then(() => {
            this.$store.dispatch('loadProductCategories', true)
          })
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除子目录');
        return;
      }
      const ids = row.id;
      this.$modal.confirm('是否确认删除商品分类编号为"' + ids + '"的数据项？').then(function () {
        return delPmsProductCategory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有商品分类数据项？').then(() => {
        this.exportLoading = true;
        return exportPmsProductCategory(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
