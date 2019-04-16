import * as menuService from '../../../services/system/base/menu';

export default {
  namespace: 'menu',
  state: {},
  subscriptions: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(menuService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(menuService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(menuService.add, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(menuService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(menuService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response.success);
        }
      }
    },
  },
  reducers: {},
};
