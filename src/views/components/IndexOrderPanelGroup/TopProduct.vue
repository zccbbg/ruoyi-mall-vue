<template>
  <div class="sales-top">
    <el-card>
      <div slot="header" class="clearfix">

        <el-row>
          <el-col :span="6">
            <div style="font-size: large">
              <el-radio-group v-model="params.statType" size="small" @change="getData">
                <el-radio-button label="2">商品销量榜</el-radio-button>
                <el-radio-button label="1">规格销量榜</el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="18">
            <div style="text-align: right">
              <el-radio-group  v-model="params.type" size="small" @change="getData">
                <el-radio-button label="0">今日</el-radio-button>
                <el-radio-button label="7">近七日</el-radio-button>
                <el-radio-button label="30">近三十日</el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="salesTopData" :border="false">
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="spData" label="规格" v-if="params.statType == 1">
          <template v-slot="scope">
            <div v-for="(value, key) in JSON.parse(scope.row.spData)">{{ key }}：{{ value }}&nbsp;</div>
          </template>
        </el-table-column>
        <el-table-column label="主图" align="center" prop="pic">
          <template slot-scope="{ row }">
            <el-image v-if="row.pic" :src="row.pic" :preview-src-list="[row.pic]" class="small-img circle-img"/>
          </template>
        </el-table-column>
        <el-table-column prop="totalSales" label="销量" width="120">
          <template #default="{ row }">
            {{ row.totalSales }} 件
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {goodsStatistics} from "@/api/statistics";
import dateUtil from '@/utils/DateUtil';

export default {
  name: 'TopProduct',
  data() {
    return {
      salesTopData: [],
      params: {
        statType: 1,
        type:0,
        size: 10,
        startDate: '2023-02-01',
        endDate: '2023-06-01'
      },
      loading: false
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      this.loading = true
      let range= Number(this.params.type)
      this.params.startDate = dateUtil.getAfterDate(-range)
      this.params.endDate = dateUtil.getAfterDate(0)
      goodsStatistics(this.params).then(res => {
        this.salesTopData = res
        this.loading = false
      })
    },
  },
};
</script>

<style>
.sales-top {
  margin: 20px;
}

.export-btn {
  float: right;
  margin-right: 20px;
}
</style>
