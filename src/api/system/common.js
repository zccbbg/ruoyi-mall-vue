import request from '@/utils/request'

// 查询省市区列表
export function areaSelect(query) {
  return request({
    url: '/common/area',
    method: 'get',
    params: query
  })
}
