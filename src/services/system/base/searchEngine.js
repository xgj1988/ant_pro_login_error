import request from '@/utils/request';

export async function fetch() {
  return request('/system/search_engine_mapping/edit', {
    method: 'POST',
    successTip: false,
    errorTip: true
  });
}

export async function update(object) {
  return request('/system/search_engine_mapping/update', {
    method: 'POST',
    body: object.params,
    successTip: true,
    errorTip: true
  });
}

export async function rebuild(object) {
  return request('/system/search_engine_mapping/rebuild', {
    method: 'POST',
    body: object.params,
    successTip: true,
    errorTip: true
  });
}
