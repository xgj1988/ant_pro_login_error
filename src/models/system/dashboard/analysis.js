import * as analysisService from '../../../services/system/dashboard/analysis';

export default {
  namespace: 'analysis',
  state: {},
  subscriptions: {},
  effects: {
    * fetch({payload, callback}, {call}) {
      const response = yield call(analysisService.fetch, payload);
      if (callback) {
        callback(response);
      }
    },
    * trend({payload, callback}, {call}) {
      const response = yield call(analysisService.trend, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};
