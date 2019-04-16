import React, { PureComponent } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import Constant from '@/utils/Constant';
import PermissionAuth from '@/utils/PermissionAuth';

const FormItem = Form.Item;
export default class TabCacheContent extends PureComponent {
  constructor(props) {
    super(props);
    this.handleResetSettingOK = props.handleResetSettingOK;
    this.handleResetAllCacheOK = props.handleResetAllCacheOK;
  }

  render() {
    const {
      resetSettingCacheLoading,
      handleResetAllCacheLoading
    } = this.props;
    return (
      <div>
        <PermissionAuth permissions="system:setting:reset_seting_cache">
          <FormItem {...Constant.formItemLayout} label="重置Setting缓存">
            <Popconfirm
              title="你确定要重新设置Setting缓存吗？"
              onConfirm={this.handleResetSettingOK}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" loading={resetSettingCacheLoading}>
                重置
              </Button>
            </Popconfirm>
          </FormItem>
        </PermissionAuth>
        <PermissionAuth permissions="system:setting:reset_all_cache">
          <FormItem {...Constant.formItemLayout} label="重置所有缓存">
            <Popconfirm
              title="你确定要重新设置所有缓存吗？"
              onConfirm={this.handleResetAllCacheOK}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" loading={handleResetAllCacheLoading}>
                重置
              </Button>
            </Popconfirm>
          </FormItem>
        </PermissionAuth>
      </div>
    );
  }
}
