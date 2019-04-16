import request from '@/utils/request';


export async function fetch(params) {
  return request('/system/menu/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/menu/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(params) {
  return request('/system/menu/add', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}


export async function update(params) {
  return request('/system/menu/update', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(params) {
  return request('/system/menu/delete', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}
