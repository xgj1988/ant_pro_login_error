import React, { PureComponent } from "react";
import { Form, Input, InputNumber } from "antd";
import BasicModal from "@/components/Common/Modal/BasicModal";
import FileUpload from "@/components/Common/Upload/FileUpload";
import * as utils from "@/utils/utils";
import Ueditor from "@/components/Ueditor";

const FormItem = Form.Item;
@Form.create()
export default class BrandModal extends PureComponent {
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
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 22 }
      }
    };
    return (
      <BasicModal
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        addFlag={addFlag}
        onOk={this.handleModalOk}
        width="1000px"
      >
        <Form >
          <FormItem
            hasFeedback
            {...formLayout}
            label="名称"
          >
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入品牌名称" }],
              initialValue: currentItem.name
            })(
              <Input
                autoFocus
                maxLength={200}
              />
            )}
          </FormItem >
          <FormItem
            {...formLayout}
            label="序号"
          >
            {getFieldDecorator("orders", {
              initialValue: initOrder,
              rules: [{ required: true, message: "请输入序号" }]
            })(<InputNumber min={1} max={65535} />)}
          </FormItem >
          <FormItem
            {...formLayout}
            label="网站"
          >
            {getFieldDecorator("url", {
              initialValue: currentItem.url
            })(
              <Input maxLength={200} />
            )}
          </FormItem >
          <FormItem
            {...formLayout}
            label="LOGO"
          >
            {getFieldDecorator("logo", {
              initialValue: currentItem.logo
            })(
              <FileUpload
                accept="image/*"
                listType="picture-card"
                fileNum={1}
                fileMetas={["image/jpeg", "image/png", "image/gif"]}
              />
            )}
          </FormItem >
          <FormItem
            {...formLayout}
            label="介绍"
          >
            {getFieldDecorator("introduction", {
              initialValue: currentItem.introduction
            })(
              <Ueditor id="introduction" height="200" />
            )}
          </FormItem >
        </Form >
      </BasicModal >
    );
  }
}
