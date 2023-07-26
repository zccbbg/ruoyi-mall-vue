import request from '@/utils/request'

// 查询会员登录记录列表
export function listUmsMemberLogininfor(query, pageReq) {
  return request({
    url: '/ums/memberLogininfor/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询会员登录记录详细
export function getUmsMemberLogininfor(id) {
  return request({
    url: '/ums/memberLogininfor/' + id,
    method: 'get'
  })
}

// 新增会员登录记录
export function addUmsMemberLogininfor(data) {
  return request({
    url: '/ums/memberLogininfor',
    method: 'post',
    data: data
  })
}

// 修改会员登录记录
export function updateUmsMemberLogininfor(data) {
  return request({
    url: '/ums/memberLogininfor',
    method: 'put',
    data: data
  })
}

// 删除会员登录记录
export function delUmsMemberLogininfor(id) {
  return request({
    url: '/ums/memberLogininfor/' + id,
    method: 'delete'
  })
}

// 导出会员登录记录
export function exportUmsMemberLogininfor(query) {
  return request({
    url: '/ums/memberLogininfor/export',
    method: 'get',
    params: query
  })
}
