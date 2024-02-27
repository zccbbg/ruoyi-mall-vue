<template>
  <div class="app-container" >
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="创建时间">
        <el-date-picker
          size="small"
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          :clearable="true"
          :picker-options='pickerOptions'
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="queryParams.status" clearable size="small">
          <el-option value="0" label="未处理" />
          <el-option value="1" label="已处理" />
        </el-select>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="feedbackList">
      <el-table-column label="反馈人" align="left" prop="nickname" width="150">
        <template v-slot="scope">
          <p>用户ID：{{scope.row.createBy}}</p>
          <p>{{scope.row.phone}}</p>
        </template>
      </el-table-column>
      <el-table-column label="反馈时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <div>{{ parseTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="反馈类型" align="center" prop="type"/>
      <el-table-column label="具体内容" align="center" prop="content" show-overflow-tooltip/>
      <el-table-column label="图片">
        <template v-slot="scope">
          <el-image
            v-if="scope.row.imageList.length"
            style="width: 60px; height: 60px"
            v-for="it in scope.row.imageList" :key="it"
            :src="it"
            :preview-src-list="[it]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="处理状态/时间" align="center">
        <template v-slot="scope">
          <div v-if="scope.row.handleStatus === 1">已处理</div>
          <el-switch v-else v-model="scope.row.handleStatus" active-value="1" inactive-value="0" @change="changeStatus(scope.row)"/>
          <div>{{ scope.row.handleTime ? parseTime(scope.row.handleTime) : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template v-slot="scope">
          <span class="mr10">{{scope.row.remark}}</span>
          <i class="el-icon-edit pointer" @click="showUpdateMark(scope.row)"></i>
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
    <el-dialog title="修改备注" :visible.sync="remarkModal.visible" width="30%" append-to-body>
      <el-input type='textarea' :rows='3' placeholder='请输入内容' v-model='remarkModal.remark'/>
      <span class="dialog-footer" slot="footer">
        <el-button @click="remarkModal.visible = false">取 消</el-button>
        <el-button type='primary' @click='updateRemark'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFeedbacks,
  updateMark,
  changeHandleStatus
} from "@/api/ums/feedback";
import dateUtil from '@/utils/DateUtil';
import {mapGetters} from "vuex";

export default {
  name: "UmsMember",
  data() {
    return {
      show: false,
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort()
      },
      remarkModal: {
        visible: false,
        mark: null,
        memberId: null,
      },
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
      // 会员信息表格数据
      feedbackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
      },
      dateRange:[],
      // 表单参数
      form: {},
    };
  },
  async created() {
    this.getList();
  },
  computed:{
    ...mapGetters(['userId']),
  },
  methods: {
    showUpdateMark(record){
      this.remarkModal = {
        visible: true,
        remark: record.remark,
        id: record.id
      }
    },
    updateRemark(){
      updateMark({id:this.remarkModal.id,remark:this.remarkModal.remark})
        .then(res=>{
          if (res > 0) {
            this.$message.success('修改成功');
            this.remarkModal.visible = false;
            const obj = this.feedbackList.filter(it=>it.id === this.remarkModal.id)[0]
            console.log(111,obj,this.remarkModal.remark)
            obj.remark = this.remarkModal.remark;
          } else {
            this.$message.error('修改失败');
          }
        })
    },
    /** 查询会员信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      let query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      if (!this.dateRange || this.dateRange.length > 0){
        query = { ...this.addDateRange2(query, this.dateRange) }
      }
      listFeedbacks(query, pageReq).then(response => {
        const { content, totalElements } = response
        content.forEach(it=>{
          if (it.images) {
            it.imageList = it.images.split(',')
          } else {
            it.imageList = []
          }
        })
        this.feedbackList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 更改账户状态
    changeStatus(row){
      const data = {
        id: row.id,
        handleStatus: row.handleStatus
      }
      changeHandleStatus(data).then(response => {
        if (response){
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
  }
};
</script>
