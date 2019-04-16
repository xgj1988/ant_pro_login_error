import * as utils from './utils';
import defaultThemeSetting from '@/defaultSettings';

const LoginUser = {
  menus: null,
  permissions: null
};

/**
 * 登录
 * @param data
 */
LoginUser.login = (data) => {
  LoginUser.clearData();
  localStorage.menus = JSON.stringify(data.menus);
  const permissions = {};
  for (const permission of data.permissions) {
    permissions[permission.value] = permission;
  }
  localStorage.permissions = JSON.stringify(permissions);
  localStorage.loginUrl = data.loginUrl;
  localStorage.logoutUrl = data.logoutUrl;
  localStorage.welcomeUrl = data.welcomeUrl;
  localStorage.tableUpdateUrl = data.tableUpdateUrl;
  localStorage.tableFetchUrl = data.tableFetchUrl;
  localStorage.reloadPermissionUrl = data.reloadPermissionUrl;
  localStorage.userInfo = JSON.stringify(data.userInfo);
  localStorage.settingInfo = JSON.stringify(data.settingInfo);
  localStorage.tableInfo = JSON.stringify(LoginUser.transformTableInfo(data.tableInfo));
  localStorage.userSettingInfo = JSON.stringify(LoginUser.transformUserSettingInfo(data.userSettingInfo));
  localStorage.token = data.token;
  LoginUser.menus = data.menus;
  LoginUser.permissions = permissions;
  LoginUser.userInfo = data.userInfo;
  LoginUser.settingInfo = data.settingInfo;
  LoginUser.tableInfo = JSON.parse(localStorage.tableInfo);
  LoginUser.userSettingInfo = JSON.parse(localStorage.userSettingInfo);
};


/**
 * 重新加载权限
 * @param data
 */
LoginUser.reloadPermission = (data) => {
  localStorage.menus = JSON.stringify(data.menus);
  const permissions = {};
  for (const permission of data.permissions) {
    permissions[permission.value] = permission;
  }
  localStorage.permissions = JSON.stringify(permissions);
  LoginUser.menus = data.menus;
  LoginUser.permissions = permissions;
};


/**
 * 登出
 */
LoginUser.logout = () => {
  LoginUser.clearData();
};

/**
 * 获取token
 */
LoginUser.getToken = () => {
  return localStorage.token;
};

LoginUser.clearData = () => {
  localStorage.clear();
  LoginUser.menus = null;
  LoginUser.permissions = null;
  LoginUser.userInfo = null;
  LoginUser.userSettingInfo = null;
  utils.clearAllCookies();
};

/**
 * 是否有权限
 */
LoginUser.hasPermissions = (permissionValues) => {
  let permissionValuesTmp = [];
  if (typeof permissionValues === 'string') {
    permissionValuesTmp.push(permissionValues);
  } else {
    permissionValuesTmp = permissionValues;
  }
  let loginUserPermissions = LoginUser.permissions;
  if (utils.isNull(loginUserPermissions) || utils.isEmptyObject(loginUserPermissions)) {
    const localStoragePermissionsStr = localStorage.permissions;
    if (!utils.isNull(localStoragePermissionsStr)) {
      const localStoragePermissions = JSON.parse(localStoragePermissionsStr);
      LoginUser.permissions = localStoragePermissions;
      loginUserPermissions = localStoragePermissions;
    }
  }
  if (!utils.isNull(loginUserPermissions) && !utils.isEmptyObject(loginUserPermissions)) {
    for (const permissionValue of permissionValuesTmp) {
      if (!utils.isNull(loginUserPermissions[permissionValue])) {
        return true;
      }
    }
  }
  return false;
};

/**
 * 获取菜单
 */
LoginUser.getMenus = () => {
  const loginUserMenus = LoginUser.menus;
  if (utils.isNull(loginUserMenus) || loginUserMenus.length === 0) {
    const {menus} = localStorage;
    if (utils.isNull(menus) || menus.length === 0) {
      LoginUser.menus = [];
      return [];
    } else {
      const menuTmp = JSON.parse(localStorage.menus);
      LoginUser.menus = menuTmp;
      return menuTmp;
    }
  } else {
    return loginUserMenus;
  }
};


/**
 *  获取用户信息
 */
LoginUser.getUserInfo = () => {
  const loginUserInfo = LoginUser.userInfo;
  if (utils.isNull(loginUserInfo)) {
    const {userInfo} = localStorage;
    if (utils.isNull(userInfo)) {
      return {};
    } else {
      const uesrInfoTmp = JSON.parse(localStorage.userInfo);
      LoginUser.userInfo = uesrInfoTmp;
      return uesrInfoTmp;
    }
  } else {
    return loginUserInfo;
  }
};

/**
 *  获取设置信息
 */
LoginUser.getSettingInfo = () => {
  const loginSettingInfo = LoginUser.settingInfo;
  if (utils.isNull(loginSettingInfo)) {
    const {settingInfo} = localStorage;
    if (utils.isNull(settingInfo)) {
      return {};
    } else {
      const settingInfoTmp = JSON.parse(localStorage.settingInfo);
      LoginUser.settingInfo = settingInfoTmp;
      return settingInfoTmp;
    }
  } else {
    return loginSettingInfo;
  }
};

/**
 *  获取Table信息
 */
LoginUser.getTableInfo = (tableName) => {
  let loginTableInfo = LoginUser.tableInfo;
  if (utils.isNull(loginTableInfo)) {
    const {tableInfo} = localStorage;
    if (utils.isNull(tableInfo)) {
      loginTableInfo = {};
    } else {
      const tableInfoTmp = JSON.parse(tableInfo);
      LoginUser.tableInfo = tableInfoTmp;
      loginTableInfo = LoginUser.tableInfo;
    }
  }
  return loginTableInfo[tableName];
};


/**
 * 获取用哦过户设置
 * @param type
 * @returns {*}
 */
LoginUser.getUserSettingInfo = (type, isJson = false) => {
  let loginUserSettingInfo = LoginUser.userSettingInfo;
  if (utils.isNull(loginUserSettingInfo)) {
    const {userSettingInfo} = localStorage;
    if (utils.isNull(userSettingInfo)) {
      loginUserSettingInfo = {};
    } else {
      const userSettingInfoTmp = JSON.parse(userSettingInfo);
      LoginUser.userSettingInfo = userSettingInfoTmp;
      loginUserSettingInfo = LoginUser.userSettingInfo;
    }
  }
  const result = loginUserSettingInfo[type];
  if (type === 'theme' && utils.isNull(result)) {
    return defaultThemeSetting;
  }
  if (result && isJson) {
    return JSON.parse(result)
  } else {
    return result;
  }
};

/**
 *  添加Table信息
 */
LoginUser.addTableInfo = (tableName, columnDataSource) => {
  LoginUser.tableInfo[tableName] = columnDataSource;
  localStorage.tableInfo = JSON.stringify(LoginUser.tableInfo);
};

/**
 *  获得登出url
 */
LoginUser.getLogoutUrl = () => {
  return 'systemLogin/logout';
};


/**
 *  获得登录界面
 */
LoginUser.getLoginUrl = () => {
  return localStorage.loginUrl;
};

/**
 *  获得欢迎界面
 */
LoginUser.getWelcomeUrl = () => {
  return localStorage.welcomeUrl;
};
/**
 *  获得tabe更新url
 */
LoginUser.getTableUpdateUrl = () => {
  return localStorage.tableUpdateUrl;
};
/**
 *  获得重新加载权限地址
 */
LoginUser.getReloadPermissionUrl = () => {
  return localStorage.reloadPermissionUrl;
};


/* ------------- 私有方法 --------------- */

/**
 *  转换tableInfo
 */
LoginUser.transformTableInfo = (tableInfoTmp) => {
  const tableInfo = {};
  if (!utils.isEmptyArray(tableInfoTmp)) {
    for (const item of tableInfoTmp) {
      tableInfo[item.name] = JSON.parse(item.value);
    }
  }
  return tableInfo;
};


/**
 *  转换userSettingInfo
 */
LoginUser.transformUserSettingInfo = (userSettingInfoTmp) => {
  const userSettingInfo = {};
  if (!utils.isEmptyArray(userSettingInfoTmp)) {
    for (const item of userSettingInfoTmp) {
      userSettingInfo[item.type.value] = item.value;
    }
  }
  return userSettingInfo;
};




export default LoginUser;
