import React, { PureComponent } from 'react';
import { Button, Card, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Constant from '@/utils/Constant';
import ArticleModal from './ArticleModal';
import ArticleTable from './ArticleTable';
import ArticleSearch from './ArticleSearch';
import PermissionAuth from '@/utils/PermissionAuth';
import * as utils from '@/utils/utils';

@connect(({ loading }) => ({
  loading: loading.effects['article/list', 'article/fetch']
}))
export default class Article extends PureComponent {
  selectCondition = {
    ...Constant.defaultPagination
  };

  state = {
    list: [],
    articleTags: [],
    articleStates: [],
    areaList: [],
    currentItem: {},
    modalTitle: '文章',
    modalVisible: false,
    pagination: {}
  };

  /**
   * 页面挂载钩子函数
   */
  componentDidMount() {
    const param = {};
    if (this.props.location.query) {
      const { state } = this.props.location.query;
      if (!utils.isEmptyStr(state)) {
        param.state = state;
        this.searchParam = param;
      }
    }
    this.fetchDataInit(param);
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
   * 标签置顶
   * @param record
   */
  handleTagTopClick = (record) => {
    const newValues = {};
    newValues.id = record.id;
    this.props.dispatch({
      type: 'article/tagTop',
      payload: newValues,
      callback: () => {
        this.fetchDataList(this.selectCondition);
      }
    });
  };


  /**
   * 获取所有地区
   * @param payload
   */
  fetchDataList = (payload) => {
    this.props.dispatch({
      type: 'article/list',
      payload,
      callback: (data) => {
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
  fetchDataInit = (payload) => {
    this.props.dispatch({
      type: 'article/fetch',
      payload,
      callback: (data) => {
        const list = data.page.records;
        const { articleTags, articleStates, areaList } = data;
        const pagination = utils.wrapperPagination(data.page);
        this.setState({
          list,
          articleTags,
          articleStates,
          areaList,
          pagination
        });
      }
    });
  };

  /**
   * 删除数据
   * @param id
   */
  handleDeleteClick = (id) => {
    this.props.dispatch({
      type: 'article/remove',
      payload: {
        ids: id
      },
      callback: (success) => {
        if (success) {
          this.fetchDataList(this.selectCondition);
        }
      }
    });
  };

  /**
   * 审核数据
   */
  handleAuditClick = (id) => {
    this.props.dispatch({
      type: 'article/audit',
      payload: { id },
      callback: (success) => {
        if (success) {
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
        type: 'article/add',
        payload: params,
        callback
      });
    } else {
      this.props.dispatch({
        type: 'article/update',
        payload: params,
        callback
      });
    }
  };


  render() {
    const { loading } = this.props;
    const {
      list, currentItem, modalTitle, modalVisible, pagination, articleTags,
      articleStates, areaList
    } = this.state;
    const content = (
      <div >
        <p >
          这是文章管理界面
        </p >
        <div style={{ marginTop: '16px' }} >
          <PermissionAuth permissions="system:article:add" >
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, '新增文章')} >
              新增
            </Button >
            <Divider type="vertical" />
          </PermissionAuth >
          <PermissionAuth permissions="system:article:view" >
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
          <ArticleSearch
            searchParam={this.searchParam}
            articleTags={articleTags}
            articleStates={articleStates}
            handleFormSearch={this.handleFormSearch}
            handleLastLoginDateChange={this.handleLastLoginDateChange}
            handleFormReset={this.handleFormReset}
          />
          <div style={{ marginTop: '16px' }} >
            <ArticleTable
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              handleTagTopClick={this.handleTagTopClick}
              loading={loading}
              handleModalVisible={this.handleModalVisible}
              handleDeleteClick={this.handleDeleteClick}
              handleAuditClick={this.handleAuditClick}
              pagination={pagination}
              listData={list}
            />
          </div >
        </Card >
        <ArticleModal
          articleTags={articleTags}
          currentItem={currentItem}
          title={modalTitle}
          visible={modalVisible}
          listData={list}
          areaList={areaList}
          handleModalVisible={this.handleModalVisible}
          handleFormSubmit={this.handleFormSubmit}
        />
      </PageHeaderWrapper >
    );
  }
}
