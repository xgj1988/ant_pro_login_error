import React, { PureComponent } from "react";
import { BackTop, Button, Card, Divider, message, Popconfirm } from "antd";
import { connect } from "dva";
import * as utils from "@/utils/utils";
import Constant from "@/utils/Constant";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import PermissionModal from "./PermissionModal";
import PermissionTable from "./PermissionTable";
import PermissionSearch from "./PermissionSearch";
import PermissionAuth from "@/utils/PermissionAuth";

@connect(({ loading }) => ({
  loading: loading.models.permission
}))
export default class Permission extends PureComponent {
  selectCondition = {
    ...Constant.defaultPagination
  };

  state = {
    selectedRows: [],
    modalVisible: false,
    modalTitle: "创建权限",
    currentItem: {},
    list: [],
    menuList: [],
    pagination: {}
  };

  componentDidMount() {
    this.fetchDataInit({});
  }

  handleRowSelectionOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleModalVisible = (modalVisible, modalTitle, currentItem) => {
    this.setState({ modalVisible, modalTitle, currentItem });
  };

  handleClickCopy = (id, menuId, name, identity) => {
    this.props.dispatch({
      type: "permission/copy",
      payload: { id, menuId, name, identity },
      callback: (success) => {
        if (success) {
          this.fetchDataList(this.selectCondition);
        }
      }
    });
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
        type: "permission/add",
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: "permission/update",
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
      message.warn("没有可以删除的条目");
      this.setState({ selectedRows: [] });
      return;
    }
    const ids = newRows.map(row => row.id).join(",");
    this.props.dispatch({
      type: "permission/remove",
      payload: { ids },
      callback: (success) => {
        if (success) {
          this.setState({
            selectedRowKeys: [],
            selectedRows: []
          });
          this.fetchDataList(this.selectCondition);
        }
      }
    });
  };

  handleFormSearch = (values) => {
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


  fetchDataInit = (payload) => {
    this.props.dispatch({
      type: "permission/fetch",
      payload,
      callback: (data) => {
        const pagination = utils.wrapperPagination(data.page);
        const menuList = utils.reduceTree(data.menuList);
        this.setState({
          list: data.page.records,
          pagination,
          menuList
        });
      }
    });
  };

  fetchDataList = (payload) => {
    this.props.dispatch({
      type: "permission/list",
      payload,
      callback: (data) => {
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
    const { list, pagination, selectedRowKeys, selectedRows, modalVisible, modalTitle, currentItem, menuList } = this.state;
    const hasSelected = selectedRows.length > 0;
    const content = (
      <div >
        <p >
          Admin权限管理界面，可以增，删，改，查和授权角色。
        </p >
        <div style={{ marginTop: "16px" }} >
          <PermissionAuth permissions="system:permission:add" >
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, "新增权限")} >
              新增
            </Button >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:permission:delete" >
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
          <PermissionAuth permissions="system:permission:view" >
            <Button icon="sync" type="dashed" onClick={() => this.fetchDataInit({})} >
              刷新
            </Button >
          </PermissionAuth >
        </div >
      </div >
    );
    return (
      <PageHeaderWrapper
        content={content}
      >
        <Card bordered={false} >
          <div >
            <PermissionSearch
              handleFormSearch={this.handleFormSearch}
              handleFormReset={this.handleFormReset}
              menuList={menuList}
            />
          </div >
          <div style={{ marginTop: "16px" }} >
            <PermissionTable
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              handleClickCopy={this.handleClickCopy}
              menuList={menuList}
              dataSource={list}
              pagination={pagination}
              loading={loading}
              selectedRowKeys={selectedRowKeys}
              handleRowSelectionOnChange={this.handleRowSelectionOnChange}
              handleModalVisible={this.handleModalVisible}
            />
          </div >
        </Card >
        <PermissionModal
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          handleFormSubmit={this.handleFormSubmit}
          handleModalVisible={this.handleModalVisible}
          menuList={menuList}
        />
        <BackTop />
      </PageHeaderWrapper >
    );
  }
}
