<template lang="pug">
  .home-wrapper
    mixin info
      el-popover.ml5(content="功能开发中" placement="top" trigger="hover")
        i.el-icon-warning-outline(slot="reference")
    el-card(style="margin: 20px 20px; font-size: 14px")
      div(slot="header")
        span 工作台
      .first
        img(
          alt=""
          :src="avatar"
          style="width: 50px; height: 50px; float:left; margin-right:10px;border-radius:50%"
        )
        p(style="font-size:16px;margin-bottom:8px") {{name}}，{{hello}}
        p(style="font-size:12px;color:rgb(185, 181, 189)") 今天是：{{nowTime}}
      .first
        ul
          li.li(style="width: 33%") 访客数
            +info
          li.li(style="width: 33%") 支付买家数
            +info
          li.li(style="width: 33%") 浏览量
            +info
        ul
          li.da(style="width: 33%")
            router-link(to="/basic/warehouse") 2,910
          li.da(style="width: 33%")
            router-link(to="/basic/area") 56
          li.da(style="width: 33%")
            router-link(to="/basic/rack") 21,085
    el-row.pl20.pr20(:gutter="10")
      el-col(:span="8")
        el-card(shadow="always" style="padding-bottom: 20px")
          div(slot="header")
            span 售后
          ul
            li.li(style="width: 50%") 待处理
              +info
            li.li(style="width: 50%") 处理中
              +info
          ul
            li.da(style="width: 50%") 2
            li.da(style="width: 50%") 1
      el-col(:span="16")
        el-card(shadow="always" style="padding-bottom: 20px")
          div(slot="header")
            span 订单
          div
            ul
              li.li 未发订单数
                +info
              li.li 未揽件有退款
                +info
              li.li 发货超时
                +info
              li.li 物流预警
                +info
            ul
              li.da
                router-link(to="/relation/customer") 50
              li.da
                router-link(to="/relation/supplier") 0
              li.da
                router-link(to="/relation/carrier") 4
              li.da
                router-link(to="/item") 3
    el-row.pl20.pr20(:gutter="10")
      el-col(:span="16")
        el-card(style="margin: 20px 20px; font-size: 14px")
          div(slot="header")
            span 订单统计
          el-row
            el-col(:span="4")
              div(style="padding: 20px")
                div
                  div(style="color: #909399;font-size: 14px") 本月订单总数
                  div(style="color: #606266;font-size: 24px;padding: 10px 0") 10000
                  div
                    span.color-success(style="font-size: 14px") +10%
                    span(style="color: #C0C4CC;font-size: 14px") 同比上月
                div(style="margin-top: 20px;")
                  div(style="color: #909399;font-size: 14px") 本周订单总数
                  div(style="color: #606266;font-size: 24px;padding: 10px 0") 1000
                  div
                    span.color-danger(style="font-size: 14px") -10%
                    span(style="color: #C0C4CC;font-size: 14px") 同比上周
                div(style="margin-top: 20px;")
                  div(style="color: #909399;font-size: 14px") 本月销售总额
                  div(style="color: #606266;font-size: 24px;padding: 10px 0") 100000
                  div
                    span.color-success(style="font-size: 14px") +10%
                    span(style="color: #C0C4CC;font-size: 14px") 同比上月
                div(style="margin-top: 20px;")
                  div(style="color: #909399;font-size: 14px") 本周销售总额
                  div(style="color: #606266;font-size: 24px;padding: 10px 0") 50000
                  div
                    span.color-danger(style="font-size: 14px") -10%
                    span(style="color: #C0C4CC;font-size: 14px") 同比上周
            el-col(:span="20")
              div(style="padding: 10px;border-left:1px solid #DCDFE6")
                el-date-picker(
                  v-model="orderCountDate"
                  align="right"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  size="small"
                  start-placeholder="开始日期"
                  style="float: right;z-index: 1"
                  type="daterange"
                  unlink-panels
                  @change="handleDateChange"
                )
                div
                  ve-line(
                    :data-empty="dataEmpty"
                    :data="chartData"
                    :legend-visible="false"
                    :loading="loading"
                    :settings="chartSettings"
                  )
      el-col(:span="8")
        el-card(style="margin: 20px 20px; font-size: 14px")
          div(slot="header")
            span 发展历程
          el-timeline
            el-timeline-item(placement="top" timestamp="2018年")
              el-card
                h4 参与京东服务市场商品分析应用开发，参与京东服务市场会员积分应用开发
            el-timeline-item(placement="top" timestamp="2019年")
              el-card
                h4 参与京东服务市场商品搬家应用开发，参与拼多多服务市场订单应用开发
            el-timeline-item(placement="top" timestamp="2020年")
              el-card
                h4 所参与开发的拼多多订单应用排名服务市场类目第一，开始快手服务市场订单应用开发
            el-timeline-item(placement="top" timestamp="2021年")
              el-card
                h4 日处理拼多多订单200万条，开始美团、饿了么应用市场应用开发
            el-timeline-item(placement="top" timestamp="2022年")
              el-card
                h4 累计服务10万+电商平台店铺、5万+外卖店铺。开始抖音、淘宝服务市场订单应用开发，开源ruoyi-wms
</template>

<script>
import {str2Date} from '@/utils/date';
import PanelGroup from '@/views/components/PanelGroup'
import { mapGetters } from 'vuex'
const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount','orderAmount'],
    rows: [
      {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
      {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
      {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
      {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
      {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
      {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
    ]
  };

export default {
  components: {
    PanelGroup
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
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['orderAmount']},
        labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}},
        chartData: {
          columns: [],
          rows: []
        },
      loading: false,
      dataEmpty: false,
      nowTime: '',
      hello: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'name'])
  },
  created() {
    this.showTimes()
    this.helloTimes()
    this.initOrderCountDate()
    this.getData()
  },
  methods: {
    handleDateChange(){
        this.getData();
      },
      initOrderCountDate(){
        let start = new Date();
        start.setFullYear(2018, 10, 1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];
      },
      getData(){
        setTimeout(() => {
          this.chartData = {
            columns: ['date', 'orderCount','orderAmount'],
            rows: []
          };
          for(let i=0;i<DATA_FROM_BACKEND.rows.length;i++){
            let item=DATA_FROM_BACKEND.rows[i];
            let currDate=str2Date(item.date);
            let start=this.orderCountDate[0];
            let end=this.orderCountDate[1];
            if(currDate.getTime()>=start.getTime()&&currDate.getTime()<=end.getTime()){
              this.chartData.rows.push(item);
            }
          }
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      let date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      let hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      let week = new Date(timeStamp).getDay()
      let weeks = ['日', '一', '二', '三', '四', '五', '六']
      let getWeek = '星期' + weeks[week]
      this.nowTime =
        year +
        '年' +
        month +
        '月' +
        date +
        '日' +
        ' ' +

        getWeek
    },
    showTimes() {
      this.timeFormate(new Date())
    },
    helloTimes() {
      let hh = new Date().getHours()
      if (0 < hh < 12) {
        this.hello = '上午好'
      } else if (hh < 18) {
        this.hello = '下午好'
      } else {
        this.hello = '晚上好'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.home-wrapper

  .li {
    float: left;
    width: 25%;
    font-size: 12px;
    color: rgb(185, 181, 189);
  }

  .da {
    float: left;
    width: 25%;
    font-size: 20px;
  }

  .first {
    float: left;
    width: 50%;
    margin-bottom: 20px;
  }

  .el-table .warning-row {
    background: rgb(39, 138, 230);
  }
</style>
