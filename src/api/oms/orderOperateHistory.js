import request from '@/utils/request'

// 查询订单操作历史记录列表
export function listOmsOrderOperateHistory(query, pageReq) {
  return request({
    url: '/oms/orderOperateHistory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单操作历史记录详细
export function getOmsOrderOperateHistory(id) {
  return request({
    url: '/oms/orderOperateHistory/' + id,
    method: 'get'
  })
}

// 新增订单操作历史记录
export function addOmsOrderOperateHistory(data) {
  return request({
    url: '/oms/orderOperateHistory',
    method: 'post',
    data: data
  })
}

// 修改订单操作历史记录
export function updateOmsOrderOperateHistory(data) {
  return request({
    url: '/oms/orderOperateHistory',
    method: 'put',
    data: data
  })
}

// 删除订单操作历史记录
export function delOmsOrderOperateHistory(id) {
  return request({
    url: '/oms/orderOperateHistory/' + id,
    method: 'delete'
  })
}

// 导出订单操作历史记录
export function exportOmsOrderOperateHistory(query) {
  return request({
    url: '/oms/orderOperateHistory/export',
    method: 'get',
    params: query
  })
}
