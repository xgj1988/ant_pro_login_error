import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, TreeSelect, Row, Col } from 'antd';
import * as utils from '@/utils/utils';
import BasicModal from '@/components/Common/Modal/BasicModal';
import FileUpload from '@/components/Common/Upload/FileUpload';

const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
export default class AreaModal extends PureComponent {
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
            'children'
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 18 }
      }
    };
    return (
      <BasicModal
        addFlag={addFlag}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
        width="1000px"
      >
        <Form >
          <Row >
            <Col md={12} xs={24} >
              <FormItem hasFeedback {...formItemLayout} label="名字" >
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [{ required: true, message: '请输入地区名字' }]
                })(<Input style={{ width: 200 }} />)}
              </FormItem >
            </Col >
            <Col md={12} xs={24} >
              <FormItem {...formItemLayout} label="序号" >
                {getFieldDecorator('orders', {
                  initialValue: initOrder,
                  rules: [{ required: true, message: '请输入序号' }]
                })(<InputNumber min={1} max={65535} />)}
              </FormItem >
            </Col >
          </Row >
          <Row >
            <Col md={12} xs={24} >
              <FormItem hasFeedback {...formItemLayout} label="封面" >
                {getFieldDecorator('cover', {
                  rules: [{ required: true, message: '请上传封面' }],
                  initialValue: currentItem.cover
                })(
                  <FileUpload
                    accept="image/*"
                    listType="picture-card"
                    fileNum={1}
                    fileMetas={['image/jpeg', 'image/png', 'image/gif']}
                  />
                )}
              </FormItem >
            </Col >
            <Col md={12} xs={24} >
              <FormItem hasFeedback {...formItemLayout} label="轮播图片" >
                {getFieldDecorator('images', {
                  rules: [{ required: true, message: '请上传轮播图片' }],
                  initialValue: currentItem.images
                })(
                  <FileUpload
                    accept="image/*"
                    listType="picture-card"
                    fileNum={5}
                    fileMetas={['image/jpeg', 'image/png', 'image/gif']}
                  />
                )}
              </FormItem >
            </Col >
          </Row >
          <Row >
            <Col md={12} xs={24} >
              <FormItem {...formItemLayout} label="纬度" >
                {getFieldDecorator('latitude', {
                  initialValue: currentItem.latitude
                })(<InputNumber min={1} max={65535} />)}
              </FormItem >
            </Col >
            <Col md={12} xs={24} >
              <FormItem {...formItemLayout} label="经度" >
                {getFieldDecorator('longitude', {
                  initialValue: currentItem.longitude
                })(<InputNumber min={1} max={65535} />)}
              </FormItem >
            </Col >
          </Row >
          <Row >
            <Col md={12} xs={24} >
              <FormItem hasFeedback {...formItemLayout} label="上级地区" >
                {getFieldDecorator('parentId', {
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
            </Col >
            <Col md={12} xs={24} >
              <FormItem {...formItemLayout} label="交通信息" >
                {getFieldDecorator('trafficInfo', {
                  initialValue: currentItem.trafficInfo
                })(<TextArea autosize={{ minRows: 4, maxRows: 6 }} />)}
              </FormItem >
            </Col >
          </Row >
          <Row >
            <Col md={12} xs={24} >
              <FormItem {...formItemLayout} label="电话信息" >
                {getFieldDecorator('telephone', {
                  initialValue: currentItem.telephone
                })(<Input />)}
              </FormItem >
            </Col >
          </Row >
        </Form >
      </BasicModal >
    );
  }
}
