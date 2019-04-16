import React, { PureComponent } from 'react';
import { Avatar, Popconfirm, Tooltip } from 'antd';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';
import LoginUser from '@/utils/LoginUser';
import * as utils from '@/utils/utils';

export default class NavigationTable extends PureComponent {
  render() {
    const {
      loading,
      handleModalVisible,
      handleDeleteClick,
      listData,
      pagination,
      selectCondition,
      remoteSelectFn
    } = this.props;
    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (val, record) => {
          if (record.autoCreate) {
            return;
          }
          const edit = (
            <a onClick={() => handleModalVisible(true, '编辑导航', record)} >
              编辑
            </a >
          );
          return (
            <PermissionAuth
              permissions={[
                'system:navigation:update',
                'system:navigation:delete'
              ]}
              emptyValue="无"
            >
              <div
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <PermissionAuth permissions="system:navigation:update" >
                  {edit}
                  &nbsp;&nbsp;
                </PermissionAuth >
                <PermissionAuth permissions="system:navigation:delete" >
                  <Popconfirm
                    title="你确定要删除所选记录吗？"
                    onConfirm={() => {
                      handleDeleteClick(record.id);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a >删除</a >
                  </Popconfirm >
                </PermissionAuth >
              </div >
            </PermissionAuth >
          );
        }
      },
      {
        title: '名称',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
        width: 100
      },
      {
        title: '序号',
        sorter: true,
        sortName: 't1.orders',
        dataIndex: 'orders',
        width: 80
      },
      {
        title: '位置',
        sorter: true,
        sortName: 'position',
        dataIndex: 'position.desc',
        width: 100
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: 100,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          if (utils.isEmptyStr(value)) {
            return '无';
          }
          return (
            <Tooltip title="点击查看大图" >
              <a target="_blank" rel="noopener noreferrer" href={value} >
                <Avatar shape="square" src={value} size="small" />
              </a >
            </Tooltip >
          );
        }
      },
      {
        title: '标签',
        dataIndex: 'tag',
        width: 100,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          if (record.tagId) {
            if (record.position.article) {
              return record.articleTag.name;
            } else {
              return record.postTopicTag.name;
            }
          } else {
            return '无';
          }
        }
      }
    ];
    return (
      <BasicTable
        lineNumFix={false}
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (LoginUser.hasPermissions('system:navigation:update')) {
            handleModalVisible(true, '编辑导航', record);
          }
        }}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        loading={loading}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        tableName="navigationTable"
      />
    );
  }
}
