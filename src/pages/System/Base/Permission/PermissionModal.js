import React, { PureComponent } from 'react';
import { Form, Input, TreeSelect } from 'antd';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import BasicModal from '@/components/Common/Modal/BasicModal';

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
export default class PermissionModal extends PureComponent {
  handleModalOk = (addFlag, modalVisible) => {
    const { form, handleFormSubmit, handleModalVisible, currentItem } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = values;
        if (!addFlag) {
          newValues = utils.copyJsonIgnoreCommonFields(currentItem, { ...values }, 'menu');
        }
        handleFormSubmit(addFlag, newValues, (success) => {
          if (addFlag) {
            if (success && modalVisible) {
              form.resetFields(['name']);
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
    const { form, visible, handleModalVisible, title, currentItem = {}, menuList } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    let defaultMenuId = null;
    if (!addFlag) {
      defaultMenuId = currentItem.menuId;
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
        <Form>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="名字"
          >
            {getFieldDecorator('name', {
              initialValue: currentItem.name,
              rules: [{ required: true, message: '请输入名字' }],
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
            label="菜单"
          >
            {getFieldDecorator('menuId', {
              initialValue: defaultMenuId,
              rules: [{ required: true, message: '请选择菜单' }]
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 500 }}
                allowClear
                showSearch
                treeNodeFilterProp="title"
              >
                {utils.renderTreeNodes(menuList)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="标识"
          >
            {getFieldDecorator('value', {
              initialValue: currentItem.value,
              rules: [{ required: true, type: 'string', pattern: /system:.+/, message: '必须system:开头' }]
            })(
              <Input maxLength={200} />
            )}
          </FormItem>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="URL"
          >
            {getFieldDecorator('url', {
              initialValue: currentItem.url,
              rules: [{ required: true, message: '请输入URL地址' }]
            })(
              <TextArea
                maxLength={200}
                autosize={{ minRows: 4 }}
              />
            )}
          </FormItem>
        </Form>
      </BasicModal>
    );
  }
}
