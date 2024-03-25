import request from '@/utils/request'

// 查询优惠券活动表列表
export function listCouponActivity(query, pageReq) {
  return request({
    url: '/act/couponActivity/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询优惠券活动表详细
export function getCouponActivity(id) {
  return request({
    url: '/act/couponActivity/' + id,
    method: 'get'
  })
}

// 新增优惠券活动表
export function addCouponActivity(data) {
  return request({
    url: '/act/couponActivity',
    method: 'post',
    data: data
  })
}

// 修改优惠券活动表
export function updateCouponActivity(data) {
  return request({
    url: '/act/couponActivity',
    method: 'put',
    data: data
  })
}

// 删除优惠券活动表
export function delCouponActivity(id) {
  return request({
    url: '/act/couponActivity/' + id,
    method: 'delete'
  })
}

// 导出优惠券活动表
export function exportCouponActivity(query) {
  return request({
    url: '/act/couponActivity/export',
    method: 'get',
    params: query
  })
}
