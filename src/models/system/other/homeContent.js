import * as homeContentService from '../../../services/system/other/homeContent';

export default {
  namespace: 'homeContent',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(homeContentService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(homeContentService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(homeContentService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(homeContentService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(homeContentService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
