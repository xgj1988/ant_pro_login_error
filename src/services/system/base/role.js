import request from '@/utils/request';


export async function fetch(params) {
  return request('/system/role/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/role/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(params) {
  return request('/system/role/add', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}


export async function update(params) {
  return request('/system/role/update', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(params) {
  return request('/system/role/delete', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function beforeEmpower(params) {
  return request('/system/role/before_empower', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function empower(params) {
  return request('/system/role/empower', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}
