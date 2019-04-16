import React, { PureComponent } from "react";
import { Popconfirm } from "antd";
import * as utils from "@/utils/utils";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";

export default class AreaTable extends PureComponent {
  render() {
    const { listData, handleDeleteClick, handleModalVisible, handleTableExpand, loading } = this.props;
    const columns = [{
      title: "城市",
      align: "left",
      width: 500,
      dataIndex: "name"
    }, {
      title: "序号",
      dataIndex: "orders"
    }, {
      title: "操作",
      width: 120,
      render: (text, record) => {
        if (record.autoCreate) {
          return;
        }
        const edit = (
          <a onClick={() => handleModalVisible(true, "编辑区域", record)} >
            编辑
          </a >
        );
        if (utils.isNull(record.children) || record.children.length === 0) {
          return (
            <PermissionAuth permissions={["system:area:update", "system:area:delete"]} emptyValue="无" >
              <div
                style={{ minWidth: "80px" }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <PermissionAuth permissions="system:area:update" >
                  {edit}

                  &nbsp;&nbsp;
                </PermissionAuth >
                <PermissionAuth permissions="system:area:delete" >
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
              </div >
            </PermissionAuth >
          );
        } else {
          return (
            <PermissionAuth permissions="system:area:update" emptyValue="无" >
              <div style={{ minWidth: "80px" }} >
                {edit}
              </div >
            </PermissionAuth >
          );
        }
      }
    }];

    return (
      <BasicTable
        onExpand={handleTableExpand}
        showLineNum={false}
        loading={loading}
        columns={columns}
        dataSource={listData}
        calcScrollY={false}
      />
    );
  }
}
