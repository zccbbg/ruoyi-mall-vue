import request from '@/utils/request'

// 查询系统数据统计列表
export function listAwsSystemStatistics(query, pageReq) {
  return request({
    url: '/aws/systemStatistics/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询系统数据统计详细
export function getAwsSystemStatistics(id) {
  return request({
    url: '/aws/systemStatistics/' + id,
    method: 'get'
  })
}

// 新增系统数据统计
export function addAwsSystemStatistics(data) {
  return request({
    url: '/aws/systemStatistics',
    method: 'post',
    data: data
  })
}

// 修改系统数据统计
export function updateAwsSystemStatistics(data) {
  return request({
    url: '/aws/systemStatistics',
    method: 'put',
    data: data
  })
}

// 删除系统数据统计
export function delAwsSystemStatistics(id) {
  return request({
    url: '/aws/systemStatistics/' + id,
    method: 'delete'
  })
}

// 导出系统数据统计
export function exportAwsSystemStatistics(query) {
  return request({
    url: '/aws/systemStatistics/export',
    method: 'get',
    params: query
  })
}
