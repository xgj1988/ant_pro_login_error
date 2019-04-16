import React, { PureComponent } from "react";
import { Col, DatePicker, Radio, Row } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";

const RadioGroup = Radio.Group;
export default class MarketInfo extends PureComponent {

  render() {
    return (
      <div >
        <div >
          <RadioGroup >
            <Row >
              <Col span={8} >
                <Radio value={1} >立即上架售卖 </Radio >
              </Col >
            </Row >
            <Row >
              <Col span={8} >
                <Radio value={1} >自定义上架时间
                  <DatePicker style={{ marginLeft: 12 }} locale={locale} />
                </Radio >
              </Col >
            </Row >
            <Row >
              <Col span={8} >
                <Radio value={1} >暂不售卖，放入仓库 </Radio >
              </Col >
            </Row >
          </RadioGroup >
        </div >
      </div >
    );
  }
}
