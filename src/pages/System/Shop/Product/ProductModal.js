import React, { PureComponent } from "react";
import { Form, Input, InputNumber } from "antd";
import BasicModal from "@/components/Common/Modal/BasicModal";
import Constant from "@/utils/Constant";
import * as utils from "@/utils/utils";
import FileUpload from "@/components/Common/Upload/FileUpload";

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
export default class ProductModal extends PureComponent {
  handleModalOk = (addFlag, modalVisible) => {
    const { form, handleFormSubmit, handleModalVisible, currentItem } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = values;
        if (!addFlag) {
          newValues = utils.copyJsonIgnoreCommonFields(currentItem, { ...values });
        }
        handleFormSubmit(addFlag, newValues, (success) => {
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
    const { form, visible, title, handleModalVisible, currentItem = {} } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    let initOrder = 99;
    if (!addFlag) {
      initOrder = currentItem.orders;
    }
    return (
      <BasicModal
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        addFlag={addFlag}
        onOk={this.handleModalOk}
      >
        <Form >
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="名称"
          >
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称" }],
              initialValue: currentItem.name
            })(
              <Input
                autoFocus
                maxLength={200}
              />
            )}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="序号" >
            {getFieldDecorator("orders", {
              initialValue: initOrder,
              rules: [{ required: true, message: "请输入序号" }]
            })(<InputNumber min={1} max={65535} />)}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="图标(18*18)" >
            {getFieldDecorator("icon", {
              rules: [{ required: true, message: "请上传图标" }],
              initialValue: currentItem.icon
            })(
              <FileUpload
                accept="image/*"
                listType="picture-card"
                fileNum={1}
                fileMetas={["image/jpeg", "image/png", "image/gif"]}
              />
            )}
          </FormItem >
          <FormItem {...Constant.formItemLayout} label="备注" >
            {getFieldDecorator("memo", {
              rules: [{ required: false, message: "请输入备注" }],
              initialValue: currentItem.memo
            })(
              <TextArea
                maxLength={200}
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </FormItem >
        </Form >
      </BasicModal >
    );
  }
}
