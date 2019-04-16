import React, { PureComponent } from 'react';
import { Button, Col, Form, Row } from 'antd';
import ResetInput from '@/components/Common/Input/ResetInput';

const FormItem = Form.Item;

@Form.create()
export default class MenuSearch extends PureComponent {
  handleFormSubmit = e => {
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
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleFormSubmit} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }} type="flex" justify="start">
          <Col>
            <FormItem label="顶级区域名字">
              {getFieldDecorator('name_$search')(<ResetInput />)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleFormClick}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
