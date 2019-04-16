import request from '@/utils/request';

export async function fetch() {
  return request('/system/setting/edit', {
    method: 'POST',
    errorTip: true
  });
}

export async function update(params) {
  return request('/system/setting/update', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true
  });
}

export async function smsBlance() {
  return request('/system/setting/sms_balance', {
    successTip: true,
    errorTip: true
  });
}

export async function sendTestMail(params) {
  return request('/system/setting/test_smtp', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true
  });
}

export async function resetSettingCache() {
  return request('/system/setting/reset_seting_cache', {
    method: 'POST',
    successTip: true,
    errorTip: true
  });
}

export async function resetTemplateConfigCache() {
  return request('/system/setting/reset_template_config_cache', {
    method: 'POST',
    successTip: true,
    errorTip: true
  });
}
export async function resetAllCache() {
  return request('/system/setting/reset_all_cache', {
    method: 'POST',
    successTip: true,
    errorTip: true
  });
}

export async function setLogLevel(params) {
  return request('/system/setting/set_log_level', {
    method: 'POST',
    body: params,
    successTip: true,
    errorTip: true
  });
}
