import request from '@/utils/request'

// 查询订单售后列表
export function listOmsRefundItem(query, pageReq) {
  return request({
    url: '/oms/refundItem/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单售后详细
export function getOmsRefundItem(id) {
  return request({
    url: '/oms/refundItem/' + id,
    method: 'get'
  })
}

// 新增订单售后
export function addOmsRefundItem(data) {
  return request({
    url: '/oms/refundItem',
    method: 'post',
    data: data
  })
}

// 修改订单售后
export function updateOmsRefundItem(data) {
  return request({
    url: '/oms/refundItem',
    method: 'put',
    data: data
  })
}

// 删除订单售后
export function delOmsRefundItem(id) {
  return request({
    url: '/oms/refundItem/' + id,
    method: 'delete'
  })
}

// 导出订单售后
export function exportOmsRefundItem(query) {
  return request({
    url: '/oms/refundItem/export',
    method: 'get',
    params: query
  })
}
