<template>
    <div class="order_detail_wrapper">
        <el-main v-loading="loading">
            <el-card>
                <el-descriptions title="订单信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
                    <template slot="extra">
                        <el-button size="small" @click="$router.back()">返回</el-button>
                    </template>
                    <el-descriptions-item label="订单编号">{{ orderDetail.orderId }}</el-descriptions-item>
                    <el-descriptions-item label="用户名称">{{ orderDetail.userName }}</el-descriptions-item>
                    <el-descriptions-item label="用户手机号">{{ orderDetail.userPhone }}</el-descriptions-item>
                    <el-descriptions-item label="下单时间">{{ parseTime(orderDetail.createTime, '') }}</el-descriptions-item>
                    <el-descriptions-item label="支付方式">{{ getPayType(orderDetail) }}</el-descriptions-item>
                    <el-descriptions-item label="支付时间">{{ parseTime(orderDetail.payTime, '')
                    }}</el-descriptions-item>
                    <el-descriptions-item label="订单状态">{{ getOrderStatus(orderDetail) }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card>
                <el-descriptions title="收货信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
                    <el-descriptions-item label="收货人姓名">{{ getHiddenName(addressInfo.name) }}</el-descriptions-item>
                    <el-descriptions-item label="收货人手机号">{{ addressInfo.userPhone }}</el-descriptions-item>
                    <el-descriptions-item label="收货区域">{{ addressInfo.area }}</el-descriptions-item>
                    <el-descriptions-item label="详细地址">{{ getHiddenDetailAddress(addressInfo.address) }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card>
                <div slot="header" style="font-size: 16px;font-weight: bold;">商品信息</div>
                <el-table :data="products">
                    <el-table-column label="商品图片" prop="pic">
                        <template slot-scope="{row}"><el-image class="small-img circle-img" :src="row.pic"
                                :preview-src-list="[row.pic]" /></template>
                    </el-table-column>
                    <el-table-column label="商品ID" prop="productId"></el-table-column>
                    <el-table-column label="商品名称" prop="productName"></el-table-column>
                    <el-table-column label="商品规格" align="center" prop="spData" width="180">
                      <template slot-scope="scope">
                        <div v-for="(item,key) in JSON.parse(scope.row.spData)">{{ key }}：{{ item }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="购买数量" prop="buyNum"></el-table-column>
                    <el-table-column label="实付金额" prop="payAmount">
                        <template slot-scope="scope">
                            <span>￥{{ orderDetail.payAmount }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card>
                <el-descriptions title="物流信息" :column="3" border label-class-name="my-label" contentClassName="my-content">
                    <el-descriptions-item label="发货时间">{{ parseTime(orderDetail.deliveryTime, '')
                    }}</el-descriptions-item>
                    <el-descriptions-item label="快递单号">{{ orderDetail.expressNo }}</el-descriptions-item>
                    <el-descriptions-item label="物流公司">{{ orderDetail.expressName }}</el-descriptions-item>
<!--                    <el-descriptions-item label="物流进度">-->
<!--                        <el-popover placement="top" width="300" trigger="hover" popper-class="popperOptions">-->
<!--                            <el-timeline-item v-for="(activity, index) in aliLogisticsInfoList" :key="index"-->
<!--                                :timestamp="activity.time">-->
<!--                                {{ activity.context }}-->
<!--                            </el-timeline-item>-->
<!--                            <span slot="reference">{{ orderDetail.logistics }}</span>-->
<!--                        </el-popover>-->
<!--                    </el-descriptions-item>-->
                </el-descriptions>
            </el-card>
        </el-main>
    </div>
</template>

<script>
import { getOmsOrder } from "@/api/oms/order";
import { getConfigKey } from "@/api/system/config";
const key = "express-set-key"

export default {
    name: "OrderDetail",
    dicts: ['oms_order_status', 'oms_pay_type'],
    data() {
        return {
            products: [],
            orderDetail: {},
            addressInfo: {},
            aliLogisticsInfoList: [],
            loading: false,
            experssList: []
        }
    },
    created() {
        // this.getExpressData()
        const { id } = this.$route.query
        this.queryDetail(id).then((expressNo) => {
        })

    },
    computed: {
        orderStatusMap() {
            let obj = this.dict.type.oms_order_status.map(item => [item.value, item.label])
            let map = new Map(obj)
            return map;
        },
        payTypeMap() {
            let obj = this.dict.type.oms_pay_type.map(item => [item.value, item.label])
            let map = new Map(obj)
            return map
        },
        // expressMap() {
        //     let obj = this.experssList.map(item => [item.expressCode, item.expressName])
        //     let map = new Map(obj)
        //     return map
        // }
    },
    methods: {
        queryDetail(id) {
            this.loading = true
            return new Promise(resolve =>
                getOmsOrder(id).then(res => {
                    const { productInfo, addressInfo } = res;
                    this.orderDetail = res;
                    // if (allLogistics) {
                    //     this.aliLogisticsInfoList = JSON.parse(allLogistics)
                    // }
                    this.products = productInfo
                    this.addressInfo = addressInfo
                    this.loading = false
                })
            )
        },
        getOrderStatus(row) {
            return this.orderStatusMap.get(row.orderStatus + '')
        },
        getPayType(row) {
            return this.payTypeMap.get(row.payType + '')
        },
        // getExpressName(row) {
        //     return this.expressMap.get(row.expressName + '')
        // },
        // getExpressData() {
        //     getConfigKey(key).then(res => {
        //         if (res.msg) {
        //             this.experssList = JSON.parse(res.msg)
        //         } else {
        //             // this.list = [...defaultList]
        //         }
        //     })
        // }
    }
}
</script>

<style lang="stylus">
  .order_detail_wrapper
    > .el-card + .el-card
      margin-top 1rem

    .el-form-item
      margin-bottom 0

      .el-form-item__content, .el-form-item__label
        line-height 2

  .my-label
    width 100px
  .my-content
    width 400px
.popperOptions[x-placement^=left] .popper__arrow::after{
    border-left-color: #565D6B;
}
.popperOptions[x-placement^=right] .popper__arrow::after{
    border-right-color: #565D6B;
}
.popperOptions[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #565D6B;
}
.popperOptions[x-placement^=top] .popper__arrow::after{
    border-top-color: #565D6B;
}
.popperOptions{
    background-color: #565D6B;
    color: #FFFFFF;
    border: #565D6B;
}
.el-timeline-item__content {
    color: #fff;
}
.el-timeline-item__timestamp {
    color: #fff;
}
  </style>
