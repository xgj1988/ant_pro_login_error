import * as brandService from '../../../services/system/shop/brand';

export default {
  namespace: 'brand',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(brandService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(brandService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(brandService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(brandService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(brandService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
