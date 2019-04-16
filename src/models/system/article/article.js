import * as articleService from '../../../services/system/article/article';

export default {
  namespace: 'article',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(articleService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(articleService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(articleService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(articleService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * edit({payload, callback}, {call}) {
      const response = yield call(articleService.edit, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(articleService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * audit({payload, callback}, {call}) {
      const response = yield call(articleService.audit, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * tagTop({payload, callback}, {call}) {
      const response = yield call(articleService.tagTop, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * search({payload, callback}, {call}) {
      const response = yield call(articleService.search, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
  },
  reducers: {},
};
