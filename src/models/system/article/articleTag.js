import * as articleTagService from '../../../services/system/article/articleTag';

export default {
  namespace: 'articleTag',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(articleTagService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(articleTagService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(articleTagService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(articleTagService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(articleTagService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
