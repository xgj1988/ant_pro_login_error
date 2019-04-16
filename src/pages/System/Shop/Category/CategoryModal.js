import React, { PureComponent } from "react";
import { Form, Input, InputNumber, TreeSelect } from "antd";
import * as utils from "@/utils/utils";
import Constant from "@/utils/Constant";
import BasicModal from "@/components/Common/Modal/BasicModal";

const FormItem = Form.Item;
@Form.create()
export default class CategoryModal extends PureComponent {
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
          newValues = utils.copyJsonIgnoreCommonFields(
            currentItem,
            { ...values },
            "children"
          );
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

  render() {
    const {
      form,
      visible,
      handleModalVisible,
      title,
      currentItem = {},
      treeData = {}
    } = this.props;
    let initOrder = 99;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    let defaultParentId = null;
    if (!addFlag) {
      if (!utils.isNull(currentItem.parentId)) {
        defaultParentId = currentItem.parentId;
      }
      initOrder = currentItem.orders;
    }
    return (
      <BasicModal
        addFlag={addFlag}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <Form >
          <FormItem hasFeedback {...Constant.formItemLayout} label="名字" >
            {getFieldDecorator("name", {
              initialValue: currentItem.name,
              rules: [{ required: true, message: "请输入名字" }]
            })(<Input style={{ width: 200 }} />)}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="序号" >
            {getFieldDecorator("orders", {
              initialValue: initOrder,
              rules: [{ required: true, message: "请输入序号" }]
            })(<InputNumber min={1} max={65535} />)}
          </FormItem >
          <FormItem hasFeedback {...Constant.formItemLayout} label="上级地区" >
            {getFieldDecorator("parentId", {
              initialValue: defaultParentId
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 500 }}
                style={{ width: 200 }}
                allowClear
                showSearch
                treeNodeFilterProp="title"
              >
                {utils.renderTreeNodes(treeData, null, null, item => {
                  const result = {};
                  const parentIdPath = `,${currentItem.id},`;
                  if (utils.isNull(item.parentId)) {
                    return result;
                  }
                  if (
                    item.id === currentItem.id ||
                    item.treePath.indexOf(parentIdPath) > 0
                  ) {
                    return { disabled: true };
                  }
                  return result;
                })}
              </TreeSelect >
            )}
          </FormItem >
        </Form >
      </BasicModal >
    );
  }
}
