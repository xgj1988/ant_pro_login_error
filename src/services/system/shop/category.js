import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/category/fetch', {
    method: 'POST',
    body: params,
    noJson: true
  });
}

export async function list(params) {
  return request('/system/category/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function add(param) {
  return request('/system/category/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function update(param) {
  return request('/system/category/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function remove(param) {
  return request('/system/category/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}
