import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, TreeSelect } from 'antd';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import BasicModal from '@/components/Common/Modal/BasicModal';

const FormItem = Form.Item;
@Form.create()
export default class MenuModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { orders: 1 };
  }

  setOrder = (currentItem, listData) => {
    let orders = 1;
    if (listData.length > 0) {
      orders = listData[listData.length - 1].orders + 1;
    } else {
      orders = 1;
    }
    this.setState({ orders });
  };

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
            'parentId'
          );
        }
        delete newValues.children;
        delete newValues.permissions;
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
    const { treeData = [], currentItem = {} } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    if (!addFlag) {
      this.setState({ orders: currentItem.orders });
    } else {
      this.setOrder(currentItem, treeData);
    }
    setTimeout(() => {
      if (this.nameInput && this.nameInput.focus) {
        this.nameInput.focus();
      }
    });
  };

  handleParentIdSelect = value => {
    const { treeData = [], currentItem = [] } = this.props;
    const menu = utils.findTreeNodeById(treeData, value);
    let childrenTmp = [];
    if (!utils.isNull(menu)) {
      const { children } = menu;
      if (!utils.isNull(children) && children.length > 0) {
        childrenTmp = children;
      }
    }
    this.setOrder(currentItem, childrenTmp);
  };

  render() {
    const {
      form,
      visible,
      handleModalVisible,
      title,
      currentItem = {},
      treeData = []
    } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    const { orders } = this.state;
    let defaultParentId = null;
    if (!utils.isNull(currentItem.parentId)) {
      defaultParentId = currentItem.parentId;
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
          <FormItem hasFeedback {...Constant.formItemLayout} label="名字">
            {getFieldDecorator('name', {
              initialValue: currentItem.name,
              rules: [{ required: true, message: '请输入名字' }]
            })(
              <Input
                ref={input => {
                  this.nameInput = input;
                }}
                maxLength={20}
              />
            )}
          </FormItem>
          <FormItem hasFeedback {...Constant.formItemLayout} label="上级菜单">
            {getFieldDecorator('parentId', {
              initialValue: defaultParentId
            })(
              <TreeSelect
                allowClear
                showSearch
                onSelect={this.handleParentIdSelect}
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
              </TreeSelect>
            )}
          </FormItem>
          <FormItem {...Constant.formItemLayout} label="序号">
            {getFieldDecorator('orders', {
              initialValue: orders,
              rules: [{ required: true, message: '请输入序号' }]
            })(<InputNumber min={1} />)}
          </FormItem>
          <FormItem hasFeedback {...Constant.formItemLayout} label="路径">
            {getFieldDecorator('path', {
              initialValue: currentItem.path,
              rules: [{ required: true, message: '请输入路径' }]
            })(<Input maxLength={200} />)}
          </FormItem>
          <FormItem hasFeedback {...Constant.formItemLayout} label="图标">
            {getFieldDecorator('icon', {
              initialValue: currentItem.icon
            })(<Input maxLength={200} />)}
          </FormItem>
          <FormItem hasFeedback {...Constant.formItemLayout} label="样式类名">
            {getFieldDecorator('className', {
              initialValue: currentItem.className
            })(<Input maxLength={200} />)}
          </FormItem>
        </Form>
      </BasicModal>
    );
  }
}
