import React, { PureComponent } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import ResetInput from '@/components/Common/Input/ResetInput';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class HomeContentSearch extends PureComponent {
  /**
   * 表单提交
   * @param e
   */
  handleFormSubmit = e => {
    e.preventDefault();
    const { form, handleFormSearch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleFormSearch(values);
      }
    });
  };

  /**
   * 重置搜索
   */
  handleFormClick = () => {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    handleFormReset();
  };

  render() {
    const {
      form: { getFieldDecorator },
      positionTypes = []
    } = this.props;
    const positionTypeChildren = [];
    for (const positionType of positionTypes) {
      positionTypeChildren.push(
        <Option
          key={positionType.enum}
          title={positionType.enum}
          value={positionType.enum}
        >
          {positionType.desc}
        </Option>
      );
    }
    return (
      <Form onSubmit={this.handleFormSubmit} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }} type="flex" justify="start">
          <Col>
            <FormItem label="名称">
              {getFieldDecorator('name_$search')(<ResetInput />)}
            </FormItem>
            <FormItem label="位置">
              {getFieldDecorator('position_$search')(
                <Select
                  style={{ width: '170px' }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="选择位置"
                >
                  {positionTypeChildren}
                </Select>
              )}
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
