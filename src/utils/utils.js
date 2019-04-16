/* eslint-disable react/no-array-index-key,no-param-reassign */
import React from "react";
import moment from "moment";
import { TreeSelect } from "antd";
import lodash from "lodash";
import pinyin from "pinyin";
import Constant from "./Constant";
import utilStyles from "./utils.less";

const { TreeNode } = TreeSelect;


/**
 * 验证手机号码
 * @returns boolean
 */
export function isMobilePhone(value) {
  const mobilePhoneReg = /((\+)?86|((\+)?86)?)0?1\d{10}/g;
  return mobilePhoneReg.test(value);
}

/**
 * 验证编码
 * @returns boolean
 */
export function isCode(value) {
  const codeReg = /[\w\-_]+/g;
  return codeReg.test(value);
}


/**
 * 验证身份证号码
 * @returns boolean
 */
export function isIdentityCard(value) {
  if (isNull(value)) {
    return false;
  }
  const identityCardRegex = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
  return identityCardRegex.test(value);
}


/**
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 * */
export function numberFormat(number, decimals, decPoint, thousandsSep, roundtag) {
  number = (`${number}`).replace(/[^\d\.]/g, "");
  number = (`${number}`).replace(/[^0-9+-Ee.]/g, "");
  // "ceil","floor","round"
  roundtag = roundtag || "round";
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = (isNull(thousandsSep)) ? "," : thousandsSep;
  const dec = (isNull(decPoint)) ? "." : decPoint;
  let s = "";
  const toFixedFix = function(nParam, precParam) {
    const k = 10 ** precParam;
    return `${parseFloat(Math[roundtag](parseFloat((nParam * k).toFixed(precParam * 2))).toFixed(precParam * 2)) / k}`;
  };
  s = (prec ? toFixedFix(n, prec) : `${Math.round(n)}`).split(".");
  if (thousandsSep !== "" && !isNull(sep)) {
    const re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, `$1${sep}$2`);
    }
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

/**
 * 字符长度，中文算两个
 * @param str
 * @returns {number}
 */
export function strLenChinese2Len(str) {
  let len = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // 单字节加1
    // eslint-disable-next-line yoda
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      // eslint-disable-next-line no-plusplus
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}


/**
 * 判断元素是否在数组里
 * @param e
 * @param array
 * @author mei_xianjie
 */
export function inArray(e, array) {
  if (!array || array.length < 1) {
    return false;
  }
  for (let i = 0; i < array.length; i += 1) {
    if (typeof e === "object") {
      return deepCompare(e, array[i]);
    } else if (e === array[i]) {
      return true;
    }
  }
  return false;
}


/**
 * 深度比较
 * @param a(object)
 * @param b(object)
 * @author mei_xianjie
 */
export function deepCompare(a, b) {
  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }
  // 如果是数组，现比较长度
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }
  }
  let result = true;
  // eslint-disable-next-line
  for (const key in a) {
    if (typeof a[key] === "object") {
      result = result && deepCompare(a[key], b[key]);
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  return result;
}

/**
 *
 * @param arr1
 * @param arr2
 * @returns {boolean}
 * @deprecated
 */
// export function deepCompareArray(arr1, arr2) {
//   if (!arr1 || !arr2) {
//     return false;
//   }
//   // 第一步最简单的长度
//   if (arr1.length !== arr2.length) {
//     return false;
//   }
//   for (let i = 0, l = arr1.length; i < l; i += 1) {
//     // 检查是否嵌套
//     if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
//       // 继续去递归调用
//       if (!deepCompareArray(arr1[i], arr2[i])) {
//         return false;
//       }
//     } else if (arr1[i] !== arr2[i]) {
//       deepCompare();
//       // {obj:1} != {obj:1}对象不等于对象,大家可以在控制台尝试一下哈
//       return false;
//     }
//   }
//   return true;
// }

/**
 * uuid
 * @returns {string}
 */
export function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = "-";
  s[13] = "-";
  s[18] = "-";
  s[23] = "-";
  return s.join("");
}

/**
 * 是否url
 */

export function isUrl(value) {
  /* eslint no-useless-escape:0 */
  if (isNull(value)) {
    return false;
  }
  const urlReg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
  return urlReg.test(value);
}

// 获取元素的横坐标（相对于窗口）
export function getLeft(e) {
  let offset = e.offsetLeft;
  if (e.offsetParent != null) offset += getLeft(e.offsetParent);
  return offset;
}


/**
 * 是否序列号
 */

export function isSerialNo(value) {
  if (isNull(value)) {
    return false;
  }
  const serialNoReg = /\w+/g;
  return serialNoReg.test(value);
}

/**
 * 把json对象根据xxx.yyy.zzz来获取值
 * @param jsonObj
 * @param fields
 * @returns {*}
 */
export function getJsonValue(jsonObj, fields) {
  const arr = fields.split(".");
  const key = arr.shift();
  const value = jsonObj[key];

  if (value == null) {
    return value;
  } else if (arr.length === 0) {
    return value;
  }
  return getJsonValue(value, arr.join("."));
}


/**
 * 生成高亮span，如果没有匹配就直接用原来的值
 * @param searchValue
 * @param filterValues
 * @returns {*}
 */
export function hightLightSpan(searchValue, defaultValue, ...filterValues) {
  if (searchValue && filterValues && filterValues.length > 0) {
    const newInputValue = transformPinyin(searchValue);
    for (const filterValue of filterValues) {
      if (filterValue && filterValue.length > 0) {
        const index = filterValue.indexOf(newInputValue);
        if (index > -1) {
          const beforeStr = defaultValue.substr(0, index);
          const newValue = defaultValue.substr(index, newInputValue.length);
          const afterStr = defaultValue.substr(index + newInputValue.length);
          const titleSpan = (
            <span >
              {beforeStr}
              <span className={utilStyles.hightLight} >
                {newValue}
              </span >
              {afterStr}
            </span >
          );
          return titleSpan;
        }
      }
    }
  }
  return defaultValue;
}

/**
 * 转换拼音
 * @param inputValue
 */
export function transformPinyin(inputValue) {
  const pinyinArray = pinyin(inputValue, { style: pinyin.STYLE_INITIALS, heteronym: false, segment: false });
  let newInputValue = "";
  for (const pinyinItem of pinyinArray) {
    newInputValue += pinyinItem[0];
  }
  return newInputValue;
}

/**
 * 根据nodeId查找树里面的节点
 * @param tree
 * @param nodeId
 * @returns {*}
 */
export function findTreeNodeById(tree = [], nodeId) {
  for (const node of tree) {
    if (node.id === nodeId) {
      return node;
    } else {
      const { children } = node;
      if (!isNull(children)) {
        const result = findTreeNodeById(children, nodeId);
        if (result != null) {
          return result;
        }
      }
    }
  }
  return null;
}

/**
 * tree格式生成list格式
 * @param treeData
 * @param dataList
 */
export function treeGenerateList(treeData, dataList) {
  for (const node of treeData) {
    dataList.push({ id: node.id, name: node.name, acronym: node.acronym });
    if (node.children) {
      treeGenerateList(node.children, dataList);
    }
  }
}

/**
 *
 *  生成TreeNode方法
 */
export function renderTreeNodes(list, TreeNodeTag, titleName, extraPropsFn, titleFn) {
  if (isEmptyArray(list)) {
    return null;
  }
  return list.map((item) => {
    let title = item.name;
    if (!isNull(titleName)) {
      title = item[titleName];
    }
    let TreeNodeTmp = TreeNodeTag;
    if (isNull(TreeNodeTmp)) {
      TreeNodeTmp = TreeNode;
    }
    let extraProps = {};
    if (!isNull(extraPropsFn)) {
      extraProps = extraPropsFn(item);
    }
    if (!isNull(titleFn)) {
      title = titleFn(item);
    }
    if (!isNull(item.children) && item.children.length > 0) {
      return (
        <TreeNodeTmp
          title={title}
          key={item.id}
          value={item.id}
          isLeaf={false}
          {...extraProps}
        >
          {renderTreeNodes(item.children, TreeNodeTag, titleName, extraPropsFn, titleFn)}
        </TreeNodeTmp >
      );
    } else {
      return (
        <TreeNodeTmp
          title={title}
          key={item.id}
          value={item.id}
          isLeaf
          {...extraProps}
        />
      );
    }
  });
}

/**
 * 精简树，删除无效的children
 */
export function reduceTree(items) {
  for (const item of items) {
    if (isNull(item.children) || item.children.length === 0) {
      delete item.children;
    } else {
      reduceTree(item.children);
    }
  }
  return items;
}

/**
 时间戳转成标准时间, timeType 为true时 就转为年月日 如：2018-1-1   否则就转为年月日时分秒 如 2018-1-1 00:00:00
 */
export function formatDateTime(inputTime, timeType) {
  let result = "";
  const date = new Date(inputTime);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  let h = date.getHours();
  h = h < 10 ? (`0${h}`) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? (`0${minute}`) : minute;
  second = second < 10 ? (`0${second}`) : second;
  if (inputTime != null) {
    if (timeType) {
      result = `${y}-${m}-${d} `;
    } else {
      result = `${y}-${m}-${d} ${h}:${minute}:${second} `;
    }
  }
  return result;
}

/**
 *是否是{}对象
 */
export function wrapperPagination(obj) {
  if (isNull(obj)) {
    return {};
  } else {
    return {
      current: obj.current, // 当前页
      pageSize: obj.size, // 每页显示多少
      size: obj.pages, // 总页数
      total: obj.total // 总数据
    };
  }
}

/**
 *json拷贝给form
 */
export function copyJsonToForm(obj, form, ...ignoreFields) {
  const modifyObj = {};
  const judgeIgnore = (ignoreFields.length > 0);
  for (const field in obj) {
    if (isNull(form.getFieldValue(field))) {
      let isIgnore = false;
      if (judgeIgnore) {
        for (const ignoreField of ignoreFields) {
          if (field === ignoreField) {
            isIgnore = true;
            break;
          }
        }
      }
      if (!isIgnore) {
        modifyObj[field] = obj[field];
      }
    }
  }
  if (!isEmptyObject(modifyObj)) {
    form.setFieldsValue(modifyObj);
  }
  return form;
}

/**
 * json copy
 */
export function copyJson(sourceObj, targetObj, ...ignoreFields) {
  const judgeIgnore = (ignoreFields.length > 0);
  const result = { ...sourceObj, ...targetObj };
  if (judgeIgnore) {
    // eslint-disable-next-line guard-for-in
    for (const ignoreField in ignoreFields) {
      delete result[ignoreField];
    }
  }
  return result;
}

/**
 * 深度拷贝规格
 * @param specItems
 * @returns {Array}
 */
export function deepCopySpecItems(specItems) {
  let newSpecItems = [];
  if (!isEmptyArray(specItems)) {
    newSpecItems = lodash.cloneDeep(specItems);
    newSpecItems = newSpecItems.map((item) => {
      // eslint-disable-next-line
      item.entries = lodash.cloneDeep(item.entries);
      return item;
    });
  }
  return newSpecItems;
};

/**
 * 笛卡尔积
 * @param array
 * @returns {*}
 */
export function calcDescartes(array) {
  if (array.length < 2) {
    return array[0] || [];
  }
  return [].reduce.call(array, (col, set) => {
    const res = [];
    col.forEach((c) => {
      set.forEach((s) => {
        const t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      });
    });
    return res;
  });
};


/**
 * json copy  忽略  ['createdDate', 'createdBy', 'lastModifiedDate', 'lastModifiedBy']
 */
export function copyJsonIgnoreCommonFields(sourceObj, targetObj, ...ignoreFields) {
  return copyJson(sourceObj, targetObj, "createdDate", "createdBy", "lastModifiedDate", "lastModifiedBy", "logicDelete", ...ignoreFields);
}

/**
 *是否是adminUrl
 */
export function isAdminUrl() {
  return location.pathname.startsWith("/system");
}


/**
 *是否是[]数组对象
 */
export function isEmptyArray(arr) {
  if (isNull(arr)) {
    return true;
  } else if (arr instanceof Array) {
    return arr.length === 0;
  } else {
    return true;
  }
}


/**
 * 删除对象属性
 * @param keyPart
 * @param obj
 */
export function deleteFromObject(keyPart, obj) {
  if (isNull(obj)) {
    return;
  }
  for (const k in obj) {
    if (~k.indexOf(keyPart)) {
      delete obj[k];
    }
  }
}

/**
 *是否是{}对象
 */
export function isEmptyObject(obj) {
  if (obj) {
    // eslint-disable-next-line guard-for-in
    for (const n in obj) {
      return false;
    }
  }
  return true;
}

/**
 * 交换数组元素位置
 * @param array
 * @param first
 * @param second
 * @returns {*}
 */
export function swap(array, first, second) {
  const tmp = array[second];
  array[second] = array[first];
  array[first] = tmp;
  return array;
}

/**
 * 返回消息
 */
export function getMsg(key) {
  return Constant.message[key];
}

/**
 * 是否为空
 * @param responseJson
 * @returns {*}
 */
export function isNull(value) {
  return value === null || value === undefined;
}

/**
 * 是否为空字符串
 * @param responseJson
 * @returns {*}
 */
export function isEmptyStr(value) {
  if (isNull(value)) {
    return true;
  }
  const result = value.replace(/(^\s*)|(\s*$)/g, "");
  return result.length === 0;
}

/**
 * 如果value是空，那么就返回第二个参数
 * @param responseJson
 * @returns {*}
 */
export function getValueIfNull(value, defaultVal) {
  return isNull(value) ? defaultVal : value;
}

/**
 * 如果value是空，那么就返回空对象
 * @param responseJson
 * @returns {*}
 */
export function getEmptyObjIfNull(value) {
  return getValueIfNull(value, {});
}

/**
 * 如果value是空，那么就返回空数组
 * @param responseJson
 * @returns {*}
 */
export function getEmptyArrayIfNull(value) {
  return getValueIfNull(value, []);
}


/**
 * 邮件后缀自动添加
 * @param value
 * @returns {*}
 */
export function emailSuffixDeal(value) {
  return !value || value.indexOf("@") >= 0 ? [] : [
    `${value}@qq.com`,
    `${value}@163.com`,
    `${value}@sina.com`,
    `${value}@gmail.com`
  ];
}

/**
 * 预览
 * @param content
 */
export function previewHtml(title = "", content) {
  if (window.previewWindow) {
    window.previewWindow.close();
  }
  const templete = `
      <!Doctype html>
      <html>
        <head>
          <title>内容预览</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
            <div class="container">
              <h1>${title}</h1> 
              <br>
               ${content}
             </div>
        </body>
      </html>
    `;
  window.previewWindow = window.open();
  window.previewWindow.document.write(templete);
}

export function getStyle(elem, name) {
  // 如果该属性存在于style[]中，则它最近被设置过(且就是当前的)
  if (elem.style[name]) {
    return elem.style[name];
  } else if (elem.currentStyle) {
    // 否则，尝试IE的方式
    return elem.currentStyle[name];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    // 或者W3C的方法，如果存在的话
    // 它使用传统的"text-Align"风格的规则书写方式，而不是"textAlign"
    name = name.replace(/([A-Z])/g, "-$1");
    name = name.toLowerCase();
    // 获取style对象并取得属性的值(如果存在的话)
    const s = document.defaultView.getComputedStyle(elem, "");
    return s && s.getPropertyValue(name);
    // 否则，就是在使用其它的浏览器
  } else {
    return null;
  }
}


/**
 * key为cookie的名称， val为cookie的值， time为过期时间（单位为秒）
 * @param key
 * @param val
 * @param time
 * @returns {boolean}
 */
function setCookie(key, val, time) {
  if (typeof key !== "string" || typeof val !== "string") {
    return false;
  }
  time = time || 7 * 24 * 3600;
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 1000);
  document.cookie = `${key}=${val};expires=${exp.toGMTString()}`;
}


/**
 * 获得所有cookies
 */
export function getAllCookies() {
  const cookies = document.cookie.split(/;\s/g);
  const cookieObj = {};
  cookies.forEach((item) => {
    const key = item.split("=")[0];
// eslint-disable-next-line
    cookieObj[key] = item.split("=")[1];
  });
  return cookieObj;
}

/**
 * 清除单个cookie
 * @param key
 */
function clearCookieByKey(key) {
  setCookie(key, "", -1);
}

/**
 * 清空所有cookie
 */
export function clearAllCookies() {
  const keys = Object.keys(getAllCookies());
  keys.forEach((item) => {
    clearCookieByKey(item);
  });
}


/**
 * admin是否绑定了用户
 */
export function isBindMember(successCallback) {
  window.g_app._store.dispatch({
    type: "admin/isBindMember",
    callback: (success) => {
      if (success) {
        successCallback();
      }
    }
  });
}

// /////////////////////////////////////////下面是antd自带的////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === "month") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, "months");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === "year") {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = "") {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  let num = Math.abs(n);
  let s = "";
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, "");
  });
  s = s || "整";
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = "";
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, "元").replace(/(零.)+/g, "零").replace(/^整$/, "零元整");
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn("Two path are equal!");  // eslint-disable-line
  }
  const arr1 = str1.split("/");
  const arr2 = str2.split("/");
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ""));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact
    };
  });
  return renderRoutes;
}
