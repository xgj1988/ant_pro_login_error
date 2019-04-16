import React, { PureComponent } from 'react';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Row } from 'antd';
import ResetInput from '@/components/Common/Input/ResetInput';
import PermissionAuth from '@/utils/PermissionAuth';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;

@Form.create()
export default class AdminSearch extends PureComponent {
  handleFormSubmit = (e) => {
    e.preventDefault();
    const {form, handleFormSearch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleFormSearch(values);
      }
    });
  };

  handleFormClick = () => {
    const {form, handleFormReset} = this.props;
    form.resetFields();
    handleFormReset();
  };

  render() {
    const {form: {getFieldDecorator}, handleLastLoginDateChange} = this.props;
    return (
      <PermissionAuth permissions="system:admin:view">
        <Form onSubmit={this.handleFormSubmit} layout="inline">
          <Row gutter={{md: 24, lg: 24, xl: 48}} type="flex" justify="start">
            <Col>
              <FormItem label="用户名">
                {getFieldDecorator('username_$search')(
                  <ResetInput />
                )}
              </FormItem>
              <FormItem label="最后登录日期">
                <RangePicker
                  onChange={handleLastLoginDateChange}
                  dateRender={(current) => {
                    const style = {};
                    if (current.date() === 1) {
                      style.border = '1px solid #1890ff';
                      style.borderRadius = '50%';
                    }
                    return (
                      <div className="ant-calendar-date" style={style}>
                        {current.date()}
                      </div>
                    );
                  }}
                  ranges={{今天: [moment(), moment()], 这个月: [moment().startOf('month'), moment().endOf('month')]}}
                />
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
