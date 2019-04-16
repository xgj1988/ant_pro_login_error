import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/area/fetch', {
    method: 'POST',
    body: params,
    noJson: true
  });
}

export async function list(params) {
  return request('/system/area/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function add(param) {
  return request('/system/area/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function update(param) {
  return request('/system/area/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function remove(param) {
  return request('/system/area/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}
