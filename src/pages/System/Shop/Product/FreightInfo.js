import React, { PureComponent } from "react";
import { Col, Input, message, Radio, Row } from "antd";
import * as utils from "@/utils/utils";

const RadioGroup = Radio.Group;
export default class FreightInfo extends PureComponent {
  constructor(props) {
    super(props);
    let value = {};
    if (!utils.isEmptyObject(props.value)) {
      value = props.value;
    }
    this.state = { ...value };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (utils.isNull(nextProps.value)) {
        return {
          type: "uniformFreight",
          freight: "",
          freightTempleteId: ""
        };
      } else if (!utils.deepCompare(nextProps.value, prevState)) {
        return { ...nextProps.value };
      }
    }
    return null;
  }


  /**
   * 触发change
   */
  triggerChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...value });
    }
  };

  render() {
    const { freight, type } = this.state;
    return (
      <div >
        <div >
          <RadioGroup
            value={type}
            onChange={(e) => {
              const newValue = { ...this.state, type: e.target.value };
              this.setState(newValue);
              this.triggerChange(newValue);
            }}
          >
            <Row >
              <Col span={8} >
                <Radio value="uniformFreight" >统一邮费
                  <Input
                    maxLength={10}
                    addonBefore="¥"
                    style={{ marginLeft: 12, width: 200 }}
                    value={freight}
                    onChange={(e) => {
                      const newValue = { ...this.state, freight: e.target.value };
                      this.setState(newValue);
                      this.triggerChange(newValue);
                    }}
                    onBlur={(e) => {
                      const { value } = e.target;
                      if (utils.isEmptyStr(value)) {
                        return;
                      }
                      if (isNaN(value)) {
                        message.error("请输入数值");
                        e.target.focus();
                        return;
                      }
                      const newFreight = utils.numberFormat(value, 2, null, "");
                      const newValue = { ...this.state, freight: newFreight };
                      this.setState(newValue);
                      this.triggerChange(newValue);
                    }}
                  />
                </Radio >
              </Col >
            </Row >
            { /*
              <Row >
              <Col span={8} >
                <Radio value="templeteFreight" >运费模板
                  <Select
                    defaultValue={freightTempleteId}
                    showSearch
                    style={{ marginLeft: 12, width: 200 }}
                    placeholder="请选择运费模板"
                    optionFilterProp="children"
                    onChange={(value) => {
                      const newValue = { ...this.state, freightTempleteId: value };
                      this.setState(newValue);
                      this.triggerChange(newValue);
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="jack" >Jack</Option >
                    <Option value="lucy" >Lucy</Option >
                    <Option value="tom" >Tom</Option >
                  </Select >
                </Radio >
              </Col >
            </Row >
            */
            }
          </RadioGroup >
        </div >
      </div >
    );
  }
}
