<template>
  <el-card style="margin: 20px 20px; font-size: 14px;">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="6">
          <div style="font-weight: bold;font-size: 16px">订单统计</div>
        </el-col>
        <el-col :span="18">
          <div style="text-align: right">
            <el-radio-group  v-model="params.type" size="small" @change="orderStat">
              <el-radio-button label="2">近一个月</el-radio-button>
              <el-radio-button label="1">近七日</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div :style="{minHeight:height,minWidth:width}">
      <div ref="chart" class="chart" :style="{height:height,width:width}"/>
    </div>
  </el-card>
</template>
<script>

import {orderStatistics} from "@/api/statistics";
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  name: "OrderLineChart",
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '440px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            let start = new Date();
            start.setFullYear(2018);
            start.setMonth(10);
            start.setDate(1);
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            const end = new Date();
            let start = new Date();
            start.setFullYear(2018);
            start.setMonth(10);
            start.setDate(1);
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderCountDate: '',
      params: {
        type: 2
      },
      chartData: {},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.orderStat()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({dateList, orderAmount, orderCount} = {}) {
      this.chart.setOption({
        title: {
          text: '订单量趋势',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bolder',
            color: '#000000'          // 主标题文字颜色
          },
        },
        xAxis: {
          data: dateList,
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            rotate: 40
          },
          textStyle: {
            fontSize: 12,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#000000"
            }
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            position: 'left',
            alignTicks: true,
            splitLine:{
              show: false
            },
            axisTick:{
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#000000"
              }
            },
          },
          {
            type: 'value',
            name: '数量',
            minInterval:1,
            position: 'right',
            splitLine:{
              show: false
            },
            axisTick:{
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#000000"
              }
            },
          }
        ],
        legend: {
          data: ['订单金额', '订单数']
        },
        series: [
          {
            name: '订单金额',
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              }
            },
            type: 'bar',
            barMaxWidth: 20,
            data: orderAmount,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '订单数',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#5ccfd9',
              }
            },
            yAxisIndex: 1,
            data: orderCount,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
          ]
      })
    },
    handleDateChange() {
      this.getData();
    },
    orderStat(){
      orderStatistics(this.params).then(res => {
        const orderAmount = res.map(it => {
          return it.orderAmount
        })
        const orderCount = res.map(it => {
          return it.orderCount
        })
        const dateList = res.map(it => {
          return it.date.substr(5)
        })
        this.chartData = {dateList, orderAmount, orderCount}
        this.initChart()
      })
    }
  }

}
</script>
<style scoped lang="scss">

</style>
