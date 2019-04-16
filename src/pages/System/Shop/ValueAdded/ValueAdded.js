import React, { PureComponent } from 'react';
import { Button, Card, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Constant from '@/utils/Constant';
import ValueAddedModal from './ValueAddedModal';
import ValueAddedTable from './ValueAddedTable';
import ValueAddedSearch from './ValueAddedSearch';
import PermissionAuth from '@/utils/PermissionAuth';
import * as utils from '@/utils/utils';

@connect(({ loading }) => ({
  loading: loading.models.valueAdded
}))
export default class ValueAdded extends PureComponent {
  selectCondition = {
    ...Constant.defaultPagination
  };

  state = {
    list: [],
    currentItem: {},
    modalTitle: '商品增殖服务',
    modalVisible: false,
    pagination: {}
  };

  /**
   * 页面挂载钩子函数
   */
  componentDidMount() {
    this.fetchDataInit({});
  }

  /**
   * 模态框处理
   * @param modalVisible
   * @param modalTitle
   * @param currentItem
   */
  handleModalVisible = (modalVisible, modalTitle, currentItem) => {
    this.setState({ modalVisible, modalTitle, currentItem });
  };

  /**
   * 获取所有地区
   * @param payload
   */
  fetchDataList = payload => {
    this.props.dispatch({
      type: 'valueAdded/list',
      payload,
      callback: data => {
        const list = data.page.records;
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list,
          pagination
        });
      }
    });
  };

  /**
   * 初始化数据
   * @param payload
   */
  fetchDataInit = payload => {
    this.props.dispatch({
      type: 'valueAdded/fetch',
      payload,
      callback: data => {
        const list = data.page.records;
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list,
          pagination
        });
      }
    });
  };

  /**
   * 删除数据
   * @param id
   */
  handleDeleteClick = id => {
    this.props.dispatch({
      type: 'valueAdded/remove',
      payload: {
        ids: id
      },
      callback: success => {
        if (success) {
          this.fetchDataList(this.selectCondition);
        }
      }
    });
  };

  handleFormSearch = values => {
    this.selectCondition = {
      ...this.selectCondition,
      ...Constant.defaultPagination,
      ...values
    };
    this.fetchDataList(this.selectCondition);
  };

  handleFormReset = () => {
    this.selectCondition = {};
    this.fetchDataList(this.selectCondition);
  };

  /**
   * 表单提交
   * @param addFlag
   * @param params
   * @param callbackModal
   */
  handleFormSubmit = (addFlag, params, callbackModal) => {
    const callback = success => {
      if (success) {
        this.fetchDataList(this.selectCondition);
      }
      if (callbackModal) {
        callbackModal(success);
      }
    };
    if (addFlag) {
      this.props.dispatch({
        type: 'valueAdded/add',
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: 'valueAdded/update',
        payload: params,
        callback
      });
    }
  };

  render() {
    const { loading } = this.props;
    const {
      list,
      currentItem,
      modalTitle,
      modalVisible,
      pagination
    } = this.state;
    const content = (
      <div>
        <p>这是商品增殖服务管理界面</p>
        <div style={{ marginTop: '16px' }}>
          <PermissionAuth permissions="system:value_added:add">
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.handleModalVisible(true, '新增增殖服务')}
            >
              新增
            </Button>
            <Divider type="vertical" />
          </PermissionAuth>
          <PermissionAuth permissions="system:value_added:view">
            <Button
              icon="sync"
              type="dashed"
              onClick={() => this.fetchDataInit({})}
            >
              刷新
            </Button>
          </PermissionAuth>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper content={content}>
        <Card bordered={false}>
          <ValueAddedSearch
            handleFormSearch={this.handleFormSearch}
            handleLastLoginDateChange={this.handleLastLoginDateChange}
            handleFormReset={this.handleFormReset}
          />
          <div style={{ marginTop: '16px' }}>
            <ValueAddedTable
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              loading={loading}
              handleModalVisible={this.handleModalVisible}
              handleDeleteClick={this.handleDeleteClick}
              pagination={pagination}
              listData={list}
            />
          </div>
        </Card>
        <ValueAddedModal
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          handleModalVisible={this.handleModalVisible}
          handleFormSubmit={this.handleFormSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}
