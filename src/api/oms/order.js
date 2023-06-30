import request from '@/utils/request'

// 查询订单表列表
export function listOmsOrder(query, pageReq) {
  return request({
    url: '/oms/order/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单表详细
export function getOmsOrder(id) {
  return request({
    url: '/oms/order/' + id,
    method: 'get'
  })
}

// 新增订单表
export function addOmsOrder(data) {
  return request({
    url: '/oms/order',
    method: 'post',
    data: data
  })
}

// 修改订单表
export function updateOmsOrder(data) {
  return request({
    url: '/oms/order',
    method: 'put',
    data: data
  })
}

// 删除订单表
export function delOmsOrder(id) {
  return request({
    url: '/oms/order/' + id,
    method: 'delete'
  })
}

// 导出订单表
export function exportOmsOrder(query) {
  return request({
    url: '/oms/order/export',
    method: 'get',
    params: query
  })
}

// 保存商家备注
export function saveMerchantNote(data){
  return request({
    url: '/oms/order/merchantNote/add',
    method: 'post',
    data: data
  })
}
