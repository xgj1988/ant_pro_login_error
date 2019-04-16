import request from '@/utils/request';


export async function fetch() {
  return request('/system/dashboard/analysis', {
    method: 'POST',
    successTip: false,
    errorTip: true,
  });
}

export async function trend(param) {
  return request('/system/dashboard/analysis/trend', {
    method: 'POST',
    body: param,
    successTip: false,
    errorTip: true,
  });
}
