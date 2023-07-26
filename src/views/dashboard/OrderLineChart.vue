<template>
  <el-card style="margin: 20px 20px; font-size: 14px;">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12">
          <div style="text-align: left">
            <el-radio-group v-model="params.type" size="small" @change="OnRadioChange">
              <el-radio-button label="0">订单数</el-radio-button>
              <el-radio-button label="30">支付金额</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <div style="border-left:1px solid #DCDFE6">-->
<!--            <el-date-picker v-model="orderCountDate" align="right" end-placeholder="结束日期"-->
<!--                            :picker-options="pickerOptions" range-separator="至" size="small"-->
<!--                            start-placeholder="开始日期" style="float: right;z-index: 1" type="daterange"-->
<!--                            unlink-panels="unlink-panels" @change="handleDateChange"></el-date-picker>-->
<!--          </div>-->
<!--        </el-col>-->

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
      default: '350px'
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
        type: 0
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
    orderStatistics().then(res => {
      const orderAmount = res.map(it => {
        return it.orderAmount
      })
      const orderCount = res.map(it => {
        return it.orderCount
      })
      const dateList = res.map(it => {
        return it.date
      })
      console.log(dateList, 'date')
      this.chartData = {dateList, orderAmount, orderCount}
      this.initChart()
    })
  },
  methods: {
    OnRadioChange(type) {
      this.initChart(type)

    },
    initChart(type = 0) {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      if (type == 0) {
        this.setOptions(this.chartData)
      } else {
        this.setAmountOptions(this.chartData)
      }

    },
    setOptions({dateList, orderAmount, orderCount} = {}) {
      this.chart.setOption({
        xAxis: {
          data: dateList,
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['订单数', '支付订单']
        },
        series: [
          //   {
          //   name: '订单数', itemStyle: {
          //     normal: {
          //       color: '#FF005A',
          //       lineStyle: {
          //         color: '#FF005A',
          //         width: 2
          //       }
          //     }
          //   },
          //   smooth: true,
          //   type: 'line',
          //   data: orderAmount,
          //   animationDuration: 2800,
          //   animationEasing: 'cubicInOut'
          // },
          {
            name: '支付订单',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: orderCount,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    }
    , setAmountOptions({dateList, orderAmount, orderCount} = {}) {
      this.chart.setOption({
        xAxis: {
          data: dateList,
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['支付金额']
        },
        series: [
          {
            name: '支付金额', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: orderAmount,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
        ]
      })
    },
    handleDateChange() {
      this.getData();
    }
    ,
  }

}
</script>
<style scoped lang="scss">

</style>
