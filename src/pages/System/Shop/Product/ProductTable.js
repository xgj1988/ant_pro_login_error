import React, { PureComponent } from "react";
import { Popconfirm, Tooltip, Avatar } from "antd";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";
import LoginUser from "@/utils/LoginUser";


export default class ProductTable extends PureComponent {
  render() {
    const {
      loading, handleModalVisible, handleDeleteClick, listData, pagination, selectCondition, remoteSelectFn
    } = this.props;
    const columns = [{
      title: "操作",
      key: "action",
      width: 120,
      render: (val, record) => {
        if (record.autoCreate) {
          return;
        }
        const edit = (
          <a onClick={() => handleModalVisible(true, "编辑", record)} >
            编辑
          </a >
        );
        return (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <PermissionAuth permissions={["system:product:update", "system:product:delete"]} emptyValue="无" >
              <PermissionAuth permissions="system:product:update" >
                {edit}

                &nbsp;&nbsp;
              </PermissionAuth >
              <PermissionAuth permissions="system:product:delete" >
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
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 100
    }, {
      title: "图标",
      dataIndex: "icon",
      width: 80,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        if (value) {
          return (
            <Tooltip key={value} title="点击查看大图" >
              <a target="_blank" rel="noopener noreferrer" href={value} >
                <Avatar shape="square" src={value} size="small" />
              </a >
            </Tooltip >
          );
        }
      }
    },
      {
        title: "序号",
        dataIndex: "orders",
        width: 80
      }, {
        title: "备注",
        dataIndex: "memo",
        renderType: "ellipsis",
        width: 200
      }];
    return (
      <BasicTable
        lineNumFix={false}
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (LoginUser.hasPermissions("system:product:update")) {
            handleModalVisible(true, "编辑", record);
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
