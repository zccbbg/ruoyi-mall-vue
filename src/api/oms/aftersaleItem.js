import request from '@/utils/request'

// 查询订单售后列表
export function listOmsAftersaleItem(query, pageReq) {
  return request({
    url: '/oms/aftersaleItem/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单售后详细
export function getOmsAftersaleItem(id) {
  return request({
    url: '/oms/aftersaleItem/' + id,
    method: 'get'
  })
}

// 新增订单售后
export function addOmsAftersaleItem(data) {
  return request({
    url: '/oms/aftersaleItem',
    method: 'post',
    data: data
  })
}

// 修改订单售后
export function updateOmsAftersaleItem(data) {
  return request({
    url: '/oms/aftersaleItem',
    method: 'put',
    data: data
  })
}

// 删除订单售后
export function delOmsAftersaleItem(id) {
  return request({
    url: '/oms/aftersaleItem/' + id,
    method: 'delete'
  })
}

// 导出订单售后
export function exportOmsAftersaleItem(query) {
  return request({
    url: '/oms/aftersaleItem/export',
    method: 'get',
    params: query
  })
}
