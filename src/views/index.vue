<template>
  <div class="home-wrapper">
    <el-card style="margin: 20px 20px; font-size: 14px">
      <div slot="header"><span>工作台</span></div>
      <div class="first"><img alt="" :src="avatar" style="width: 50px; height: 50px; float:left; margin-right:10px;border-radius:50%" />
        <p style="font-size:16px;margin-bottom:8px">{{name}}，{{hello}}</p>
        <p style="font-size:12px;color:rgb(185, 181, 189)">今天是：{{nowTime}}</p>
      </div>
      <div class="first">
        <ul>
          <li class="li" style="width: 33%">会员数
          </li>
          <li class="li" style="width: 33%">加购数
          </li>
          <li class="li" style="width: 33%">
            分销商数
            <el-popover class="ml5" content="功能暂未开发" placement="top" trigger="hover"><i class="el-icon-warning-outline" slot="reference"></i></el-popover>
          </li>
        </ul>
        <ul>
          <li class="da" style="width: 33%">
             <router-link to="/member/member">{{ memberAndCartStatisticsObj.memberCount }}</router-link>

          </li>
          <li class="da" style="width: 33%">
             <router-link to="/member/shoppingCart">{{ memberAndCartStatisticsObj.cartCount }}</router-link>
          </li>
          <li class="da" style="width: 33%">
            10
          </li>
        </ul>
      </div>
    </el-card>
    <el-row class="pl20 pr20" :gutter="10">
      <el-col :span="3">
        <el-image
          style="height: 150px"
          :src="require('@/assets/QRCode/h5.png')"
          fit="fill"
        ></el-image>
      </el-col>
      <el-col :span="3">
        <el-image
          style="height: 150px"
          :src="require('@/assets/QRCode/wechat_mini.jpg')"
          fit="fill"
        ></el-image>
      </el-col>

      <el-col :span="6">
        <el-card shadow="always" style="padding-bottom: 30px">
          <div slot="header"><span>售后</span></div>
          <ul style="margin-top: 10px">
            <li class="li" style="width: 50%">待处理
            </li>
            <li class="li" style="width: 50%">处理中
            </li>
          </ul>
          <ul>
            <li class="da" style="width: 50%">
              <router-link :to="{path:'/order/aftersale', query:{status:0}}">{{ orderAndAftersaleStatisticsObj.pendingAftersaleCount }}</router-link>
            </li>
            <li class="da" style="width: 50%">
              <router-link :to="{path:'/order/aftersale', query:{status:1}}">{{ orderAndAftersaleStatisticsObj.processingAftersaleCount }}</router-link>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" style="padding-bottom: 30px">
          <div slot="header"><span>订单</span></div>
          <div>
            <ul style="margin-top: 10px">
              <li class="li">未发订单数
              </li>
              <li class="li">今日订单数
              </li>
              <li class="li">今日成交额
              </li>
              <li class="li">今日发货数
              </li>
            </ul>
            <ul>
              <li class="da">
                <router-link :to="{path:'/order/order',query:{status:1}}">{{ orderAndAftersaleStatisticsObj.waitDeliveredCount }}</router-link>
              </li>
              <li class="da">
                 <router-link :to="{path:'/order/order',query:{today:true}}">{{ orderAndAftersaleStatisticsObj.todayOrderCount }}</router-link>
              </li>
              <li class="da">
                 <router-link :to="{path:'/order/order',query:{today:true,status:1}}">{{ orderAndAftersaleStatisticsObj.todayTransactionAmount }}</router-link>
              </li>
              <li class="da">
                 <router-link :to="{path:'/order/order',query:{today:true, status: 2}}">{{ orderAndAftersaleStatisticsObj.todayHasDeliveredCount }}</router-link>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="pl20 pr20" :gutter="10">
      <el-col :span="16">
        <order-line-chart></order-line-chart>
        <div class="card transform">
          <top-product></top-product>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 20px 20px; font-size: 14px">
          <div slot="header"><span>发展历程</span></div>
          <el-timeline>
            <el-timeline-item placement="top" timestamp="2018年">
              <el-card>
                <h4>参与京东服务市场商品分析应用开发，参与京东服务市场会员积分应用开发</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item placement="top" timestamp="2019年">
              <el-card>
                <h4>参与京东服务市场商品搬家应用开发，参与拼多多服务市场订单应用开发</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item placement="top" timestamp="2020年">
              <el-card>
                <h4>所参与开发的拼多多订单应用排名服务市场类目第一，开始快手服务市场订单应用开发</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item placement="top" timestamp="2021年">
              <el-card>
                <h4>日处理拼多多订单200万条，开始美团、饿了么应用市场应用开发</h4>
              </el-card>
            </el-timeline-item>
            <el-timeline-item placement="top" timestamp="2022年">
              <el-card>
                <h4>累计服务10万+电商平台店铺、5万+外卖店铺。开始抖音、淘宝服务市场订单应用开发，开源ruoyi-wms</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {str2Date} from '@/utils/date';
import PanelGroup from '@/views/components/PanelGroup'
import { mapGetters } from 'vuex'
import OrderLineChart from "@/views/dashboard/OrderLineChart.vue";
import TopProduct from "@/views/components/IndexOrderPanelGroup/TopProduct.vue";
import {memberAndCartStatistics, orderAndAftersaleStatistics} from "@/api/statistics";

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
    PanelGroup,
    OrderLineChart,
    TopProduct
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
      hello: '',
      memberAndCartStatisticsObj: {
        memberCount: 0,
        cartCount: 0
      },
      orderAndAftersaleStatisticsObj: {
        pendingAftersaleCount: 0,
        processingAftersaleCount: 0,
        waitDeliveredCount: 0,
        todayHasDeliveredCount: 0,
        todayOrderCount: 0,
        todayTransactionAmount: 0
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'name'])
  },
  created() {
    this.showTimes()
    this.helloTimes()
    this.memberAndCartStat()
    this.orderAndAftersaleStat()
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
    },
    memberAndCartStat(){
      memberAndCartStatistics().then((response) => {
        this.memberAndCartStatisticsObj = response
      })
    },
    orderAndAftersaleStat(){
      orderAndAftersaleStatistics().then((response) => {
        this.orderAndAftersaleStatisticsObj = response
      })
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
