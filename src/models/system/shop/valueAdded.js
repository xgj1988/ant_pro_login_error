import * as valueAddedService from "../../../services/system/shop/valueAdded";

export default {
  namespace: "valueAdded",
  state: {},
  effects: {
    * fetch({ payload, callback }, { call }) {
      const response = yield call(valueAddedService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({ payload, callback }, { call }) {
      const response = yield call(valueAddedService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(valueAddedService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(valueAddedService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(valueAddedService.update, payload);
      if (callback) {
        callback(response.success);
      }
    }
  },
  reducers: {}
};
