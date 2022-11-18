import request from '@/utils/request'

// 查询sku信息列表
export function listPmsSku(query, pageReq) {
  return request({
    url: '/pms/sku/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询sku信息详细
export function getPmsSku(id) {
  return request({
    url: '/pms/sku/' + id,
    method: 'get'
  })
}

// 新增sku信息
export function addPmsSku(data) {
  return request({
    url: '/pms/sku',
    method: 'post',
    data: data
  })
}

// 修改sku信息
export function updatePmsSku(data) {
  return request({
    url: '/pms/sku',
    method: 'put',
    data: data
  })
}

// 删除sku信息
export function delPmsSku(id) {
  return request({
    url: '/pms/sku/' + id,
    method: 'delete'
  })
}

// 导出sku信息
export function exportPmsSku(query) {
  return request({
    url: '/pms/sku/export',
    method: 'get',
    params: query
  })
}
