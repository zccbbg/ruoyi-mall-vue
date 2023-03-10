import request from '@/utils/request'

// 查询会员信息列表
export function listUmsMember(query, pageReq) {
  return request({
    url: '/ums/member/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询会员信息详细
export function getUmsMember(id) {
  return request({
    url: '/ums/member/' + id,
    method: 'get'
  })
}

// 新增会员信息
export function addUmsMember(data) {
  return request({
    url: '/ums/member',
    method: 'post',
    data: data
  })
}

// 修改会员信息
export function updateUmsMember(data) {
  return request({
    url: '/ums/member',
    method: 'put',
    data: data
  })
}

// 删除会员信息
export function delUmsMember(id) {
  return request({
    url: '/ums/member/' + id,
    method: 'delete'
  })
}

// 导出会员信息
export function exportUmsMember(query) {
  return request({
    url: '/ums/member/export',
    method: 'get',
    params: query
  })
}
