import * as systemSettingService from '../../../services/system/base/systemSetting';

export default {
  namespace: 'systemSetting',

  state: {},

  subscriptions: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(systemSettingService.fetch, payload);
      if (response.success) {
        if (callback) {
          callback(response);
        }
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(systemSettingService.update, payload);
      if (response.success && callback) {
        callback(response);
      }
    },
    *smsBalance({ payload }, { call }) {
      yield call(systemSettingService.smsBlance, payload);
    },
    *sendTestMail({ payload }, { call }) {
      yield call(systemSettingService.sendTestMail, payload);
    },
    *resetSettingCache({ payload, callback }, { call }) {
      const response = yield call(
        systemSettingService.resetSettingCache,
        payload
      );
      if (response.success && callback) {
        callback(response);
      }
    },
    *resetTemplateConfigCache({ payload }, { call }) {
      yield call(systemSettingService.resetTemplateConfigCache, payload);
    },

    *resetAllCache({ payload, callback }, { call }) {
      const response = yield call(systemSettingService.resetAllCache, payload);
      if (response.success && callback) {
        callback(response);
      }
    },
    *setLogLevel({ payload }, { call }) {
      yield call(systemSettingService.setLogLevel, payload);
    }
  },
  reducers: {
    saveSetting(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};
