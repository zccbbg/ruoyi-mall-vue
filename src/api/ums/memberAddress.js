import request from '@/utils/request'

// 查询会员收货地址列表
export function listUmsMemberAddress(query, pageReq) {
  return request({
    url: '/ums/memberAddress/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询会员收货地址详细
export function getUmsMemberAddress(id) {
  return request({
    url: '/ums/memberAddress/' + id,
    method: 'get'
  })
}

// 新增会员收货地址
export function addUmsMemberAddress(data) {
  return request({
    url: '/ums/memberAddress',
    method: 'post',
    data: data
  })
}

// 修改会员收货地址
export function updateUmsMemberAddress(data) {
  return request({
    url: '/ums/memberAddress',
    method: 'put',
    data: data
  })
}

// 删除会员收货地址
export function delUmsMemberAddress(id) {
  return request({
    url: '/ums/memberAddress/' + id,
    method: 'delete'
  })
}

// 导出会员收货地址
export function exportUmsMemberAddress(query) {
  return request({
    url: '/ums/memberAddress/export',
    method: 'get',
    params: query
  })
}
