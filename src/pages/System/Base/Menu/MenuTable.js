import React, { PureComponent } from 'react';
import { Popconfirm } from 'antd';
import * as utils from '@/utils/utils';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';

export default class MenuTable extends PureComponent {
  render() {
    const { dataSource, loading, handleModalVisible, handleDeleteClick } = this.props;
    const columns = [{
      title: '名字',
      align: 'left',
      width: 100,
      dataIndex: 'name'
    }, {
      title: '路径',
      width: 100,
      dataIndex: 'path'
    }, {
      title: '图标',
      width: 100,
      dataIndex: 'icon'
    }, {
      title: '样式类名',
      width: 100,
      dataIndex: 'className'
    }, {
      title: '序号',
      width: 80,
      dataIndex: 'orders'
    }, {
      title: '操作',
      width: 120,
      key: 'action',
      render: (val, record) => {
        if (!record.autoCreate) {
          const edit = (<a onClick={() => handleModalVisible(true, '编辑菜单', record)} >编辑</a >);
          if (utils.isNull(record.children) || record.children.length === 0) {
            return (
              <PermissionAuth permissions={['system:menu:update', 'system:menu:delete']} emptyValue="无" >
                <div
                  style={{ minWidth: '80px' }}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <PermissionAuth permissions="system:menu:update" >
                    {edit}
                    &nbsp;&nbsp;
                  </PermissionAuth >
                  <PermissionAuth permissions="system:menu:delete" >
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
          } else {
            return (
              <PermissionAuth permissions="system:menu:update" emptyValue="无" >
                <div style={{ minWidth: '80px' }} >
                  {edit}
                </div >
              </PermissionAuth >
            );
          }
        }
      }
    }];
    return (
      <BasicTable
        showLineNum={false}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
}
