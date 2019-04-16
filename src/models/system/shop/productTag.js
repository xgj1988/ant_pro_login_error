import * as productTagService from '../../../services/system/shop/productTag';

export default {
  namespace: 'productTag',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(productTagService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(productTagService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(productTagService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(productTagService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(productTagService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
