import request from '@/utils/request'

// 查询订单售后列表
export function listOmsRefund(query, pageReq) {
  return request({
    url: '/oms/refund/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单售后详细
export function getOmsRefund(id) {
  return request({
    url: '/oms/refund/' + id,
    method: 'get'
  })
}

// 新增订单售后
export function addOmsRefund(data) {
  return request({
    url: '/oms/refund',
    method: 'post',
    data: data
  })
}

// 修改订单售后
export function updateOmsRefund(data) {
  return request({
    url: '/oms/refund',
    method: 'put',
    data: data
  })
}

// 删除订单售后
export function delOmsRefund(id) {
  return request({
    url: '/oms/refund/' + id,
    method: 'delete'
  })
}

// 导出订单售后
export function exportOmsRefund(query) {
  return request({
    url: '/oms/refund/export',
    method: 'get',
    params: query
  })
}
