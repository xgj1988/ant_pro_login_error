import React, { PureComponent } from 'react';
import { Button, Col, Form, Row, TreeSelect } from 'antd';
import ResetInput from '@/components/Common/Input/ResetInput';
import * as utils from '@/utils/utils';
import PermissionAuth from '@/utils/PermissionAuth';

const FormItem = Form.Item;

@Form.create()
export default class PermissionSearch extends PureComponent {
  handleFormSubmit = (e) => {
    e.preventDefault();
    const { form, handleFormSearch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleFormSearch(values);
      }
    });
  };

  handleFormClick = () => {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    handleFormReset();
  };

  render() {
    const { form: { getFieldDecorator }, menuList } = this.props;
    return (
      <PermissionAuth permissions="system:permission:view">
        <Form onSubmit={this.handleFormSubmit} layout="inline">
          <Row gutter={{ md: 24, lg: 24, xl: 48 }} type="flex" justify="start">
            <Col>
              <FormItem label="名字">
                {getFieldDecorator('name_$search')(
                  <ResetInput />
                )}
              </FormItem>
              <FormItem label="菜单">
                {getFieldDecorator('menuId_$search')(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 500 }}
                    style={{ width: '200px' }}
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                  >
                    {utils.renderTreeNodes(menuList)}
                  </TreeSelect>
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleFormClick}>
                  重置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </PermissionAuth>
    );
  }
}
