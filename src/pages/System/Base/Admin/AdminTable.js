import React, { PureComponent } from "react";
import moment from "moment";
import * as utils from "@/utils/utils";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";
import LoginUser from "@/utils/LoginUser";
import Ellipsis from "@/components/Ellipsis/index";

export default class AdminTable extends PureComponent {

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
              <PermissionAuth permissions="system:admin:update" emptyValue="无" >
                <div style={{ minWidth: "80px" }} >
                  <a
                    onClick={() => handleModalVisible(true, "编辑管理员", record)
                    }
                  >
                    编辑
                  </a >
                </div >
              </PermissionAuth >
            );
          }
        }
      },
      {
        title: "用户名",
        width: 100,
        dataIndex: "username"
      },
      {
        title: "姓名",
        width: 100,
        dataIndex: "name"
      },
      {
        title: "是否内置",
        width: 120,
        dataIndex: "builtIn",
        render: (value, record) => {
          if (!record.autoCreate) {
            let color = "";
            if (value) {
              color = "red";
            }
            return (
              <span style={{ color }} >
              {value ? "是" : "否"}
              </span >
            );
          }
        }
      },
      {
        title: "是否启用",
        width: 80,
        dataIndex: "enabled",
        render: (value, record) => {
          if (!record.autoCreate) {
            let color = "";
            if (!value) {
              color = "red";
            }
            return <span style={{ color }} >{value ? "是" : "否"}</span >;
          }
        }
      },
      {
        title: "最后登录IP",
        width: 100,
        dataIndex: "lastLoginIp",
        render: (value, record) => {
          if (!record.autoCreate) {
            return !utils.isNull(value) ? value : "无";
          }
        }
      },
      {
        title: "最后登录日期",
        width: 120,
        dataIndex: "lastLoginDate",
        render: (value, record) => {
          if (!record.autoCreate) {
            if (!utils.isNull(value)) {
              const finalValue = moment(value).format("YYYY-MM-DD HH:mm:ss");
              return <Ellipsis lines={1} >{finalValue}</Ellipsis >;
            } else {
              return "无";
            }
          }
        }
      }
    ];
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
          if (LoginUser.hasPermissions("system:admin:update")) {
            handleModalVisible(true, "编辑管理员", record);
          }
        }}
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        lineNumFix={false}
        dataSource={dataSource}
        selectCondition={selectCondition}
        remoteSelectFn={remoteSelectFn}
        pagination={pagination}
      />
    );
  }
}
