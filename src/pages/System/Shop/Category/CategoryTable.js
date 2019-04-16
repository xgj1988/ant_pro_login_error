import React, { PureComponent } from "react";
import { Popconfirm } from "antd";
import * as utils from "@/utils/utils";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";

export default class CategoryTable extends PureComponent {
  render() {
    const { listData, handleDeleteClick, handleModalVisible, loading } = this.props;
    const columns = [{
      title: "名字",
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
          <a onClick={() => handleModalVisible(true, "编辑商品分类", record)} >
            编辑
          </a >
        );
        if (utils.isNull(record.children) || record.children.length === 0) {
          return (
            <PermissionAuth permissions={["system:category:update", "system:category:delete"]} emptyValue="无" >
              <div
                style={{ minWidth: "80px" }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <PermissionAuth permissions="system:category:update" >
                  {edit}

                  &nbsp;&nbsp;
                </PermissionAuth >
                <PermissionAuth permissions="system:category:delete" >
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
            <PermissionAuth permissions="system:category:update" emptyValue="无" >
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
        showLineNum={false}
        loading={loading}
        columns={columns}
        dataSource={listData}
        calcScrollY={false}
      />
    );
  }
}
