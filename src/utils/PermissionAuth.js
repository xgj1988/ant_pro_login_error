import React, {Fragment, PureComponent} from 'react';
import LoginUser from './LoginUser';

/**
 * 自定义参数
 * 1：permissions 权限标志， 可以是字符串（单个），可以数组（多个）
 * 2：没有权限的值
 */
export default class PermissionAuth extends PureComponent {
  render() {
    const {permissions = [], emptyValue = null} = this.props;
    const findPermission = LoginUser.hasPermissions(permissions);
    if (!findPermission && emptyValue === null) {
      return null;
    } else {
      return (
        <Fragment>
          {findPermission ? this.props.children : emptyValue}
        </Fragment>
      );
    }
  }
}
