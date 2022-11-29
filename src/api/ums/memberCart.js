import request from '@/utils/request'

// 查询购物车列表
export function listUmsMemberCart(query, pageReq) {
  return request({
    url: '/ums/memberCart/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询购物车详细
export function getUmsMemberCart(id) {
  return request({
    url: '/ums/memberCart/' + id,
    method: 'get'
  })
}

// 新增购物车
export function addUmsMemberCart(data) {
  return request({
    url: '/ums/memberCart',
    method: 'post',
    data: data
  })
}

// 修改购物车
export function updateUmsMemberCart(data) {
  return request({
    url: '/ums/memberCart',
    method: 'put',
    data: data
  })
}

// 删除购物车
export function delUmsMemberCart(id) {
  return request({
    url: '/ums/memberCart/' + id,
    method: 'delete'
  })
}

// 导出购物车
export function exportUmsMemberCart(query) {
  return request({
    url: '/ums/memberCart/export',
    method: 'get',
    params: query
  })
}
