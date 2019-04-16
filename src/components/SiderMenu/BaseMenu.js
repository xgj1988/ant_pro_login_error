import React, { PureComponent } from 'react';
import { Icon, Menu } from 'antd';
import lodash from 'lodash';
import Link from 'umi/link';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';
import * as utils from '@/utils/utils';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon, className) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  if (typeof className === 'string') {
    const classNameTmp = `${className} ${styles.iconExtraClass} extraSpan`;
    return <i className={classNameTmp} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, pathMenuMapItem) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, pathMenuMapItem);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

// Get the currently selected menu
  getSelectedMenuKeys = () => {
    const { location: { pathname }, pathMenuMap } = this.props;
    const urlResult = urlToList(pathname).map(itemPath =>
      getMenuMatches(this.flatMenuKeys, itemPath).pop(),
    );
    let pathMenuMapItem = null;
    if (urlResult.length >= 3 && utils.isNull(urlResult[2])) {
      pathMenuMapItem = lodash.find(pathMenuMap, { path: pathname });
      if (pathMenuMapItem) {
        urlResult[2] = pathMenuMapItem.mapMenuPath;
      }
    }
    return { urlResult, pathMenuMapItem };
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item, pathMenuMapItem) => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      return (
        <SubMenu
          title={
            (item.icon || item.className) ? (
              <span>
                {getIcon(item.icon, item.className)}
                <span>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children, pathMenuMapItem)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item, pathMenuMapItem)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item, pathMenuMapItem) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon, item.className);
    const { target, name } = item;
    let ConnerMark = null;
    if (pathMenuMapItem && pathMenuMapItem.cornerMark && pathMenuMapItem.cornerMark !== null && item.path === pathMenuMapItem.mapMenuPath) {
      ConnerMark = <sup style={{ paddingLeft: 10 }}>{pathMenuMapItem.cornerMark}</sup>;
    }
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
              onCollapse(true);
            }
            : undefined
        }
      >
        {icon}
        <span>{name}{ConnerMark}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const { openKeys, theme, mode } = this.props;
    // if pathname can't match, use the nearest parent's key
    // eslint-disable-next-line
    let { urlResult: selectedKeys, pathMenuMapItem } = this.getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData, pathMenuMapItem)}
      </Menu>
    );
  }
}
