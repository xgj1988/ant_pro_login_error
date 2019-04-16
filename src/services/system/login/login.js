import request from '@/utils/request';


export async function isLogin(params) {
  return request('/system/admin/islogin', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: false,
  });
}

export async function login(params) {
  return request('/system/admin/login', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}


export async function logout(params) {
  return request('/system/admin/logout', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function reloadPermission(params) {
  return request('/system/admin/reload_permission', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

export async function geetestLogin(params) {
  return request('/system/admin/login/geetest', {
    method: 'POST',
    body: params,
    successTip: false,
    errorTip: true,
  });
}

