import request from '@/utils/request'

// 查询用户领券记录列表
export function listMemberCoupon(query, pageReq) {
  return request({
    url: '/act/memberCoupon/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询用户领券记录详细
export function getMemberCoupon(id) {
  return request({
    url: '/act/memberCoupon/' + id,
    method: 'get'
  })
}

// 新增用户领券记录
export function addMemberCoupon(data) {
  return request({
    url: '/act/memberCoupon',
    method: 'post',
    data: data
  })
}

// 修改用户领券记录
export function updateMemberCoupon(data) {
  return request({
    url: '/act/memberCoupon',
    method: 'put',
    data: data
  })
}

// 删除用户领券记录
export function delMemberCoupon(id) {
  return request({
    url: '/act/memberCoupon/' + id,
    method: 'delete'
  })
}

// 导出用户领券记录
export function exportMemberCoupon(query) {
  return request({
    url: '/act/memberCoupon/export',
    method: 'get',
    params: query
  })
}
