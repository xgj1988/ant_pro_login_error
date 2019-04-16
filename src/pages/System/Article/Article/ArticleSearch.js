import React, { PureComponent } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import ResetInput from '@/components/Common/Input/ResetInput';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class ArticleSearch extends PureComponent {
  /**
   * 表单提交
   * @param e
   */
  handleFormSubmit = (e) => {
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
    const { form: { getFieldDecorator }, articleTags, articleStates, searchParam = {} } = this.props;
    const articleTagChildren = [];
    for (const articleTag of articleTags) {
      articleTagChildren.push(
        <Option
          key={articleTag.id}
          title={articleTag.name}
          value={articleTag.id}
        >
          {articleTag.name}
        </Option >
      );
    }
    const articleStateChildren = [];
    for (const articleState of articleStates) {
      articleStateChildren.push(
        <Option
          key={articleState.enum}
          title={articleState.enum}
          value={articleState.enum}
        >
          {articleState.desc}
        </Option >
      );
    }
    return (
      <Form onSubmit={this.handleFormSubmit} layout="inline" >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }} type="flex" justify="start" >
          <Col >
            <FormItem label="标题" >
              {getFieldDecorator('title_$search')(
                <ResetInput />
              )}
            </FormItem >
            <FormItem label="标签" >
              {getFieldDecorator('articleTagIds_$search')(
                <Select
                  allowClear
                  showSearch
                  style={{ width: '180px' }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  mode="multiple"
                  placeholder="选择标签"
                >
                  {articleTagChildren}
                </Select >
              )}
            </FormItem >
            <FormItem label="状态" >
              {getFieldDecorator('state_$search', { initialValue: searchParam.state })(
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  style={{ width: '180px' }}
                  placeholder="选择状态"
                >
                  {articleStateChildren}
                </Select >
              )}
            </FormItem >
            <FormItem >
              <Button type="primary" htmlType="submit" >
                查询
              </Button >
            </FormItem >
            <FormItem >
              <Button onClick={this.handleFormClick} >
                重置
              </Button >
            </FormItem >
          </Col >
        </Row >
      </Form >
    );
  }
}
