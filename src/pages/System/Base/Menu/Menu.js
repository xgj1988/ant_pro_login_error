import React, { PureComponent } from 'react';
import { BackTop, Button, Card, Divider } from 'antd';
import { connect } from 'dva';
import * as utils from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MenuModal from './MenuModal';
import Menuable from './MenuTable';
import MenuSearch from './MenuSearch';
import PermissionAuth from '@/utils/PermissionAuth';

@connect(({loading}) => ({
  loading: loading.models.menu,
}))
export default class Menu extends PureComponent {
  selectCondition = {};

  state = {
    modalVisible: false,
    modalTitle: '创建菜单',
    currentItem: {},
    list: [],
  };

  componentDidMount() {
    this.fetchDataInit({});
  }

  handleModalVisible = (modalVisible, modalTitle, currentItem) => {
    this.setState({modalVisible, modalTitle, currentItem});
  };


  handleFormSubmit = (addFlag, params, callbackModal) => {
    const callback = (success) => {
      if (success) {
        this.fetchDataList(this.selectCondition);
      }
      if (callbackModal) {
        callbackModal(success);
      }
    };
    if (addFlag) {
      this.props.dispatch({
        type: 'menu/add',
        payload: params,
        callback,
      });
    } else {
      this.props.dispatch({
        type: 'menu/update',
        payload: params,
        callback,
      });
    }
  };

  handleDeleteClick = (id) => {
    this.props.dispatch({
      type: 'menu/remove',
      payload: {
        ids: id,
      },
      callback: (success) => {
        if (success) {
          this.fetchDataList(this.selectCondition);
        }
      },
    });
  };

  handleFormSearch = (values) => {
    this.selectCondition = {
      ...this.selectCondition,
      ...values,
    };
    this.fetchDataList(this.selectCondition);
  };

  handleFormReset = () => {
    this.selectCondition = {};
    this.fetchDataList(this.selectCondition);
  };

  fetchDataInit = (payload) => {
    this.props.dispatch({
      type: 'menu/fetch',
      payload,
      callback: (data) => {
        const list = utils.reduceTree(data.list);
        this.setState({
          list,
        });
      },
    });
  }

  fetchDataList = (payload) => {
    this.props.dispatch({
      type: 'menu/list',
      payload,
      callback: (data) => {
        const list = utils.reduceTree(data.list);
        this.setState({
          list,
        });
      },
    });
  };

  render() {
    const {loading} = this.props;
    const {list, modalVisible, modalTitle, currentItem} = this.state;
    const content = (
      <div>
        <p>
          Admin菜单管理界面，可以增，删，改，查和授权角色。
        </p>
        <div style={{marginTop: '16px'}}>
          <PermissionAuth permissions="system:menu:add">
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, '新增菜单')}>
              新增
            </Button>
            <Divider type="vertical" />
          </PermissionAuth>
          <PermissionAuth permissions="system:menu:view">
            <Button icon="sync" type="dashed" onClick={() => this.fetchDataInit({})}>
              刷新
            </Button>
          </PermissionAuth>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper
        content={content}
      >
        <Card bordered={false}>
          <MenuSearch
            handleFormSearch={this.handleFormSearch}
            handleFormReset={this.handleFormReset}
          />
          <div style={{marginTop: '16px'}}>
            <Menuable
              handleDeleteClick={this.handleDeleteClick}
              dataSource={list}
              loading={loading}
              handleModalVisible={this.handleModalVisible}
            />
          </div>
        </Card>
        <MenuModal
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          treeData={list}
          handleFormSubmit={this.handleFormSubmit}
          handleModalVisible={this.handleModalVisible}
        />
        <BackTop />
      </PageHeaderWrapper>
    );
  }
}
