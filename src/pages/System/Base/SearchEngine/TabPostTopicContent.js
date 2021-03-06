import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import PermissionAuth from '@/utils/PermissionAuth';

const FormItem = Form.Item;
const {TextArea} = Input;

@Form.create()
export default class TabPostTopicContent extends PureComponent {
  handleProductSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
          const params = utils.copyJsonIgnoreCommonFields(values, this.props.currentPostTopicMapping);
          params.value = values.postTopicValue;
          delete params.postTopicValue;
          this.props.handleMappingSubmit(params);
        }
      }
    );
  };

  validatorJson = (rule, value, callback) => {
    const errors = [];
    try {
      const obj = JSON.parse(value);
      if (typeof obj !== 'object' || !obj) {
        errors.push(new Error('json格式异常'));
      }
    } catch (e) {
      errors.push(new Error('json格式异常'));
    }
    callback(errors);
  };

  handleRebuildProductMapping = (e) => {
    e.preventDefault();
    const {handleRebuildIndexSubmit, currentPostTopicMapping} = this.props;
    handleRebuildIndexSubmit(currentPostTopicMapping);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {currentPostTopicMapping = {}, submitLoading, rebuildLoading} = this.props;
    return (
      <div>
        <Form onSubmit={this.handleProductSubmit}>
          <FormItem {...Constant.formItemLayout} label="话题Mapping">
            {getFieldDecorator('postTopicValue', {
              initialValue: currentPostTopicMapping.value,
              rules: [{
                required: true, validator: this.validatorJson,
              }],
            })(
              <TextArea
                rows={18}
              />
            )}
          </FormItem>
          <PermissionAuth permissions="system:search_engine_mapping:rebuild">
            <FormItem {...Constant.formItemLayout} label="重建话题索引">
              <Button onClick={this.handleRebuildProductMapping} loading={rebuildLoading}>

                开始执行
              </Button>
            </FormItem>
          </PermissionAuth>
          <PermissionAuth permissions="system:search_engine_mapping:update">
            <FormItem {...Constant.submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitLoading}>

                保存
              </Button>
            </FormItem>
          </PermissionAuth>
        </Form>
      </div>
    );
  }
}
