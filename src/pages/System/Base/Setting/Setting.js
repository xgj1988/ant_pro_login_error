import React, { PureComponent } from 'react';
import { Button, Card, Form, message, Tabs } from 'antd';
import { connect } from 'dva';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TabCacheContent from './TabCacheContent';
import LoginUser from '@/utils/LoginUser';
import PermissionAuth from '@/utils/PermissionAuth';

const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitLoading: loading.effects['systemSetting/update'],
  resetSettingCacheLoading: loading.effects['systemSetting/resetSettingCache'],
  handleResetAllCacheLoading: loading.effects['systemSetting/resetAllCache']
}))
@Form.create()
export default class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSetting: {}
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'systemSetting/fetch',
      callback: data => {
        this.setState({
          currentSetting: data.setting
        });
      }
    });
  }

  handleFormSubmit = e => {
    e.preventDefault();
    utils.copyJsonToForm(this.state.currentSetting, this.props.form);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        this.props.dispatch({
          type: 'systemSetting/update',
          payload: newValues,
          callback: data => {
            this.setState({
              currentSetting: data.setting
            });
          }
        });
      } else {
        // eslint-disable-next-line guard-for-in
        for (const field in err) {
          const { errors } = err[field];
          if (errors) {
            for (const error of errors) {
              message.error(error.message);
            }
          }
        }
      }
    });
  };


  handleResetSettingOK = () => {
    this.props.dispatch({
      type: 'systemSetting/resetSettingCache',
      callback: data => {
        this.setState({
          currentSetting: data.setting
        });
      }
    });
  };

  handleResetAllCacheOK = () => {
    this.props.dispatch({
      type: 'systemSetting/resetAllCache',
      callback: data => {
        this.setState({
          currentSetting: data.setting
        });
      }
    });
  };


  handleSetLogLevel = logLevel => {
    this.props.dispatch({
      type: 'systemSetting/setLogLevel',
      payload: {
        logLevel
      }
    });
  };

  render() {
    const {
      submitLoading,
      resetSettingCacheLoading,
      handleResetAllCacheLoading
    } = this.props;
    return (
      <PageHeaderWrapper >
        <Card bordered={false} >
          <Form onSubmit={this.handleFormSubmit} >
            <Tabs >
              {LoginUser.hasPermissions([
                'system:setting:reset_seting_cache',
                'system:setting:reset_template_config_cache'
              ]) ? (
                <TabPane tab="缓存设置" key="cache" >
                  <TabCacheContent
                    handleResetSettingOK={this.handleResetSettingOK}
                    handleResetAllCacheOK={this.handleResetAllCacheOK}
                    resetSettingCacheLoading={resetSettingCacheLoading}
                    handleResetAllCacheLoading={handleResetAllCacheLoading}
                  />
                </TabPane >
              ) : null}
            </Tabs >
            <PermissionAuth permissions="system:setting:update" >
              <FormItem {...Constant.submitFormLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  保存
                </Button >
              </FormItem >
            </PermissionAuth >
          </Form >
        </Card >
      </PageHeaderWrapper >
    );
  }
}
