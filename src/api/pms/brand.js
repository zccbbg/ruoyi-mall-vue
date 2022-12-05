import request from '@/utils/request'

// 查询品牌管理列表
export function listPmsBrand(query, pageReq) {
  return request({
    url: '/pms/brand/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}
export function allBrand(query, pageReq) {
  return request({
    url: '/pms/brand/all',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询品牌管理详细
export function getPmsBrand(id) {
  return request({
    url: '/pms/brand/' + id,
    method: 'get'
  })
}

// 新增品牌管理
export function addPmsBrand(data) {
  return request({
    url: '/pms/brand',
    method: 'post',
    data: data
  })
}

// 修改品牌管理
export function updatePmsBrand(data) {
  return request({
    url: '/pms/brand',
    method: 'put',
    data: data
  })
}

// 删除品牌管理
export function delPmsBrand(id) {
  return request({
    url: '/pms/brand/' + id,
    method: 'delete'
  })
}

// 导出品牌管理
export function exportPmsBrand(query) {
  return request({
    url: '/pms/brand/export',
    method: 'get',
    params: query
  })
}
