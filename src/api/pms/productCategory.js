import request from '@/utils/request'

// 查询商品分类列表
export function listPmsProductCategory(query, pageReq) {
  return request({
    url: '/pms/productCategory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询商品分类详细
export function getPmsProductCategory(id) {
  return request({
    url: '/pms/productCategory/' + id,
    method: 'get'
  })
}

// 新增商品分类
export function addPmsProductCategory(data) {
  return request({
    url: '/pms/productCategory',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updatePmsProductCategory(data) {
  return request({
    url: '/pms/productCategory',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delPmsProductCategory(id) {
  return request({
    url: '/pms/productCategory/' + id,
    method: 'delete'
  })
}

// 导出商品分类
export function exportPmsProductCategory(query) {
  return request({
    url: '/pms/productCategory/export',
    method: 'get',
    params: query
  })
}
