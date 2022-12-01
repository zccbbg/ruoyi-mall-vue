import request from '@/utils/request'

// 查询订单发货记录列表
export function listOmsOrderDeliveryHistory(query, pageReq) {
  return request({
    url: '/oms/orderDeliveryHistory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单发货记录详细
export function getOmsOrderDeliveryHistory(id) {
  return request({
    url: '/oms/orderDeliveryHistory/' + id,
    method: 'get'
  })
}

// 新增订单发货记录
export function addOmsOrderDeliveryHistory(data) {
  return request({
    url: '/oms/orderDeliveryHistory',
    method: 'post',
    data: data
  })
}

// 修改订单发货记录
export function updateOmsOrderDeliveryHistory(data) {
  return request({
    url: '/oms/orderDeliveryHistory',
    method: 'put',
    data: data
  })
}

// 删除订单发货记录
export function delOmsOrderDeliveryHistory(id) {
  return request({
    url: '/oms/orderDeliveryHistory/' + id,
    method: 'delete'
  })
}

// 导出订单发货记录
export function exportOmsOrderDeliveryHistory(query) {
  return request({
    url: '/oms/orderDeliveryHistory/export',
    method: 'get',
    params: query
  })
}
