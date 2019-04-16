import React, { PureComponent } from 'react';
import { BackTop, Button, Card, Divider, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import * as utils from '@/utils/utils';
import Constant from '@/utils/Constant';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleModal from './RoleModal';
import RoleEmpowerModal from './RoleEmpowerModal';
import Roleable from './RoleTable';
import RoleSearch from './RoleSearch';
import PermissionAuth from '@/utils/PermissionAuth';

@connect(({loading}) => ({
  loading: loading.models.role,
}))
export default class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.menuList = [];
    this.selectCondition = {
      ...Constant.defaultPagination,
    };
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      empowerModalVisible: false,
      modalTitle: '创建角色',
      currentItem: {},
      currentMenus: [],
      currentPermissions: [],
      menus: [],
      list: [],
      pagination: {},
    };
  }


  componentDidMount() {
    this.fetchDataInit({});
  }

  handleRowSelectionOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows});
  };

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
        type: 'role/add',
        payload: params,
        callback,
      });
    } else {
      this.props.dispatch({
        type: 'role/update',
        payload: params,
        callback,
      });
    }
  };

  handleEmpowerModalVisible = (empowerModalVisible, currentItem) => {
    if (!utils.isNull(currentItem)) {
      this.props.dispatch({
        type: 'role/beforeEmpower',
        payload: {id: currentItem.id},
        callback: (data) => {
          const menus = utils.reduceTree(data.menus);
          utils.treeGenerateList(menus, this.menuList);
          this.setState({
            empowerModalVisible,
            currentItem,
            currentMenus: data.currentMenus,
            currentPermissions: data.currentPermissions,
            menus
          });
        },
      });
    } else {
      this.setState({
        empowerModalVisible,
        currentItem,
      });
    }
  };

  handleEmpowerFormSubmit = (params, callback) => {
    this.props.dispatch({
      type: 'role/empower',
      payload: params,
      callback,
    });
  };

  handleDeleteClick = () => {
    const newRows = this.state.selectedRows.filter((item) => {
      return !(parseInt(item.id, 0) < 0);
    });
    if (newRows.length === 0) {
      message.warn('没有可以删除的条目');
      this.setState({selectedRows: []});
      return;
    }
    const ids = newRows.map(row => row.id).join(',');
    this.props.dispatch({
      type: 'role/remove',
      payload: {ids},
      callback: (success) => {
        if (success) {
          this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          });
          this.fetchDataList(this.selectCondition);
        }
      },
    });
  };

  handleFormSearch = (values) => {
    this.selectCondition = {
      ...this.selectCondition,
      ...Constant.defaultPagination,
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
      type: 'role/fetch',
      payload,
      callback: (data) => {
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          pagination,
        });
      },
    });
  }


  fetchDataList = (payload) => {
    this.props.dispatch({
      type: 'role/list',
      payload,
      callback: (data) => {
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          pagination,
        });
      },
    });
  }

  render() {
    const {loading} = this.props;
    const {
      list, pagination, selectedRowKeys, selectedRows, modalVisible, empowerModalVisible,
      modalTitle, currentItem, currentMenus, currentPermissions, menus,
    } = this.state;
    const hasSelected = selectedRows.length > 0;
    const content = (
      <div>
        <p>

          Admin角色管理界面，可以增，删，改，查和授权角色。
        </p>
        <div style={{marginTop: '16px'}}>
          <PermissionAuth permissions="system:role:add">
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, '新增角色')}>
              新增
            </Button>
            <Divider type="vertical" />
          </PermissionAuth>
          <PermissionAuth permissions="system:role:delete">
            <Popconfirm
              title="你确定要删除所选记录吗？"
              onConfirm={this.handleDeleteClick}
              okText="确定"
              cancelText="取消"
            >
              <Button
                icon="delete"
                type="danger"
                {...(hasSelected ? {} : {disabled: true})}
              >
                删除
              </Button>
            </Popconfirm>
            <Divider type="vertical" />
          </PermissionAuth>
          <PermissionAuth permissions="system:role:view">
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
          <RoleSearch
            handleFormSearch={this.handleFormSearch}
            handleFormReset={this.handleFormReset}
          />
          <div style={{marginTop: '16px'}}>
            <Roleable
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              dataSource={list}
              pagination={pagination}
              loading={loading}
              selectedRowKeys={selectedRowKeys}
              handleRowSelectionOnChange={this.handleRowSelectionOnChange}
              handleModalVisible={this.handleModalVisible}
              handleEmpowerModalVisible={this.handleEmpowerModalVisible}
            />
          </div>
        </Card>
        <RoleModal
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          handleFormSubmit={this.handleFormSubmit}
          handleModalVisible={this.handleModalVisible}
        />
        <RoleEmpowerModal
          currentItem={currentItem}
          currentMenus={currentMenus}
          currentPermissions={currentPermissions}
          menus={menus}
          menuList={this.menuList}
          title="角色授权"
          visible={empowerModalVisible}
          handleFormSubmit={this.handleFormSubmit}
          handleEmpowerFormSubmit={this.handleEmpowerFormSubmit}
          handleEmpowerModalVisible={this.handleEmpowerModalVisible}
        />
        <BackTop />
      </PageHeaderWrapper>
    );
  }
}
