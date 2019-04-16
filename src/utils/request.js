import fetch from 'dva/fetch';
import { message, notification } from 'antd';
import router from 'umi/router';
import queryString from 'query-string';
import * as utils from './utils';
import LoginUser from './LoginUser';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '请求失败：用户没有权限，请联系管理员。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    const reloadPermission = response.headers.get('reloadPermission');
    const reloadPermissionUrl = LoginUser.getReloadPermissionUrl();
    if (!utils.isNull(reloadPermission) && reloadPermission) {
      notification.info({
        message: '权限重新获取',
        description: '管理员修改了权限或者菜单，请刷新页面！',
        placement: 'bottomRight',
        duration: 3,
        onClose: () => {
          // eslint-disable-next-line
          window.g_app._store.dispatch({
            type: reloadPermissionUrl,
            callback: (data) => {
              LoginUser.reloadPermission(data);
            }
          });
        }
      });
    }
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;
  const uri = `/${response.url.replace(/http:\/\/.*?\//g, '')}`;
  notification.error({
    message: `请求错误 ${response.status}: ${uri}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include'
  };
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    fetchFlag: 'true',
    ...newOptions.headers,
    token: LoginUser.getToken()
  };
  let newUrl = url;
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newUrl = `/api${url}`;
      const form = [];
      addItemsToForm(form, [], options.body);
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers
      };
      newOptions.body = form.join('&');
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers
      };
    }
  } else if (newOptions.method === 'GET') {
    if (
      !utils.isNull(newOptions.body)
      && !utils.isEmptyObject(newOptions.body)
    ) {
      if (newUrl.indexOf('?') > 0) {
        newUrl += `&${queryString.stringify(newOptions.body)}`;
      } else {
        newUrl += `?${queryString.stringify(newOptions.body)}`;
      }
    }
  }

  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then((responseBody) => {
      return responseParse(responseBody, options.successTip, options.errorTip);
    })
    .catch((e) => {
      const { response } = e;
      const status = response.name;
      if (status === 401) {
        router.push(LoginUser.getLoginUrl());
      } else if (status === 403) {
        router.push('/403');
      } else if (status <= 504 && status >= 500) {
        router.push('/500');
      } else if (status >= 404 && status < 422) {
        router.push('/404');
      }
      return response.json();
    });
}

// add by xgj ===========================================================================
function addItemsToForm(form, names, obj) {
  if (obj === undefined || obj === '' || obj === null) {
    return;
  }

  if (
    typeof obj === 'string'
    || typeof obj === 'number'
    || obj === true
    || obj === false
  ) {
    return addItemToForm(form, names, obj);
  }

  if (obj instanceof Date) {
    return addItemToForm(form, names, obj.toJSON());
  }

  // array or otherwise array-like
  if (obj instanceof Array) {
    return obj.forEach((v, i) => {
      names.push(`[${i}]`);
      addItemsToForm(form, names, v);
      names.pop();
    });
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).forEach((k) => {
      if (k === 'zyzcOrderMap') {
        return;
      }
      const newK = k.replace(/_\$search[^\\.]*/gi, '');
      names.push(newK);
      addItemsToForm(form, names, obj[k]);
      names.pop();
    });
  }
}

function addItemToForm(form, names, value) {
  const name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
  const newValue = encodeURIComponent(value.toString());
  form.push(`${name}=${newValue}`);
}

/**
 * 解析reponse json
 * @param responseJson
 * @returns {*}
 */
function responseParse(responseJson, successTip, errorTip) {
  if (responseJson.success && (!utils.isNull(successTip) && successTip === true)) {
    const msgs = parseMsg(responseJson.msg);
    if (msgs.length === 1) {
      message.success(msgs[0]);
    } else {
      message.success(
        // eslint-disable-next-line react/react-in-jsx-scope,react/no-array-index-key
        <ol >
          {msgs.map((msg, index) => (
            // eslint-disable-next-line react/react-in-jsx-scope,react/no-array-index-key
            <li key={index} >{msg}</li >
          ))}
        </ol >
      );
    }
  } else if (!responseJson.success) {
    if (!utils.isNull(errorTip) && errorTip === true) {
      const msgs = parseMsg(responseJson.msg);
      if (msgs.length === 1) {
        message.error(msgs[0]);
      } else {
        message.error(
          // eslint-disable-next-line react/react-in-jsx-scope,react/no-array-index-key
          <ol >
            {msgs.map((msg, index) => (
              // eslint-disable-next-line react/react-in-jsx-scope,react/no-array-index-key
              <li key={index} >{msg}</li >
            ))}
          </ol >
        );
      }
    }
    if (responseJson.code === -3) {
      router.push('/system/login/index');
    }
  }
  let { data } = responseJson;
  if (utils.isEmptyObject(data)) {
    data = {};
  }
  data.success = responseJson.success;
  return data;
}

function parseMsg(msg) {
  const separator = '|zyzc|';
  const msgs = [];
  if (utils.isNull(msg)) {
    msgs.push('后端没有传提示信息');
  } else if (msg.indexOf(separator) >= 0) {
    for (const obj of msg.split(separator)) {
      msgs.push(obj);
    }
  } else {
    msgs.push(msg);
  }
  return msgs;
}
