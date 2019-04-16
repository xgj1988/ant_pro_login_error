import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/article/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function list(params) {
  return request('/system/article/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function add(param) {
  return request('/system/article/add', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function edit(param) {
  return request('/system/article/edit', {
    method: 'POST',
    body: param,
    successTip: false,
    errorTip: true
  });
}

export async function update(param) {
  return request('/system/article/update', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function remove(param) {
  return request('/system/article/delete', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function audit(param) {
  return request('/system/article/audit', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}

export async function tagTop(param) {
  return request('/system/article/tag_top', {
    method: 'POST',
    body: param,
    successTip: true,
    errorTip: true
  });
}


export async function search(param) {
  return request('/system/article/search', {
    method: 'POST',
    body: param,
    successTip: false,
    errorTip: true
  });
}
