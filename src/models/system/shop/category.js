import * as categoryService from '../../../services/system/shop/category';

export default {
  namespace: 'category',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(categoryService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(categoryService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(categoryService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(categoryService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(categoryService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
