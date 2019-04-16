import * as productService from "../../../services/system/shop/product";

export default {
  namespace: "product",
  state: {},
  effects: {
    * fetch({ payload, callback }, { call }) {
      const response = yield call(productService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({ payload, callback }, { call }) {
      const response = yield call(productService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * create({ payload, callback }, { call }) {
      const response = yield call(productService.create, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(productService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(productService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * edit({ payload, callback }, { call }) {
      const response = yield call(productService.edit, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(productService.update, payload);
      if (callback) {
        callback(response.success);
      }
    }
  },
  reducers: {}
};
