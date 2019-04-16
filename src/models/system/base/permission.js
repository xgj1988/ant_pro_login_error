import * as permissionService from "../../../services/system/base/permission";

export default {
  namespace: "permission",
  state: {},
  subscriptions: {},
  effects: {
    * fetch({ payload, callback }, { call }) {
      const response = yield call(permissionService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({ payload, callback }, { call }) {
      const response = yield call(permissionService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(permissionService.add, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(permissionService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(permissionService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    },
    * copy({ payload, callback }, { call }) {
      const response = yield call(permissionService.copy, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    }
  },
  reducers: {}
};
