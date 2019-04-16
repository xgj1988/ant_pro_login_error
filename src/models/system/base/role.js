import * as roleService from '../../../services/system/base/role';

export default {
  namespace: 'role',
  state: {},
  subscriptions: {},
  effects: {
    * fetch({ payload, callback }, { call }) {
      const response = yield call(roleService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({ payload, callback }, { call }) {
      const response = yield call(roleService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(roleService.add, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(roleService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(roleService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    },
    * beforeEmpower({ payload, callback }, { call }) {
      const response = yield call(roleService.beforeEmpower, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * empower({ payload, callback }, { call }) {
      const response = yield call(roleService.empower, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    },
  },
  reducers: {},
};
