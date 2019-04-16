import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import BasicModal from '@/components/Common/Modal/BasicModal';

const {TextArea} = Input;
const FormItem = Form.Item;
@Form.create()
export default class RoleModal extends PureComponent {
  handleModalOk = (addFlag, modalVisible) => {
    const {form, handleFormSubmit, handleModalVisible, currentItem} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = values;
        if (!addFlag) {
          newValues = utils.copyJsonIgnoreCommonFields(currentItem, {...values});
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

  handleShow = () => {
    setTimeout(() => {
      if (this.nameInput && this.nameInput.focus) {
        this.nameInput.focus();
      }
    });
  };

  render() {
    const {form, visible, handleModalVisible, title, currentItem = {}} = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const {getFieldDecorator} = form;

    return (
      <BasicModal
        onShow={this.handleShow}
        addFlag={addFlag}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="名字"
          >
            {getFieldDecorator('name', {
              initialValue: currentItem.name,
              rules: [{required: true, message: '请输入名字'}],
            })(
              <Input
                ref={(input) => {
                  this.nameInput = input;
                }}
                maxLength={20}
              />
            )}
          </FormItem>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: currentItem.description,
            })(
              <TextArea maxLength={200} />
            )}
          </FormItem>
        </Form>
      </BasicModal>
    );
  }
}
