<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="收货人姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入收货人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮政编码" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入邮政编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份/直辖市" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入省份/直辖市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="区" prop="district">
        <el-input
          v-model="queryParams.district"
          placeholder="请输入区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input
          v-model="queryParams.detailAddress"
          placeholder="请输入详细地址"
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

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['ums:memberAddress:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      </el-col>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="umsMemberAddressList">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="收货人姓名" align="center" prop="name" >
        <template v-slot="scope">
          <div>{{ getHiddenName(scope.row.name)  }}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phoneHidden" />
      <el-table-column label="邮政编码" align="center" prop="postCode" />
      <el-table-column label="省份/直辖市" align="center" prop="province" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="区" align="center" prop="district" />
      <el-table-column label="详细地址" align="center" prop="detailAddress" width="250">
        <template v-slot="scope">
          <div>{{ replaceDetailAddress(scope.row.detailAddress.replaceAll((/[\d]+/g),'*')) }}</div>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['ums:memberAddress:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['ums:memberAddress:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改会员收货地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="MEMBER_ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入MEMBER_ID" />
        </el-form-item>
        <el-form-item label="收货人名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人名称" />
        </el-form-item>
        <el-form-item label="PHONE" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入PHONE" />
        </el-form-item>
        <el-form-item label="是否为默认">
          <el-radio-group v-model="form.defaultStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入邮政编码" />
        </el-form-item>
        <el-form-item label="省份/直辖市" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份/直辖市" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区" prop="district">
          <el-input v-model="form.district" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="详细地址(街道)" prop="detailAddress">
          <el-input v-model="form.detailAddress" placeholder="请输入详细地址(街道)" />
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-input v-model="form.isDefault" placeholder="请输入是否默认" />
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
import { listUmsMemberAddress, getUmsMemberAddress, delUmsMemberAddress, addUmsMemberAddress, updateUmsMemberAddress, exportUmsMemberAddress } from "@/api/ums/memberAddress";

export default {
  name: "UmsMemberAddress",
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
      // 会员收货地址表格数据
      umsMemberAddressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberId: null,
        name: null,
        phone: null,
        defaultStatus: null,
        postCode: null,
        province: null,
        city: null,
        district: null,
        detailAddress: null,
        isDefault: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        isDefault: [
          { required: true, message: "是否默认不能为空", trigger: "blur" }
        ],
      },
      showMoreCondition: false,
      chineseNumbers: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会员收货地址列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listUmsMemberAddress(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.umsMemberAddressList = content;
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
        name: null,
        phone: null,
        defaultStatus: 0,
        postCode: null,
        province: null,
        city: null,
        district: null,
        detailAddress: null,
        isDefault: null,
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
      this.title = "添加会员收货地址";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUmsMemberAddress(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改会员收货地址";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUmsMemberAddress(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUmsMemberAddress(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除会员收货地址编号为"' + ids + '"的数据项？').then(function() {
        return delUmsMemberAddress(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有会员收货地址数据项？').then(() => {
        this.exportLoading = true;
        return exportUmsMemberAddress(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    },
    replaceDetailAddress(data){
      if (!data || data.length === 0){
        return ''
      }
      let result = ''
      for(let i=0;i<data.length;i++){
        if (this.chineseNumbers.includes(data[i])){
          result += '*'
        }else {
          result += data[i]
        }
      }
      return result
    },
    getHiddenName(name){
      if (!name) return
      const surname = name.substr(0, 1)
      const star = '*'.repeat(name.length - 1)
      return surname + star
    }
  }
};
</script>
