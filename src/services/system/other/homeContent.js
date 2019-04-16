import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/home_content/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/home_content/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(param) {
  return request('/system/home_content/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function update(param) {
  return request('/system/home_content/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(param) {
  return request('/system/home_content/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}
