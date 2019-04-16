import React, { PureComponent } from 'react';
import { Button, Card, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Constant from '@/utils/Constant';
import NavigationModal from './NavigationModal';
import NavigationTable from './NavigationTable';
import NavigationSearch from './NavigationSearch';
import PermissionAuth from '@/utils/PermissionAuth';
import * as utils from '@/utils/utils';

@connect(({loading}) => ({
  loading: loading.models.navigation,
}))
export default class Navigation extends PureComponent {
  selectCondition = {
    ...Constant.defaultPagination,
  };

  state = {
    list: [],
    currentItem: {},
    positionTypes: [],
    articleTags: [],
    postTopicTags: [],
    modalTitle: '导航',
    modalVisible: false,
    pagination: {},
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
    this.setState({modalVisible, modalTitle, currentItem});
  };

  /**
   * 获取所有地区
   * @param payload
   */
  fetchDataList = (payload) => {
    this.props.dispatch({
      type: 'navigation/list',
      payload,
      callback: (data) => {
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          pagination
        });
      },
    });
  }

  /**
   * 初始化数据
   * @param payload
   */
  fetchDataInit = (payload) => {
    this.props.dispatch({
      type: 'navigation/fetch',
      payload,
      callback: (data) => {
        const {positionTypes, articleTags, videoTags, postTopicTags} = data;
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list: data.page.records,
          positionTypes,
          articleTags,
          videoTags,
          postTopicTags,
          pagination
        });
      },
    });
  }

  /**
   * 删除数据
   * @param id
   */
  handleDeleteClick = (id) => {
    this.props.dispatch({
      type: 'navigation/remove',
      payload: {
        ids: id
      },
      callback: (success) => {
        if (success) {
          this.fetchDataList(this.selectCondition);
        }
      },
    });
  };

  /**
   * 搜索
   * @param values
   */
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

  /**
   * 表单提交
   * @param addFlag
   * @param params
   * @param callbackModal
   */
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
        type: 'navigation/add',
        payload: params,
        callback,
      });
    } else {
      this.props.dispatch({
        type: 'navigation/update',
        payload: params,
        callback,
      });
    }
  };

  render() {
    const {loading} = this.props;
    const {list, currentItem, modalTitle, modalVisible, pagination, positionTypes, articleTags, videoTags, postTopicTags} = this.state;
    const content = (
      <div>
        <p>

          这是导航管理界面
        </p>
        <div style={{marginTop: '16px'}}>
          <PermissionAuth permissions="system:navigation:add">
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, '新增导航')}>

              新增
            </Button>
            <Divider type="vertical"/>
          </PermissionAuth>
          <PermissionAuth permissions="system:navigation:view">
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
          <NavigationSearch
            positionTypes={positionTypes}
            handleFormSearch={this.handleFormSearch}
            handleLastLoginDateChange={this.handleLastLoginDateChange}
            handleFormReset={this.handleFormReset}
          />
          <div style={{marginTop: '16px'}}>
            <NavigationTable
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
        <NavigationModal
          currentItem={currentItem}
          positionTypes={positionTypes}
          title={modalTitle}
          visible={modalVisible}
          articleTags={articleTags}
          videoTags={videoTags}
          postTopicTags={postTopicTags}
          listData={list}
          handleModalVisible={this.handleModalVisible}
          handleFormSubmit={this.handleFormSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}
