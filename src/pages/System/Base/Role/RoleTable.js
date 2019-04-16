import React, { PureComponent } from 'react';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';
import LoginUser from '@/utils/LoginUser';

export default class RoleTable extends PureComponent {
  render() {
    const {
      dataSource, pagination, loading, selectedRowKeys, handleRowSelectionOnChange,
      handleModalVisible, handleEmpowerModalVisible, selectCondition, remoteSelectFn
    } = this.props;
    const columns = [{
      title: '操作',
      key: 'action',
      width: 120,
      render: (value, record) => {
        if (!record.autoCreate) {
          return (
            <PermissionAuth permissions={['system:role:update', 'system:role:empower']} emptyValue="无" >
              <div style={{ minWidth: '80px' }} >
                <PermissionAuth permissions="system:role:update" >
                  <a onClick={() => handleModalVisible(true, '编辑角色', record)} >
                    编辑
                  </a >

                  &nbsp;&nbsp;
                </PermissionAuth >
                <PermissionAuth permissions="system:role:empower" >
                  <a onClick={() => handleEmpowerModalVisible(true, record)} >
                    授权
                  </a >
                </PermissionAuth >
              </div >
            </PermissionAuth >
          );
        }
      }
    }, {
      title: '名字',
      width: 100,
      dataIndex: 'name',
      renderType: 'ellipsis'
    }, {
      title: '是否内置',
      width: 120,
      dataIndex: 'builtIn',
      render: (value, record) => {
        if (!record.autoCreate) {
          let color = '';
          if (value) {
            color = 'red';
          }
          return (
            <span style={{ color }} >
              {value ? '是' : '否'}
            </span >
          );
        }
      }
    }, {
      title: '描述',
      width: 200,
      dataIndex: 'description',
      renderType: 'ellipsis'
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: handleRowSelectionOnChange,
      getCheckboxProps: record => ({
        disabled: record.builtIn
      })
    };
    return (
      <BasicTable
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return null;
          }
          if (LoginUser.hasPermissions('system:role:update')) {
            handleModalVisible(true, '编辑角色', record);
          }
        }}
        lineNumFix={false}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}
