<template>
  <el-dialog title="领取记录" :visible.sync="open" width="80%" append-to-body>
    <el-form :model="queryParams" :inline="true" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="使用状态" prop="useStatus">
        <DictRadio v-model="queryParams.useStatus" @change="handleQuery" size="small"
                   :radioData="dict.type.activity_coupon_status" :showAll="'all'"/>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="券ID" align="center" prop="id" />
      <el-table-column label="用户信息 " align="center">
        <template slot-scope="scope">
          <div class="flex-center">
            <el-avatar :src="scope.row.avatar"></el-avatar>
            <div class="tl ml5">
              <p>{{scope.row.nickname}}</p>
              <p>{{scope.row.phone}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" align="center" prop="createTime" width="180" />
      <el-table-column label="使用状态" align="center">
        <template slot-scope="scope">
          <dict-tag :value="scope.row.useStatus" prop-name="activity_coupon_status"/>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center" width="180" >
        <template slot-scope="scope">
          <p>{{ scope.row.startTime}}</p>
          <p> ~ </p>
          <p>{{ scope.row.endTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="itemId" />
      <el-table-column label="使用时间" align="center" prop="useTime" width="180" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>
<script>

import {listMemberCoupon} from "@/api/act/memberCoupon";

export default {
  dicts: ['activity_coupon_status'],
  data(){
    return{
      open:false,
      loading: false,
      tableList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        useStatus: null,
        couponActivityId: null,
      },
      total: 0,
    }
  },
  methods:{
    async init(activityId){
      if (!activityId) {
        return
      }
      this.queryParams.couponActivityId = activityId
      await this.handleQuery()
      this.open = true
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      return listMemberCoupon(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.tableList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
  }
}
</script>
