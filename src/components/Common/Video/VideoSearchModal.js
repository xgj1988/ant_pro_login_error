import React, { PureComponent } from 'react';
import { BackTop, Button, Col, Form, message, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import lodash from 'lodash';
import BasicModal from '../Modal/BasicModal';
import BasicTable from '../Table/BasicTable';
import * as utils from '@/utils/utils';
import Constant from '@/utils/Constant';
import ResetInput from '../Input/ResetInput';
import Ellipsis from '../../Ellipsis';

const FormItem = Form.Item;
@connect(({ loading }) => ({
  loading: loading.effects['video/list'],
}))
@Form.create()
export default class VideoSearchModal extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedRows = props.selectedRows || [];
    this.selectCondition = {
      ...Constant.defaultPagination,
    };
    let selectedRowKeys = [];
    if (lodash.isArray(this.selectedRows)) {
      selectedRowKeys = this.selectedRows.map(item => item.id);
    }
    this.state = {
      pagination: {},
      list: [],
      selectedRowKeys,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (this.isUnmount) {
      return;
    }
    if ('selectedRows' in nextProps) {
      if (
        lodash.isArray(nextProps.selectedRows)
        && !lodash.isEqual(this.selectedRows, nextProps.selectedRows)
      ) {
        this.selectedRows = nextProps.selectedRows;
        const selectedRowKeys = this.selectedRows.map(item => item.id);
        this.handleRowSelect(selectedRowKeys, this.selectedRows);
      }
    }
  }


  handleShow = () => {
    this.selectedRows = [];
    this.setState({ selectedRowKeys: [] });
    this.fetchDataList(this.selectCondition);
  };

  handleModalOk = () => {
    this.selectedRows = this.selectedRows.filter((item) => {
      return utils.isNull(item.autoCreate) || item.autoCreate === false;
    });
    if (this.selectedRows.length > 0) {
      const { handleTableSelect, handleModalVisible } = this.props;
      handleTableSelect(this.selectedRows);
      handleModalVisible(false);
    } else {
      message.error(`请选择${this.props.name}`);
    }
  };

  handleRowSelect = (selectedRowKeys, selectedRows) => {
    const { list } = this.state;
    // 先把当前页的排除
    this.selectedRows = lodash.differenceBy(this.selectedRows, list, 'id');
    // 再对所选的row进行并集
    this.selectedRows = lodash.unionBy(this.selectedRows, selectedRows, 'id');
    this.setState({ selectedRowKeys: [...selectedRowKeys] });
  };

  handleSearchFormSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.selectCondition = {
          ...this.selectCondition,
          ...Constant.defaultPagination,
          ...values,
        };
        this.fetchDataList(this.selectCondition);
      }
    });
  };

  handleTableRowDbClick = (record) => {
    if (record.autoCreate) {
      return;
    }
    const { handleTableSelect, handleModalVisible, multi = false } = this.props;
    if (multi) {
      // 这里要处理已经单击了的情况，如果在双击，所以要去重.
      const findIndex = this.selectedRows.findIndex(
        item => item.id === record.id
      );
      if (findIndex < 0) {
        this.selectedRows.push(record);
      }
    } else {
      this.selectedRows = [];
      this.selectedRows.push(record);
    }
    handleTableSelect(this.selectedRows);
    handleModalVisible(false);
  };

  handleTableRowClick = (record) => {
    if (record.autoCreate) {
      return;
    }
    const { multi = false } = this.props;
    if (multi) {
      const { selectedRowKeys } = this.state;
      // 如果有，就删除，没有就新增
      if (utils.inArray(record.id, selectedRowKeys)) {
        lodash.remove(selectedRowKeys, (item) => {
          return item === record.id;
        });
        lodash.remove(this.selectedRows, (item) => {
          return item.id === record.id;
        });
      } else {
        selectedRowKeys.push(record.id);
        this.selectedRows.push(record);
      }
      this.handleRowSelect(selectedRowKeys, this.selectedRows);
    } else {
      this.selectedRows = [];
      this.selectedRows.push(record);
    }
  };

  fetchDataList = (payload) => {
    this.props.dispatch({
      type: 'video/list',
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
    const columns = [{
      title: '发布人',
      dataIndex: 'creator.nickname',
      width: 80,
    }, {
      title: '创建时间',
      dataIndex: 'createdDate',
      sorter: true,
      sortName: 'created_date',
      width: 120,
      render: (value, record) => {
        if (!record.autoCreate) {
          return (
            <Ellipsis lines={1} tooltip >
              {moment(value).format('YYYY-MM-DD HH:mm:ss')}
            </Ellipsis >
          );
        }
      },
    }, {
      title: '标题',
      dataIndex: 'title',
      sorter: true,
      width: 200,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        return (
          <Ellipsis lines={1} tooltip >
            {value}
          </Ellipsis >
        );
      },
    }, {
      title: '内容',
      dataIndex: 'content',
      width: 60,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        return (
          <Tooltip title="预览" >
            <i
              className="iconfont icon-icpreview"
              style={{ cursor: 'pointer' }}
              onClick={() => utils.previewHtml(record.title, value)}
            />
          </Tooltip >
        );
      },
    }];
    const {
      loading,
      title,
      handleModalVisible,
      visible,
      multi = false,
    } = this.props;
    const { list, pagination, selectedRowKeys } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    let rowSelection = null;
    if (multi) {
      rowSelection = {
        selectedRowKeys,
        onChange: this.handleRowSelect,
      };
    }
    return (
      <BasicModal
        onShow={this.handleShow}
        lineFixNum={false}
        addFlag={false}
        width={1100}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <div >
          <div style={{ marginBottom: '5px' }} >
            <Form onSubmit={this.handleSearchFormSubmit} layout="inline" >
              <Row gutter={{ md: 24, lg: 24, xl: 48 }} type="flex" justify="start" >
                <Col >
                  <FormItem label="创建者" >
                    {getFieldDecorator('creator.nickname_$search')(
                      <ResetInput />
                    )}
                  </FormItem >
                  <FormItem label="标题" >
                    {getFieldDecorator('title_$search')(
                      <ResetInput />
                    )}
                  </FormItem >
                  <FormItem >
                    <Button type="primary" htmlType="submit" >
                      查询
                    </Button >
                  </FormItem >
                </Col >
              </Row >
            </Form >
          </div >
          <div >
            <BasicTable
              onRowDbClick={(record) => {
                this.handleTableRowDbClick(record);
              }}
              onRowClick={(record) => {
                this.handleTableRowClick(record);
              }}
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              rowSelection={rowSelection}
              lineNumFix={false}
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={pagination}
            />
          </div >
        </div >
        <BackTop />
      </BasicModal >
    );
  }
}
