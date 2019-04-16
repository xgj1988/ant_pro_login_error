import request from "@/utils/request";


export async function fetch(params) {
  return request("/system/permission/fetch", {
    method: "POST",
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function list(params) {
  return request("/system/permission/list", {
    method: "POST",
    body: params,
    successTip: false,
    errorTip: true
  });
}

export async function add(params) {
  return request("/system/permission/add", {
    method: "POST",
    body: params,
    successTip: true,
    errorTip: true
  });
}


export async function update(params) {
  return request("/system/permission/update", {
    method: "POST",
    body: params,
    successTip: true,
    errorTip: true
  });
}

export async function remove(params) {
  return request("/system/permission/delete", {
    method: "POST",
    body: params,
    successTip: true,
    errorTip: true
  });
}

export async function copy(params) {
  return request("/system/permission/copy", {
    method: "POST",
    body: params,
    successTip: true,
    errorTip: true
  });
}
