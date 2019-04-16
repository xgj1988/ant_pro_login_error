import React, { PureComponent } from "react";
import { Button, Card, Divider } from "antd";
import { connect } from "dva";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import * as utils from "@/utils/utils";
import CategoryModal from "./CategoryModal";
import CategoryTable from "./CategoryTable";
import PermissionAuth from "@/utils/PermissionAuth";

@connect(({ category, loading }) => ({
  list: utils.getEmptyArrayIfNull(category.list),
  loading: loading.models.category
}))

export default class Category extends PureComponent {
  selectCondition = {};

  state = {
    list: [],
    currentItem: {},
    modalTitle: "新增商品分类",
    modalVisible: false,
    treeSelectList: []
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
   * 获取所有分类
   * @param payload
   */
  fetchDataList = payload => {
    this.props.dispatch({
      type: "category/list",
      payload,
      callback: data => {
        const { list } = data;
        this.setState({
          list
        });
      }
    });
  };


  /**
   * 添加地区
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
        type: "category/add",
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: "category/update",
        payload: params,
        callback
      });
    }
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

  fetchDataInit = payload => {
    this.props.dispatch({
      type: "category/fetch",
      payload,
      callback: data => {
        const { list } = data;
        const treeSelectList = utils.reduceTree(list);
        this.setState({
          list,
          treeSelectList
        });
      }
    });
  };

  /**
   * 删除地区
   * @param id
   */
  handleDeleteClick = id => {
    this.props.dispatch({
      type: "category/remove",
      payload: {
        ids: id
      },
      callback: success => {
        if (success) {
          this.fetchDataList();
        }
      }
    });
  };

  render() {
    const { modalTitle, modalVisible, currentItem, treeSelectList } = this.state;
    const { list } = this.state;
    const { loading } = this.props;
    const content = (
      <div >
        <p >这里是添加商品分类</p >
        <div style={{ marginTop: "16px" }} >
          <PermissionAuth permissions="system:category:add" >
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.handleModalVisible(true, "新增商品分类")}
            >
              新增
            </Button >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:category:view" >
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
          <div style={{ marginTop: "16px" }} >
            <CategoryTable
              listData={list}
              handleDeleteClick={this.handleDeleteClick}
              handleModalVisible={this.handleModalVisible}
              loading={loading}
            />
          </div >
        </Card >
        <CategoryModal
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          treeData={treeSelectList}
          handleFormSubmit={this.handleFormSubmit}
          handleModalVisible={this.handleModalVisible}
        />
      </PageHeaderWrapper >
    );
  }
}
