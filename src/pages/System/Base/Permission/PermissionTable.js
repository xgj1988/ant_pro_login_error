import React, { Fragment, PureComponent } from "react";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";
import LoginUser from "@/utils/LoginUser";
import { Input, Modal, TreeSelect } from "antd";
import * as utils from "@/utils/utils";

export default class PermissionTable extends PureComponent {
  /**
   * 单击拷贝
   */
  handleClickPreCopy = (record) => {
    const self = this;
    const { menuList } = this.props;
    Modal.confirm({
      title: "请输入要拷贝的值",
      content:
        <Fragment >
          <br />
          <span >菜单：</span >
          <TreeSelect
            onChange={(value) => {
              self.menuId = value;
            }}
            defaultValue={self.menuId}
            dropdownStyle={{ maxHeight: 500 }}
            style={{ width: "200px" }}
            allowClear
            showSearch
            treeNodeFilterProp="title"
          >
            {utils.renderTreeNodes(menuList)}
          </TreeSelect >
          <br />
          <br />
          <span >名字：</span >
          <Input
            defaultValue={record.name}
            style={{ width: 200 }}
            ref={(input) => {
              if (input) {
                self.nameInput = input.input;
              }
            }}
            maxLength={100}
          />
          <br />
          <br />
          <span >标识：</span >
          <Input
            style={{ width: 200 }}
            defaultValue={self.identity}
            ref={(input) => {
              if (input) {
                self.identityInput = input.input;
              }
            }}
            maxLength={100}
          />
        </Fragment >,
      onOk() {
        const name = self.nameInput.value;
        const identity = self.identityInput.value;
        self.identity = identity;
        const { handleClickCopy } = self.props;
        if (handleClickCopy) {
          handleClickCopy(record.id, self.menuId, name, identity);
        }
      }
    });
  };

  render() {
    const {
      dataSource,
      pagination,
      loading,
      selectedRowKeys,
      handleRowSelectionOnChange,
      handleModalVisible,
      selectCondition,
      remoteSelectFn
    } = this.props;
    const columns = [
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (text, record) => {
          if (!record.autoCreate) {
            return (
              <PermissionAuth
                permissions={["system:permission:update", "system:permission:copy"]}
                emptyValue="无"
              >
                <PermissionAuth permissions="system:permission:update" >
                  <a onClick={() => handleModalVisible(true, "编辑权限", record)} >
                    编辑
                  </a >
                </PermissionAuth >
                {
                  record.url !== "default"
                    ? (
                      <PermissionAuth permissions="system:permission:copy" >
                        &nbsp;&nbsp;
                        <a
                          onClick={() => this.handleClickPreCopy(record)}
                        >
                          拷贝
                        </a >
                      </PermissionAuth >
                    ) : null
                }
              </PermissionAuth >
            );
          }
        }
      },
      {
        title: "所属菜单",
        width: 100,
        dataIndex: "menu.name"
      },
      {
        title: "名字",
        dataIndex: "name",
        renderType: "ellipsis",
        width: 200,
        render: (text, record) => {
          if (!record.autoCreate) {
            return `${record.name}-${record.menu.name}`;
          }
        }
      },
      {
        title: "URL",
        dataIndex: "url",
        renderType: "ellipsis",
        width: 200
      },
      {
        title: "标识",
        dataIndex: "value",
        renderType: "ellipsis",
        width: 200
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: handleRowSelectionOnChange
    };
    return (
      <Fragment >
        <BasicTable
          onRowDbClick={(record) => {
            if (record.autoCreate) {
              return null;
            }
            if (LoginUser.hasPermissions("system:permission:update")) {
              handleModalVisible(true, "编辑权限", record);
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
      </Fragment >
    );
  }
}
