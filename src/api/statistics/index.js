import request from '@/utils/request'

// 获取首页查询热卖商品TOP
export function goodsStatistics(query) {
  return request({
    url: '/dev/statistics/index/goodsStatistics',
    method: 'get',
    params: query
  })
}
export function memberAndCartStatistics() {
  return request({
    url: '/dev/statistics/index/memberAndCart/statistics',
    method: 'get'
  })
}

export function orderAndAftersaleStatistics() {
  return request({
    url: '/dev/statistics/index/order/aftersale/statistics',
    method: 'get'
  })
}

// 获取订单信息
export function orderStatistics(query) {
  return request({
    url: '/dev/statistics/index/orderStatistics',
    method: 'get',
    params: query
  })
}
