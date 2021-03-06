import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/product_tag/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/product_tag/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(param) {
  return request('/system/product_tag/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function update(param) {
  return request('/system/product_tag/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(param) {
  return request('/system/product_tag/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}
