import request from '@/utils/request'

export function appList(query) {
  return request({
    url: '/renter/renter_list',
    method: 'get',
    params: query
  })
}

export function appDetail(query) {
  return request({
    url: '/renter/renter_detail',
    method: 'get',
    params: query
  })
}

export function appStat(query) {
  return request({
    url: '/renter/renter_stat',
    method: 'get',
    params: query
  })
}

export function appDelete(query) {
  return request({
    url: '/renter/delete_renter',
    method: 'get',
    params: query
  })
}

export function appAdd(data) {
  return request({
    url: '/renter/add_renter',
    method: 'post',
    data
  })
}

export function appUpdate(data) {
  return request({
    url: '/renter/update_renter',
    method: 'post',
    data
  })
}
