/* eslint-disable no-unused-vars */
import { isUrl } from '@/utils/utils';
import LoginUser from '@/utils/LoginUser';

const pathMenuMap = [];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getPathMenuMapData = () => pathMenuMap;

export const getMenuData = () => formatter(LoginUser.getMenus());
