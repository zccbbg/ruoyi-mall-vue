<template>
    <div class="order_detail_wrapper">
        <el-main v-loading="loading">
            <el-card>
                <el-descriptions title="订单信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
                    <template slot="extra">
                        <el-button size="small" @click="$router.back()">返回</el-button>
                    </template>
                    <el-descriptions-item label="订单号">{{ orderDetail.orderSn }}</el-descriptions-item>
                    <el-descriptions-item label="用户昵称">{{ orderDetail.nickName }}</el-descriptions-item>
                    <el-descriptions-item label="用户手机号">{{ orderDetail.phone }}</el-descriptions-item>
                    <el-descriptions-item label="下单时间">{{ parseTime(orderDetail.createTime, '')
                    }}</el-descriptions-item>
                    <el-descriptions-item label="支付方式">{{ getPayType(orderDetail) }}</el-descriptions-item>
                    <el-descriptions-item label="支付时间">{{ parseTime(orderDetail.payTime, '')
                    }}</el-descriptions-item>
                    <el-descriptions-item label="订单状态">{{ getOrderStatus(orderDetail) }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card>
                <div slot="header" style="font-size: 16px;font-weight: bold;">售后信息</div>
                <el-table :data="refundInfoList">
                    <el-table-column label="售后单号" prop="id" width="150"></el-table-column>
                    <el-table-column label="售后类型" prop="applyRefundType" width="80">
                        <template slot-scope="{row}">
                            <span>{{ getAftersaleType(row) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请售后时间" prop="applyRefundTime" width="180">
                        <template slot-scope="{row}">
                            <span>
                                {{ parseTime(row.applyRefundTime, '') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款金额" prop="refundAmount">
                        <template v-slot="scope">
                            ￥<span>{{ scope.row.refundAmount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请原因" prop="reason"></el-table-column>
                    <el-table-column label="凭证" prop="proofPics">
                        <template slot-scope="{row}">
                            <el-image class="small-img circle-img" :src="row.proofPics"
                                :preview-src-list="[row.proofPics]" />
                        </template>
                    </el-table-column>
                    <el-table-column label="申请状态" prop="refundStatus" width="110">
                        <template slot-scope="{row}">
                            <span>{{ getAftersaleStatus(row) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台拒绝理由" prop="remark"></el-table-column>
                    <el-table-column label="退货快递号" prop="refundWaybillCode"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit"
                                @click="handleWatch(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card>
                <el-descriptions title="收货信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
                    <el-descriptions-item label="收货人姓名">{{ addressInfo.name }}</el-descriptions-item>
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
                  <el-table-column label="价格" prop="salePrice"></el-table-column>
                  <el-table-column label="购买数量" prop="buyNum"></el-table-column>
                </el-table>
            </el-card>
            <el-card>
              <el-descriptions title="物流信息" :column="3" border label-class-name="my-label" contentClassName="my-content">
                <el-descriptions-item label="发货时间">{{ parseTime(orderDetail.deliveryTime, '')
                  }}</el-descriptions-item>
                <el-descriptions-item label="快递单号">{{ orderDetail.expressNo }}</el-descriptions-item>
                <el-descriptions-item label="物流公司">{{ orderDetail.expressNo ? '顺丰速运' : '' }}</el-descriptions-item>
<!--                <el-descriptions-item label="物流公司">{{ orderDetail.expressName }}</el-descriptions-item>-->
              </el-descriptions>
            </el-card>
            <!-- 售后详细信息 -->
            <el-dialog title="售后详细信息" :visible.sync="open" width="1100px" append-to-body>
                <el-descriptions :column="2" border label-class-name="my-label" contentClassName="my-content">
                    <el-descriptions-item label="售后单号">{{ refundInfoDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="售后类型">{{ getAftersaleType(refundInfoDetail) }}</el-descriptions-item>
                    <el-descriptions-item label="申请售后时间">{{ parseTime(refundInfoDetail.applyRefundTime,'') }}</el-descriptions-item>
                    <el-descriptions-item label="退款金额">￥{{ refundInfoDetail.refundAmount }}</el-descriptions-item>
                    <el-descriptions-item label="申请原因">{{ refundInfoDetail.reason }}</el-descriptions-item>
                    <el-descriptions-item label="具体描述">{{ refundInfoDetail.description }}</el-descriptions-item>
                    <el-descriptions-item label="凭证">
                      <el-image class="small-img circle-img" :src="refundInfoDetail.proofPics"
                                :preview-src-list="[refundInfoDetail.proofPics]" />
                    </el-descriptions-item>
                    <el-descriptions-item label="申请状态">{{ getAftersaleStatus(refundInfoDetail) }}</el-descriptions-item>
                    <el-descriptions-item label="平台拒绝理由">{{ refundInfoDetail.remark }}</el-descriptions-item>
                    <el-descriptions-item label="退货快递号">{{ refundInfoDetail.refundWaybillCode }}</el-descriptions-item>
                    <el-descriptions-item label="物流公司">{{ getExpressName(refundInfoDetail.refundWpCode) }}</el-descriptions-item>
                    <el-descriptions-item label="物流进度">
                      <el-popover placement="left" width="300" trigger="hover" popper-class="popperOptions">
                        <el-timeline-item v-for="(activity, index) in aliLogisticsInfoList" :key="index"
                                          :timestamp="activity.time">
                          {{ activity.context }}
                        </el-timeline-item>
                        <span slot="reference">{{ refundInfoDetail.logistics }}</span>
                      </el-popover>
                    </el-descriptions-item>
                  </el-descriptions>
            </el-dialog>
        </el-main>
    </div>
</template>

<script>
import { getOmsAftersale } from "@/api/oms/aftersale";
import {getConfigKey2} from "@/api/system/config";

export default {
    name: "OmsAftersaleDetail",
    dicts: ['oms_order_status', 'oms_pay_type', "oms_aftersale_type", "oms_aftersale_status"],
    data() {
        return {
            products: [],
            orderDetail: {},
            addressInfo: {},
            // aliLogisticsInfoList: [],
            refundInfoList: [],
            loading: false,
            experssList: [],
            open: false,
            refundInfoDetail: {},
            aliLogisticsInfoList: []
        }
    },
    created() {
        this.getExpressData()
        const { id } = this.$route.query
        this.queryDetail(id).then((expressNo) => {
            // this.getLogistic(expressNo)
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
        aftersaleTypeMap() {
            let obj = this.dict.type.oms_aftersale_type.map(item => [item.value, item.label])
            let map = new Map(obj)
            return map;
        },
        aftersaleStatusMap() {
            let obj = this.dict.type.oms_aftersale_status.map(item => [item.value, item.label])
            let map = new Map(obj)
            return map;
        },
        expressMap() {
            let obj = this.experssList.map(item => [item.expressCode, item.expressName])
            return new Map(obj)
        }
    },
    methods: {
      getExpressData() {
        getConfigKey2('express-set-key').then(res => {
          if (res.data && res.data.configValue) {
            this.experssList = JSON.parse(res.data.configValue)
          } else {
            this.experssList = []
          }
        })
      },
        queryDetail(id) {
            this.loading = true
            return new Promise(resolve =>
                getOmsAftersale(id).then(res => {
                    const { productList, addressInfo, refundInfoList } = res;
                    this.orderDetail = res;
                    this.products = productList
                    this.refundInfoList = refundInfoList
                    this.addressInfo = addressInfo || {}
                    this.loading = false
                })
            )
        },
        getOrderStatus(row) {
            return this.orderStatusMap.get(row.status + '')
        },
        getPayType(row) {
            return this.payTypeMap.get(row.payType + '')
        },
        getAftersaleType(row) {
            return this.aftersaleTypeMap.get(row.applyRefundType + '')
        },
        getAftersaleStatus(row) {
            return this.aftersaleStatusMap.get(row.refundStatus + '')
        },
        getExpressName(name) {
            return this.expressMap.get(name)
        },
        handleWatch(row) {
            this.refundInfoDetail = row
            if(this.refundInfoDetail.allLogistics){
                this.aliLogisticsInfoList = JSON.parse(refundInfoDetail.allLogistics)
            }
            this.open = true
        },
        cancel() {
            this.open = false;
            this.refundInfoDetail = {};
        }
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
