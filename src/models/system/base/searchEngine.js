import * as searchEngineService from '../../../services/system/base/searchEngine';

export default {
  namespace: 'searchEngine',

  state: {},

  subscriptions: {},

  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(searchEngineService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * update({payload, callback}, {call}) {
      const response = yield call(searchEngineService.update, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    * rebuild({payload}, {call}) {
      yield call(searchEngineService.rebuild, payload);
    },
  },
  reducers: {},
};
