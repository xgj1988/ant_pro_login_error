import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/value_added/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/value_added/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(param) {
  return request('/system/value_added/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function update(param) {
  return request('/system/value_added/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(param) {
  return request('/system/value_added/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}
