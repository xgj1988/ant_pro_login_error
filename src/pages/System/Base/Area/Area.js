import React, { PureComponent } from 'react';
import { Button, Card, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import * as utils from '@/utils/utils';
import AreaModal from './AreaModal';
import AreaTable from './AreaTable';
import PermissionAuth from '@/utils/PermissionAuth';

@connect(({ area, loading }) => ({
  list: utils.getEmptyArrayIfNull(area.list),
  loading: loading.models.area
}))
export default class Area extends PureComponent {
  selectCondition = {};

  state = {
    list: [],
    currentItem: {},
    modalTitle: '新增区域',
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
   *  控制table展开
   * @param expanded
   * @param record
   */
  handleTableExpand = (expanded, record) => {
    if (expanded) {
      this.loadChildren(record);
    }
  };


  /**
   * 获取所有地区
   * @param payload
   */
  fetchDataList = payload => {
    this.props.dispatch({
      type: 'area/list',
      payload,
      callback: data => {
        const { list } = data;
        list.forEach((item) => {
          if (item.hasChildren) {
            // eslint-disable-next-line
            item.children = [];
          }
        });
        this.setState({
          list
        });
      }
    });
  };


  /**
   * 获取所有地区
   * @param payload
   */
  loadChildren = (record) => {
    this.props.dispatch({
      type: 'area/list',
      payload: { parentId: record.id },
      callback: data => {
        const { list } = data;
        list.forEach((item) => {
          if (item.hasChildren) {
            // eslint-disable-next-line
            item.children = [];
          }
        });
        const oldList = this.state.list;
        const node = utils.findTreeNodeById(oldList, record.id);
        node.children = list;
        this.setState({ list: oldList });
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
        type: 'area/add',
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: 'area/update',
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
      type: 'area/fetch',
      payload,
      callback: data => {
        const { list, allArea } = data;
        const treeSelectList = utils.reduceTree(allArea);
        list.forEach((item) => {
          if (item.hasChildren) {
            // eslint-disable-next-line
            item.children = [];
          }
        });
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
      type: 'area/remove',
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
        <p >这里是添加区域</p >
        <div style={{ marginTop: '16px' }} >
          <PermissionAuth permissions="system:area:add" >
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.handleModalVisible(true, '新增区域')}
            >
              新增
            </Button >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:area:view" >
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
          <div style={{ marginTop: '16px' }} >
            <AreaTable
              listData={list}
              handleDeleteClick={this.handleDeleteClick}
              handleModalVisible={this.handleModalVisible}
              handleTableExpand={this.handleTableExpand}
              loading={loading}
            />
          </div >
        </Card >
        <AreaModal
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
