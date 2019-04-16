import React, { Fragment, PureComponent } from 'react';
import { BackTop, Form, message } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import * as utils from '@/utils/utils';
import Constant from '@/utils/Constant';
import BasicTable from '../Table/BasicTable';
import BasicModal from '../Modal/BasicModal';

@connect(({loading}) => ({
  loading: loading.effects['category/list'],
}))
@Form.create()
export default class CategorySearchModal extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedRows = props.selectedRows || [];
    this.selectCondition = {
      enabled: true,
      ...Constant.defaultPagination,
    };
    let selectedRowKeys = [];
    if (lodash.isArray(this.selectedRows)) {
      selectedRowKeys = this.selectedRows.map(item => item.id);
    }
    this.state = {
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
        lodash.isArray(nextProps.selectedRows) &&
        !lodash.isEqual(this.selectedRows, nextProps.selectedRows)
      ) {
        this.selectedRows = nextProps.selectedRows;
        const selectedRowKeys = this.selectedRows.map(item => item.id);
        this.handleRowSelect(selectedRowKeys, this.selectedRows);
      }
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  handleShow = () => {
    this.selectedRows = [];
    this.setState({selectedRowKeys: []});
    this.fetchDataList(this.selectCondition);
  };

  handleModalOk = () => {
    this.selectedRows = this.selectedRows.filter(item => {
      return utils.isNull(item.autoCreate) || item.autoCreate === false;
    });
    if (this.selectedRows.length > 0) {
      const {handleTableSelect, handleModalVisible} = this.props;
      const isClose = handleTableSelect(this.selectedRows);
      if (utils.isNull(isClose) || isClose) {
        handleModalVisible(false);
      }
    } else {
      message.error(`请选择${this.props.name}`);
    }
  };

  handleRowSelect = (selectedRowKeys, selectedRows) => {
    const {list} = this.state;
    // 先把当前页的排除
    this.selectedRows = lodash.differenceBy(this.selectedRows, list, 'id');
    // 再对所选的row进行并集
    this.selectedRows = lodash.unionBy(this.selectedRows, selectedRows, 'id');
    this.setState({selectedRowKeys: [...selectedRowKeys]});
  };

  handleSearchFormSubmit = () => {
    const {form} = this.props;
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

  handleTableRowDbClick = record => {
    if (record.autoCreate) {
      return;
    }
    const {handleTableSelect, handleModalVisible, multi = false} = this.props;
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
    const isClose = handleTableSelect(this.selectedRows);
    if (utils.isNull(isClose) || isClose) {
      handleModalVisible(false);
    }
  };

  handleTableRowClick = record => {
    if (record.autoCreate) {
      return;
    }
    const {multi = false} = this.props;
    if (multi) {
      const {selectedRowKeys} = this.state;
      // 如果有，就删除，没有就新增
      if (utils.inArray(record.id, selectedRowKeys)) {
        lodash.remove(selectedRowKeys, item => {
          return item === record.id;
        });
        lodash.remove(this.selectedRows, item => {
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

  fetchDataList = payload => {
    this.props.dispatch({
      type: 'category/list',
      payload,
      callback: data => {
        this.setState({
          list: utils.reduceTree(data.list),
        });
      },
    });
  };

  render() {
    const columns = [
      {
        title: '类别名称',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: 150,
      },
      {
        title: '类别编码',
        dataIndex: 'code',
        key: 'code',
        width: 120,
      },
      {
        title: '启用',
        dataIndex: 'enabled',
        key: 'enabled',
        width: 120,
        render: (val, record) => {
          if (record.autoCreate) {
            return;
          }
          const enabled = record.enabled ? '是' : '否';
          const show = <span>{enabled}</span>;
          return <Fragment>{show}</Fragment>;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 110,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 200,
      },
    ];
    const {
      loading,
      title,
      handleModalVisible,
      visible,
      multi = false,
    } = this.props;
    const {list, selectedRowKeys} = this.state;
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
        width={940}
        addFlag={false}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <div>
          <div>
            <BasicTable
              onRowDbClick={record => {
                this.handleTableRowDbClick(record);
              }}
              onRowClick={record => {
                this.handleTableRowClick(record);
              }}
              selectCondition={this.selectCondition}
              remoteSelectFn={this.fetchDataList}
              rowSelection={rowSelection}
              loading={loading}
              columns={columns}
              dataSource={list}
              calcScrollX
              showLineNum={false}
              autoFillRowNum="-1"
            />
          </div>
        </div>
        <BackTop />
      </BasicModal>
    );
  }
}
