import React, { Fragment, PureComponent } from 'react';
import { Avatar, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import BasicTable from '@/components/Common/Table/BasicTable';
import PermissionAuth from '@/utils/PermissionAuth';
import Ellipsis from '@/components/Ellipsis/index';
import * as utils from '@/utils/utils';
import LoginUser from '@/utils/LoginUser';

export default class ArticleTable extends PureComponent {
  generateTag = (articleTags) => {
    if (articleTags) {
      return articleTags.map(articleTag => (
        <Tag key={articleTag.id} >{articleTag.name}</Tag >
      ));
    } else {
      return null;
    }
  };


  render() {
    const {
      loading,
      handleDeleteClick,
      handleModalVisible,
      handleAuditClick,
      handleSubjectModalVisible,
      listData,
      pagination,
      selectCondition,
      remoteSelectFn
    } = this.props;

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 160,
        render: (val, record) => {
          if (record.autoCreate) {
            return;
          }
          return (
            <div
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <PermissionAuth
                permissions={[
                  'system:article:update',
                  'system:article:delete',
                  'system:article:audit'
                ]}
                emptyValue="无"
              >
                <PermissionAuth permissions="system:article:update" >
                  <a onClick={() => handleModalVisible(true, '编辑文章', record)} >
                    编辑
                  </a >
                </PermissionAuth >
                {record.state.enum === 'AUDITING' ? (
                  <PermissionAuth permissions="system:article:audit" >
                    &nbsp;&nbsp;
                    <Popconfirm
                      title="你确定要审核所选记录吗？"
                      onConfirm={() => {
                        handleAuditClick(record.id);
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a >审核</a >
                    </Popconfirm >
                  </PermissionAuth >
                ) : null}
                <PermissionAuth permissions="system:article:delete" >
                  &nbsp;&nbsp;
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
                {record.state === 'AUDITING' ? (
                  <PermissionAuth permissions="system:article:audit" >
                    &nbsp;&nbsp;
                    <Popconfirm
                      title="你确定要审核所选记录吗？"
                      onConfirm={() => {
                        handleAuditClick(record.id);
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a >审核</a >
                    </Popconfirm >
                  </PermissionAuth >
                ) : null}
              </PermissionAuth >
            </div >
          );
        }
      },
      {
        title: '发布人',
        dataIndex: 'creator.name',
        width: 120,
        sorter: true,
        sortName: 'm_nickname',
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          return (
            <Ellipsis lines={1} tooltip >
              {value}
            </Ellipsis >
          );
        }
      },
      {
        title: '发布时间',
        dataIndex: 'createdDate',
        sorter: true,
        sortName: 't1.created_date',
        width: 120,
        render: (value, record) => {
          if (!record.autoCreate) {
            return (
              <Ellipsis lines={1} tooltip >
                {moment(value).format('YYYY-MM-DD HH:mm:ss')}
              </Ellipsis >
            );
          }
        }
      },
      {
        title: '标题',
        dataIndex: 'title',
        sorter: true,
        width: 200,
        renderType: 'ellipsis'
      },
      {
        title: '状态',
        dataIndex: 'state',
        sorter: true,
        sortName: 't1.state',
        width: 80,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          let color = '';
          if (value.enum === 'AUDITING') {
            color = 'red';
          }
          return (
            <span style={{ color }} >
              {value.desc}
            </span >
          );
        }
      },
      {
        title: '区域',
        dataIndex: 'area.name',
        width: 80,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          return utils.isEmptyStr(value) ? '无' : value;
        }
      },
      {
        title: '封面',
        dataIndex: 'cover',
        width: 180,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          return (
            <Tooltip key={value} title="点击查看大图" >
              <a target="_blank" rel="noopener noreferrer" href={value} >
                <Avatar shape="square" src={value} size="small" />
              </a >
            </Tooltip >
          );
        }
      },
      {
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
        }
      },
      {
        title: '标签',
        dataIndex: 'articleTags',
        width: 200,
        render: (value, record) => {
          if (record.autoCreate) {
            return;
          }
          if (utils.isEmptyArray(value)) {
            return '无';
          } else {
            const valueTag = <Fragment >{this.generateTag(value)}</Fragment >;
            return (
              <Tooltip title={valueTag} >
                <Ellipsis lines={1} >{valueTag}</Ellipsis >
              </Tooltip >
            );
          }
        }
      }
    ];
    return (
      <BasicTable
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (record.createType === 'member') {
            return;
          }
          if (LoginUser.hasPermissions('system:article:update')) {
            if (record.subject) {
              handleSubjectModalVisible(true, '编辑专题', record);
            } else {
              handleModalVisible(true, '编辑文章', record);
            }
          }
        }}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        loading={loading}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        calcScrollX
      />
    );
  }
}
