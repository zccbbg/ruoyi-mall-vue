import request from '@/utils/request'

// 查询微信订单表列表
export function listOmsWechatPaymentHistory(query, pageReq) {
  return request({
    url: '/pms/omsWechatPaymentHistory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询微信订单表详细
export function getOmsWechatPaymentHistory(id) {
  return request({
    url: '/pms/omsWechatPaymentHistory/' + id,
    method: 'get'
  })
}

// 新增微信订单表
export function addOmsWechatPaymentHistory(data) {
  return request({
    url: '/pms/omsWechatPaymentHistory',
    method: 'post',
    data: data
  })
}

// 修改微信订单表
export function updateOmsWechatPaymentHistory(data) {
  return request({
    url: '/pms/omsWechatPaymentHistory',
    method: 'put',
    data: data
  })
}

// 删除微信订单表
export function delOmsWechatPaymentHistory(id) {
  return request({
    url: '/pms/omsWechatPaymentHistory/' + id,
    method: 'delete'
  })
}

// 导出微信订单表
export function exportOmsWechatPaymentHistory(query) {
  return request({
    url: '/pms/omsWechatPaymentHistory/export',
    method: 'get',
    params: query
  })
}
