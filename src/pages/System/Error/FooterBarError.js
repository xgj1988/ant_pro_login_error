import React, { Fragment, PureComponent } from "react";
import {
  AutoComplete,
  BackTop,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Tooltip
} from "antd";
import { connect } from "dva";
import FooterToolbar from "@/components/FooterToolbar";


@Form.create()
@connect()
export default class ProductModal extends PureComponent {


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    return (
      <Fragment >

        <Form {...formItemLayout} onSubmit={this.handleSubmit} >
          <Card bordered={false} >
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" >Register</Button >
            </Form.Item >
            <Form.Item
              label="E-mail"
            >
              {getFieldDecorator("email", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail!"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail2"
            >
              {getFieldDecorator("email2", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail!2"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail3"
            >
              {getFieldDecorator("email3", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail3"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail4"
            >
              {getFieldDecorator("email4", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail4!"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail5"
            >
              {getFieldDecorator("email5", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail5!"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail6"
            >
              {getFieldDecorator("email6", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail6!"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="E-mail7"
            >
              {getFieldDecorator("email7", {
                rules: [{
                  type: "email", message: "The input is not valid E-mail7!"
                }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="Password"
            >
              {getFieldDecorator("password", {
                rules: [{
                  required: true, message: "Please input your password!"
                }]
              })(
                <Input type="password" />
              )}
            </Form.Item >
            <Form.Item
              label="Confirm Password"
            >
              {getFieldDecorator("confirm", {
                rules: [{
                  required: true, message: "Please confirm your password!"
                }]
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </Form.Item >
            <Form.Item
              label={(
                <span >
                    Nickname&nbsp;
                  <Tooltip title="What do you want others to call you?" >
                <Icon type="question-circle-o" />
                  </Tooltip >
                </span >
              )}
            >
              {getFieldDecorator("nickname", {
                rules: [{ required: true, message: "Please input your nickname!", whitespace: true }]
              })(
                <Input />
              )}
            </Form.Item >
            <Form.Item
              label="Habitual Residence"
            >
              {getFieldDecorator("residence", {
                initialValue: ["zhejiang", "hangzhou", "xihu"],
                rules: [{ type: "array", required: true, message: "Please select your habitual residence!" }]
              })(
                <Cascader />
              )}
            </Form.Item >
            <Form.Item
              label="Phone Number"
            >
              {getFieldDecorator("phone", {
                rules: [{ required: true, message: "Please input your phone number!" }]
              })(
                <Input style={{ width: "100%" }} />
              )}
            </Form.Item >
            <Form.Item
              label="Website"
            >
              {getFieldDecorator("website", {
                rules: [{ required: true, message: "Please input website!" }]
              })(
                <AutoComplete
                  onChange={this.handleWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete >
              )}
            </Form.Item >
            <Form.Item
              label="Captcha"
              extra="We must make sure that your are a human."
            >
              <Row gutter={8} >
                <Col span={12} >
                  {getFieldDecorator("captcha", {
                    rules: [{ required: true, message: "Please input the captcha you got!" }]
                  })(
                    <Input />
                  )}
                </Col >
                <Col span={12} >
                  <Button >Get captcha</Button >
                </Col >
              </Row >
            </Form.Item >
            <Form.Item {...tailFormItemLayout}>
              {getFieldDecorator("agreement", {
                valuePropName: "checked"
              })(
                <Checkbox >I have read the <a href="" >agreement</a ></Checkbox >
              )}
            </Form.Item >
            <Form.Item
              label="Website2"
            >
              {getFieldDecorator("website2", {
                rules: [{ required: true, message: "Please input website2!" }]
              })(
                <AutoComplete
                  onChange={this.handleWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete >
              )}
            </Form.Item >
            <Form.Item
              label="Website3"
            >
              {getFieldDecorator("website3", {
                rules: [{ required: true, message: "Please input website3!" }]
              })(
                <AutoComplete
                  onChange={this.handleWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete >
              )}
            </Form.Item >
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" >Register</Button >
            </Form.Item >
          </Card >
          <FooterToolbar >
            <div style={{
              margin: "0 auto",
              width: 800
            }}
            >
              <Button type="primary" onClick={this.handleSubmit} >保存</Button >
            </div >
          </FooterToolbar >
          <BackTop />
        </Form >
      </Fragment >
    );
  }
}
