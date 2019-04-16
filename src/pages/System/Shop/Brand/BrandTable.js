import React, { PureComponent } from "react";
import { Avatar, Popconfirm, Tooltip } from "antd";
import BasicTable from "@/components/Common/Table/BasicTable";
import PermissionAuth from "@/utils/PermissionAuth";
import LoginUser from "@/utils/LoginUser";
import * as utils from "@/utils/utils";


export default class BrandTable extends PureComponent {
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
          <a onClick={() => handleModalVisible(true, "编辑品牌", record)} >
            编辑
          </a >
        );
        return (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <PermissionAuth permissions={["system:brand:update", "system:brand:delete"]} emptyValue="无" >
              <PermissionAuth permissions="system:brand:update" >
                {edit}

                &nbsp;&nbsp;
              </PermissionAuth >
              <PermissionAuth permissions="system:brand:delete" >
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
      width: 100
    }, {
      title: "LOGO",
      dataIndex: "logo",
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
    }, {
      title: "网址",
      dataIndex: "url",
      width: 80
    }, {
      title: "序号",
      dataIndex: "orders",
      width: 80
    }, {
      title: "介绍",
      dataIndex: "introduction",
      width: 60,
      render: (value, record) => {
        if (record.autoCreate) {
          return;
        }
        if (value) {
          return (
            <Tooltip title="预览" >
              <i
                className="iconfont icon-icpreview"
                style={{ cursor: "pointer" }}
                onClick={() => utils.previewHtml(record.name, value)}
              />
            </Tooltip >
          );
        } else {
          return "";
        }
      }
    }];
    return (
      <BasicTable
        lineNumFix={false}
        onRowDbClick={(record) => {
          if (record.autoCreate) {
            return;
          }
          if (LoginUser.hasPermissions("system:brand:update")) {
            handleModalVisible(true, "编辑品牌", record);
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
