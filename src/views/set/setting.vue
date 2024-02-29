<template>
  <div class="app-container">
    <el-tabs v-model="activeKey" @tab-click="changeType">
      <el-tab-pane v-for="it in tabList" :key="it.value" :label="it.label" :name="it.value"/>
    </el-tabs>
    <Editor v-model="currentConfig.configValue" placeholder="请输入内容" type="url"></Editor>
    <el-button type="primary" class="mt20" @click="asyncOk">保存</el-button>
    <el-button class="mt20 ml20" @click="getData">重置</el-button>
  </div>
</template>

<script>
import {getConfigKey2, addOrUpdate} from '@/api/system/config'

export default {
  data() {
    return {
      //常见问题，隐私协议，联系客服
      activeKey: 'mall.contact',
      tabList: [
        {label: '客服配置', value: 'mall.contact'},
        {label: '隐私协议', value: 'mall.privacyAgreement'},
        {label: '常见问题', value: 'mall.question'},
        {label: '关于我们', value: 'mall.aboutUs'},
      ],
      configList: [],
      currentConfig: {
        configValue: '',
      }
    }
  },
  methods: {
    changeType() {
      this.currentConfig = this.configList.filter(it => it.configKey === this.activeKey)[0]
      console.log(this.currentConfig)
    },
    getData() {
      const funcArr = this.tabList.map(it => {
        return getConfigKey2(it.value)
      })
      const list = []
      Promise.all(funcArr).then(res => {
        res.forEach((it, idx) => {
          list.push(it.data ? it.data : {
            configValue: '',
            configType: 'N',
            configKey: this.tabList[idx].value,
            configName: this.tabList[idx].label,
            configId: null
          })
        })
        this.configList = list
        this.changeType()
      })
    },
    asyncOk() {
      addOrUpdate(this.currentConfig).then(res=>{
        this.$message.success('保存成功')
        this.getData()
      })
    }
  },
  created() {
    this.getData()
  },

}
</script>
