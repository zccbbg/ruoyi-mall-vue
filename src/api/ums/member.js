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
export function updateUmsMemberMark(data) {
  return request({
    url: '/ums/member/mark/update',
    method: 'post',
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

// 更改会员账号状态
export function changeAccountStatus(data) {
  return request({
    url: '/ums/member/status/change',
    method: 'post',
    data: data
  })
}

// 获取解密手机号
export function decryptedPhone(data) {
  return request({
    url: `/ums/member/phone/decrypt/` + data,
    method: 'get'
  })
}

// 查询会员统计数据
export function viewStatistics(memberId){
  return request({
    url: `/ums/member/view/statistics/` + memberId,
    method: 'get'
  })
}

export function getMiniWechatImg(params){
  return request({
    url: `/ums/member/wechat/code`,
    method: 'get',
    params
  })
}

export function judgeQrCode(params){
  return request({
    url: `/no-auth/verified/code`,
    method: 'get',
    params
  })
}


