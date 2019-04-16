import React, { Fragment, PureComponent } from 'react';
import { Avatar, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';
import Ellipsis from '@/components/Ellipsis';
import LoginUser from '@/utils/LoginUser';
import * as utils from '@/utils/utils';

export default class HomeContentTable extends PureComponent {
  render() {
    const {loading, handleModalVisible, handleDeleteClick, listData, pagination, selectCondition, remoteSelectFn} = this.props;
    const columns = [{
      title: '操作',
      key: 'action',
      width: 120,
      render: (val, record) => {
        if (record.autoCreate) {
          return;
        }
        const edit = (
          <a onClick={() => handleModalVisible(true, '编辑首页内容', record)}>
            编辑
          </a>
        );
        return (
          <PermissionAuth permissions={['system:home_content:update', 'system:home_content:delete']} emptyValue="无">
            <Fragment>
              <PermissionAuth permissions="system:home_content:update">
                {edit}
                &nbsp;&nbsp;
              </PermissionAuth>
              <PermissionAuth permissions="system:home_content:delete">
                <Popconfirm
                  title="你确定要删除所选记录吗？"
                  onConfirm={() => {
                    handleDeleteClick(record.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a>
                    删除
                  </a>
                </Popconfirm>
              </PermissionAuth>
            </Fragment>
          </PermissionAuth>
        );
      },
    }, {
      title: '名称',
      sorter: true,
      width: 100,
      dataIndex: 'name',
      renderType: 'ellipsis',
    }, {
      title: '开始时间',
      dataIndex: 'startDate',
      sorter: true,
      sortName: 'start_date',
      width: 100,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        return moment(value).format('YYYY-MM-DD');
      },
    }, {
      title: '结束时间',
      dataIndex: 'endDate',
      sorter: true,
      sortName: 'end_date',
      width: 100,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        return moment(value).format('YYYY-MM-DD');
      },
    }, {
      title: '序号',
      width: 80,
      sorter: true,
      sortName: 't1.orders',
      dataIndex: 'orders',
    }, {
      title: '位置',
      width: 80,
      sorter: true,
      sortName: 'position',
      dataIndex: 'position.desc',
    }, {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        return value.desc;
      },
    }, {
      title: '内容',
      dataIndex: 'contentId',
      width: 100,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        if (record.type.enum === 'PRODUCT') {
          if (record.product) {
            return (
              <Ellipsis lines={1} tooltip>
                {record.product.name}
              </Ellipsis>
            );
          } else {
            return '商品已经不存在';
          }
        }else if (record.type.enum === 'PRODUCT_TAG') {
          if (record.productTag) {
            return (
              <Ellipsis lines={1} tooltip>
                {record.productTag.name}
              </Ellipsis>
            );
          } else {
            return '商品标签已经不存在';
          }
        }else if (record.type.enum === 'CATEGORY') {
          if (record.category) {
            return (
              <Ellipsis lines={1} tooltip>
                {record.category.name}
              </Ellipsis>
            );
          } else {
            return '商品分类已经不存在';
          }
        } else if (record.type.enum === 'EXTERNAL_URL') {
          return (
            <Ellipsis lines={1} tooltip>
              <a target="_blank" rel="noopener noreferrer" href={record.url}>
                {record.urlTitle}
              </a>
            </Ellipsis>
          );
        }
      },
    }, {
      title: '图片',
      dataIndex: 'image',
      width: 80,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        if (utils.isEmptyStr(value)) {
          return '无';
        }
        return (
          <Tooltip title="点击查看大图">
            <a target="_blank" rel="noopener noreferrer" href={value}>
              <Avatar
                shape="square"
                src={value}
                size="small"
              />
            </a>
          </Tooltip>
        );
      },
    }, {
      title: '备注',
      width: 100,
      dataIndex: 'remarks',
      renderType: 'ellipsis'
    }];
    return (
      <BasicTable
        lineNumFix={false}
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (LoginUser.hasPermissions('system:homeContent:update')) {
            handleModalVisible(true, '编辑首页内容', record);
          }
        }}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        loading={loading}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        tableName="homeContentTable"
      />
    );
  }
}
