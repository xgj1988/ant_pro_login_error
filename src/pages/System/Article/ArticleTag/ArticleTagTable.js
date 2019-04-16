import React, { PureComponent } from 'react';
import { Popconfirm } from 'antd';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';
import LoginUser from '@/utils/LoginUser';


export default class ArticleTagTable extends PureComponent {
  render() {
    const {
      loading, handleModalVisible, handleDeleteClick, listData, pagination, selectCondition, remoteSelectFn
    } = this.props;
    const columns = [{
      title: '操作',
      key: 'action',
      width: 120,
      render: (val, record) => {
        if (record.autoCreate) {
          return;
        }
        const edit = (
          <a onClick={() => handleModalVisible(true, '编辑标签', record)} >
            编辑
          </a >
        );
        return (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <PermissionAuth permissions={['system:article_tag:update', 'system:article_tag:delete']} emptyValue="无" >
              <PermissionAuth permissions="system:article_tag:update" >
                {edit}

                &nbsp;&nbsp;
              </PermissionAuth >
              <PermissionAuth permissions="system:article_tag:delete" >
                <Popconfirm
                  title="你确定要删除所选记录吗？"
                  onConfirm={() => {
                    handleDeleteClick(record.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a >
                    删除
                  </a >
                </Popconfirm >
              </PermissionAuth >
            </PermissionAuth >
          </div >
        );
      }
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (value, record) => {
        if (!record.autoCreate) {
          let color = '';
          if (!value) {
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
      title: '序号',
      dataIndex: 'orders',
      width: 80
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      renderType: 'ellipsis',
      width: 200
    }];
    return (
      <BasicTable
        lineNumFix={false}
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (LoginUser.hasPermissions('system:article_tag:update')) {
            handleModalVisible(true, '编辑标签', record);
          }
        }}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        loading={loading}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
      />
    );
  }
}
