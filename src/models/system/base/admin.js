import * as adminService from '../../../services/system/base/admin';

export default {
  namespace: 'admin',
  state: {},
  subscriptions: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(adminService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(adminService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(adminService.add, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * edit({payload, callback}, {call}) {
      const response = yield call(adminService.edit, payload);
      if (callback) {
        callback(response);
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(adminService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(adminService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    },
  },
  reducers: {},
};
