import request from '@/utils/request'

// 查询订单中所包含的商品列表
export function listOmsOrderItem(query, pageReq) {
  return request({
    url: '/oms/orderItem/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单中所包含的商品详细
export function getOmsOrderItem(id) {
  return request({
    url: '/oms/orderItem/' + id,
    method: 'get'
  })
}

// 新增订单中所包含的商品
export function addOmsOrderItem(data) {
  return request({
    url: '/oms/orderItem',
    method: 'post',
    data: data
  })
}

// 修改订单中所包含的商品
export function updateOmsOrderItem(data) {
  return request({
    url: '/oms/orderItem',
    method: 'put',
    data: data
  })
}

// 删除订单中所包含的商品
export function delOmsOrderItem(id) {
  return request({
    url: '/oms/orderItem/' + id,
    method: 'delete'
  })
}

// 导出订单中所包含的商品
export function exportOmsOrderItem(query) {
  return request({
    url: '/oms/orderItem/export',
    method: 'get',
    params: query
  })
}
