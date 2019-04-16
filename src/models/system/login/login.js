import * as loginService from '../../../services/system/login/login';

export default {
  namespace: 'systemLogin',
  state: {},
  subscriptions: {},
  effects: {
    * isLogin({ payload, callback }, { call }) {
      const response = yield call(loginService.isLogin, payload);
      if (callback) {
        callback(response.success);
      }
    },
    * login({ payload, callback }, { call }) {
      const response = yield call(loginService.login, payload);
      if (callback) {
        callback(response);
      }
    },
    * logout({ payload, callback }, { call }) {
      const response = yield call(loginService.logout, payload);
      if (response.success) {
        callback(response.success);
      }
    },
    * reloadPermission({ payload, callback }, { call }) {
      const response = yield call(loginService.reloadPermission, payload);
      if (response.success && callback) {
        callback(response);
      }
    },
    * geetestLogin({ payload, callback }, { call }) {
      const response = yield call(loginService.geetestLogin, payload);
      if (response.success && callback) {
        callback(response);
      }
    },
  },

  reducers: {}
};
