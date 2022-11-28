import request from '@/utils/request'

// 查询用户微信信息列表
export function listUmsMemberWechat(query, pageReq) {
  return request({
    url: '/ums/memberWechat/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询用户微信信息详细
export function getUmsMemberWechat(id) {
  return request({
    url: '/ums/memberWechat/' + id,
    method: 'get'
  })
}

// 新增用户微信信息
export function addUmsMemberWechat(data) {
  return request({
    url: '/ums/memberWechat',
    method: 'post',
    data: data
  })
}

// 修改用户微信信息
export function updateUmsMemberWechat(data) {
  return request({
    url: '/ums/memberWechat',
    method: 'put',
    data: data
  })
}

// 删除用户微信信息
export function delUmsMemberWechat(id) {
  return request({
    url: '/ums/memberWechat/' + id,
    method: 'delete'
  })
}

// 导出用户微信信息
export function exportUmsMemberWechat(query) {
  return request({
    url: '/ums/memberWechat/export',
    method: 'get',
    params: query
  })
}
