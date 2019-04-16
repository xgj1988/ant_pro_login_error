import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/brand/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/brand/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(param) {
  return request('/system/brand/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function update(param) {
  return request('/system/brand/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(param) {
  return request('/system/brand/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}
