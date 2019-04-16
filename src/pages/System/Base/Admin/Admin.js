import React, { PureComponent } from 'react';
import { BackTop, Button, Card, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import * as utils from '@/utils/utils';
import PermissionAuth from '@/utils/PermissionAuth';
import Constant from '@/utils/Constant';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdminModal from './AdminModal';
import AdminTable from './AdminTable';
import AdminSearch from './AdminSearch';

@connect(({ loading }) => ({
  loading: loading.models.admin
}))
export default class Admin extends PureComponent {
  selectCondition = {
    ...Constant.defaultPagination
  };

  state = {
    selectedRows: [],
    modalVisible: false,
    modalTitle: '创建管理员',
    currentItem: {},
    currentRoles: [],
    currentAreas: [],
    list: [],
    roleList: [],
    pagination: {},
  };

  componentDidMount() {
    this.fetchDataInit({});
  }

  handleRowSelectionOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleModalVisible = (modalVisible, modalTitle, currentItem) => {
    if (!utils.isNull(currentItem)) {
      this.props.dispatch({
        type: 'admin/edit',
        payload: { id: currentItem.id },
        callback: data => {
          this.setState({
            modalVisible,
            modalTitle,
            currentItem,
            currentRoles: data.roles,
          });
        }
      });
    } else {
      this.setState({ modalVisible, modalTitle, currentItem });
    }
  };

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
        type: 'admin/add',
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: 'admin/update',
        payload: params,
        callback
      });
    }
  };

  handleDeleteClick = () => {
    const newRows = this.state.selectedRows.filter((item) => {
      return !(parseInt(item.id, 0) < 0);
    });
    if (newRows.length === 0) {
      message.warn('没有可以删除的条目');
      this.setState({ selectedRows: [] });
      return;
    }
    const ids = newRows.map(row => row.id).join(',');
    this.props.dispatch({
      type: 'admin/remove',
      payload: { ids },
      callback: success => {
        if (success) {
          this.setState({
            selectedRowKeys: [],
            selectedRows: []
          });
          this.fetchDataList(this.state.selectCondition);
        }
      }
    });
  };

  handleFormSearch = values => {
    this.selectCondition = {
      ...this.selectCondition,
      ...values
    };
    this.fetchDataList(this.selectCondition);
  };

  handleFormReset = () => {
    this.selectCondition = {};
    this.fetchDataList(this.selectCondition);
  };

  handleLastLoginDateChange = (dates, dateStrings) => {
    this.selectCondition = {
      ...this.selectCondition,
      startLastLoginDate: `${dateStrings[0]} 0:0:0`,
      endLastLoginDate: `${dateStrings[1]} 23:59:59`
    };
  };

  fetchDataInit = payload => {
    this.props.dispatch({
      type: 'admin/fetch',
      payload,
      callback: data => {
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          roleList: data.roleList,
          pagination
        });
      }
    });
  };

  fetchDataList = payload => {
    this.props.dispatch({
      type: 'admin/list',
      payload,
      callback: data => {
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          pagination
        });
      }
    });
  };

  render() {
    const { loading } = this.props;
    const {
      list,
      pagination,
      selectedRowKeys,
      selectedRows,
      modalVisible,
      modalTitle,
      currentItem,
      roleList,
      currentRoles,
      currentAreas,
    } = this.state;
    const hasSelected = selectedRows.length > 0;
    const content = (
      <div >
        <p >这是Admin的管理人员设置界面。</p >
        <div style={{ marginTop: '16px' }} >
          <PermissionAuth permissions="system:admin:add" >
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.handleModalVisible(true, '新增管理员')}
            >
              新增
            </Button >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:admin:delete" >
            <Popconfirm
              title="你确定要删除所选记录吗？"
              onConfirm={this.handleDeleteClick}
              okText="确定"
              cancelText="取消"
            >
              <Button
                icon="delete"
                type="danger"
                {...(hasSelected ? {} : { disabled: true })}
              >
                删除
              </Button >
            </Popconfirm >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:admin:view" >
            <Button
              icon="sync"
              type="dashed"
              onClick={() => this.fetchDataInit({})}
            >
              刷新
            </Button >
          </PermissionAuth >
        </div >
      </div >
    );
    return (
      <PageHeaderWrapper content={content} >
        <Card bordered={false} >
          <AdminSearch
            handleFormSearch={this.handleFormSearch}
            handleLastLoginDateChange={this.handleLastLoginDateChange}
            handleFormReset={this.handleFormReset}
          />
          <div style={{ marginTop: '16px' }} >
            <AdminTable
              dataSource={list}
              pagination={pagination}
              loading={loading}
              selectedRowKeys={selectedRowKeys}
              handleRowSelectionOnChange={this.handleRowSelectionOnChange}
              handleModalVisible={this.handleModalVisible}
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
            />
          </div >
        </Card >
        <AdminModal
          currentRoles={currentRoles}
          currentAreas={currentAreas}
          roleList={roleList}
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          handleFormSubmit={this.handleFormSubmit}
          handleModalVisible={this.handleModalVisible}
        />
        <BackTop />
      </PageHeaderWrapper >
    );
  }
}
