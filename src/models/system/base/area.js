import * as areaService from '../../../services/system/base/area';

export default {
  namespace: 'area',
  state: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(areaService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * list({payload, callback}, {call}) {
      const response = yield call(areaService.list, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * add({payload, callback}, {call}) {
      const response = yield call(areaService.add, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(areaService.remove, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(areaService.update, payload);
      if (callback) {
        callback(response.success);
      }
    },
  },
  reducers: {},
};
