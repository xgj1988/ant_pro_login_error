import React, { PureComponent } from "react";
import { Form, Input, Select, Switch } from "antd";
import Constant from "@/utils/Constant";
import * as utils from "@/utils/utils";
import BasicModal from "@/components/Common/Modal/BasicModal";
import Password from "@/components/Common/Input/Password";

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class AdminModal extends PureComponent {
  handleModalOk = (addFlag, modalVisible) => {
    const {
      form,
      handleFormSubmit,
      handleModalVisible,
      currentItem
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = values;
        if (!addFlag) {
          newValues = utils.copyJsonIgnoreCommonFields(currentItem, { ...values }, "member");
          if (utils.isNull(values.memberId)) {
            newValues.memberId = null;
          }
          if (utils.isNull(values.password)) {
            delete newValues.password;
          }
        }
        handleFormSubmit(addFlag, newValues, success => {
          if (addFlag) {
            if (success && modalVisible) {
              form.resetFields();
            } else if (success && !modalVisible) {
              handleModalVisible(false);
            }
          } else if (!addFlag && success) {
            handleModalVisible(false);
          }
        });
      }
    });
  };

  handleShow = () => {
    const { currentItem = {} } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    if (addFlag) {
      setTimeout(() => {
        if (this.usernameInput && this.usernameInput.focus) {
          this.usernameInput.focus();
        }
      });
    } else {
      setTimeout(() => {
        if (this.passwordInput && this.passwordInput.focus) {
          this.passwordInput.focus();
        }
      });
    }
  };

  render() {
    const {
      form,
      visible,
      handleModalVisible,
      title,
      currentItem = {},
      roleList,
      currentRoles,
      currentAreas
    } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    const currentRolesVal = [];
    const currentAreasVal = [];
    let enabledDefaultVal = true;
    if (!addFlag) {
      enabledDefaultVal = currentItem.enabled;
      for (const currentRole of currentRoles) {
        currentRolesVal.push(currentRole.id);
      }
      for (const currentArea of currentAreas) {
        currentAreasVal.push(currentArea.id);
      }
    }
    const roleChildren = [];
    for (const role of roleList) {
      roleChildren.push(
        <Option key={role.id.toString()} title={role.name} value={role.id} >
          {role.name}
        </Option >
      );
    }
    return (
      <BasicModal
        onShow={this.handleShow}
        addFlag={addFlag}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <Form >
          <FormItem hasFeedback {...Constant.formItemLayout} label="用户名" >
            {getFieldDecorator("username", {
              initialValue: currentItem.username,
              rules: [
                {
                  pattern: /^[\w\-_]+$/g,
                  required: true,
                  message: "用户名只能包含数字、英文字符、下划线、横线"
                }
              ]
            })(
              <Input
                ref={input => {
                  this.usernameInput = input;
                }}
                maxLength={20}
                {...(addFlag ? {} : { disabled: true })}
              />
            )}
          </FormItem >
          <FormItem hasFeedback {...Constant.formItemLayout} label="姓名" >
            {getFieldDecorator("name", {
              initialValue: currentItem.name,
              rules: [{ required: true, message: "请输入姓名" }]
            })(<Input maxLength={20} />)}
          </FormItem >
          <FormItem hasFeedback {...Constant.formItemLayout} label="密码" >
            {getFieldDecorator("password", {
              rules: [{ required: addFlag, message: "请输入密码" }]
            })(
              <Password
                ref={({ realItem }) => {
                  this.passwordInput = realItem;
                }}
                {...(addFlag ? {} : { showRest: true })}
              />
            )}
          </FormItem >
          <FormItem hasFeedback {...Constant.formItemLayout} label="电话号码" >
            {getFieldDecorator("phone", {
              initialValue: currentItem.phone
            })(<Input maxLength={20} />)}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="是否启用" >
            {getFieldDecorator("enabled", {
              initialValue: enabledDefaultVal,
              valuePropName: "checked"
            })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="角色" >
            {getFieldDecorator("roleIds", {
              initialValue: currentRolesVal
            })(
              <Select
                allowClear
                showSearch
                dropdownStyle={{ maxHeight: 500 }}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                mode="multiple"
                placeholder="选择角色"
              >
                {roleChildren}
              </Select >
            )}
          </FormItem >
        </Form >
      </BasicModal >
    );
  }
}
