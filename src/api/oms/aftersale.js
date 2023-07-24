import request from '@/utils/request'

// 查询订单售后列表
export function listOmsAftersale(query, pageReq) {
  return request({
    url: '/oms/aftersale/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单售后详细
export function getOmsAftersale(id) {
  return request({
    url: '/oms/aftersale/' + id,
    method: 'get'
  })
}

// 新增订单售后
export function addOmsAftersale(data) {
  return request({
    url: '/oms/aftersale',
    method: 'post',
    data: data
  })
}

// 修改订单售后
export function updateOmsAftersale(data) {
  return request({
    url: '/oms/aftersale',
    method: 'put',
    data: data
  })
}

// 删除订单售后
export function delOmsAftersale(id) {
  return request({
    url: '/oms/aftersale/' + id,
    method: 'delete'
  })
}

// 导出订单售后
export function exportOmsAftersale(query) {
  return request({
    url: '/oms/aftersale/export',
    method: 'get',
    params: query
  })
}

// 售后订单操作
export function dealWithAftersale(data){
  return request({
    url: '/oms/aftersale/dealWith',
    method: 'post',
    data: data
  })
}

export function viewLog(orderId){
  return request({
    url: `/oms/aftersale/log/` + orderId,
    method: 'get'
  })
}
