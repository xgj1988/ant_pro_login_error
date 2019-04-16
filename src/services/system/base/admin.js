import request from '@/utils/request';

export async function fetch(params) {
  return request('/system/admin/fetch', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function list(params) {
  return request('/system/admin/list', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function add(params) {
  return request('/system/admin/add', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function edit(params) {
  return request('/system/admin/edit', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function update(params) {
  return request('/system/admin/update', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function remove(params) {
  return request('/system/admin/delete', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true,
  });
}

export async function tableUpdate(params) {
  return request('/system/admin/table_update', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function settingUpdate(params) {
  return request('/system/admin/setting/update', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}
