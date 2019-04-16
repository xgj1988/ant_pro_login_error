import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/product/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/product/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function create(param) {
  return request('/system/product/create', {
    method: 'POST',
    body: param,
    successTip: false,
    errorTip: true,
  });
}

export async function add(param) {
  return request('/system/product/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function edit(param) {
  return request('/system/product/edit', {
    method: 'POST',
    body: param,
    successTip: false,
    errorTip: true,
  });
}

export async function update(param) {
  return request('/system/product/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(param) {
  return request('/system/product/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true,
  });
}
