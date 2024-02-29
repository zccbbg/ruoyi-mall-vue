import request from "@/utils/request";

export function updateMark(data) {
  return request({
    url: '/ums/feedback/mark/update',
    method: 'post',
    data: data
  })
}

export function changeHandleStatus(data) {
  return request({
    url: '/ums/feedback/handle/status/change',
    method: 'post',
    data: data
  })
}

export function listFeedbacks(query, pageReq) {
  return request({
    url: '/ums/feedback/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}
