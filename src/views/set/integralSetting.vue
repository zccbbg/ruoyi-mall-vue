<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <div class="flex-center">
          <h2>积分获取规则</h2>
          <el-button class="ml-auto" type="primary" @click="saveData" v-hasPermi="['sys:integral:save']">保存
          </el-button>
        </div>
      </div>
      <el-form :model="incomeVal" label-width="180px">
        <el-form-item label="签到活动状态">
          <el-switch v-model="incomeVal.signStatus" :active-value="1" :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="每日签到固定积分">
          <el-input
            type="number"
            v-model="incomeVal.signCount"
            style="width:200px"
            placeholder="每天签到获取的积分"
          >
            <template slot="append">
              <span>积分</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="消费获得积分">
          <div class="flex-center">
            <span class="mr5">每消费</span>
            <el-input
              type="number"
              v-model="incomeVal.orderAmount"
              style="width:200px"
              placeholder="每天签到获取的积分"
            >
              <template slot="append">
                <span>元</span>
              </template>
            </el-input>
            <span class="ml5 mr5">，获得</span>
            <el-input
              type="number"
              v-model="incomeVal.orderCount"
              style="width:200px"
              placeholder="每天签到获取的积分"
            >
              <template slot="append">
                <span>积分</span>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {addOrUpdate, getConfigKey2} from "@/api/system/config";

const key = "activity-integral-income-set-key"

const defaultIncomeVal = {
  signStatus: 1,
  signCount: 1,
  orderAmount: 1,
  orderCount: 1
}

export default {
  data() {
    return {
      incomeObj: {},
      incomeVal: {},
    }
  },
  methods: {
    initData() {
      getConfigKey2(key).then(res => {
        if (res.data) {
          this.incomeObj = res.data
          this.incomeVal = JSON.parse(res.data.configValue)
        } else {
          this.incomeVal = {...defaultIncomeVal}
          this.incomeObj = {
            configValue: JSON.stringify(this.incomeVal),
            configKey: key,
            configType: 'N',
            configName: '业务员礼金上限设置',
            configId: null
          }
        }
      })
    },
    saveData() {
      let self = this;
      this.$modal.confirm('是否确认要保存积分获取规则？').then(function () {
        self.incomeObj.configValue = JSON.stringify(self.incomeVal)
        return addOrUpdate(self.incomeObj);
      }).then(() => {
        this.initData();
        this.$modal.msgSuccess("保存成功");
      }).catch(() => {
      });
    },
  },
  created() {
    this.initData()
  },
}
</script>

<style lang="scss" scoped>
.number-input {
  width: 120px;
}

.jc {
  justify-content: center;
}
</style>
