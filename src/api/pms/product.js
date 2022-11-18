import request from '@/utils/request'

// 查询商品信息列表
export function listPmsProduct(query, pageReq) {
  return request({
    url: '/pms/product/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询商品信息详细
export function getPmsProduct(id) {
  return request({
    url: '/pms/product/' + id,
    method: 'get'
  })
}

// 新增商品信息
export function addPmsProduct(data) {
  return request({
    url: '/pms/product',
    method: 'post',
    data: data
  })
}

// 修改商品信息
export function updatePmsProduct(data) {
  return request({
    url: '/pms/product',
    method: 'put',
    data: data
  })
}

// 删除商品信息
export function delPmsProduct(id) {
  return request({
    url: '/pms/product/' + id,
    method: 'delete'
  })
}

// 导出商品信息
export function exportPmsProduct(query) {
  return request({
    url: '/pms/product/export',
    method: 'get',
    params: query
  })
}
