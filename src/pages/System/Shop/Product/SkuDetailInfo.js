import React, { PureComponent } from "react";
import { Card, Form, Input, message, Table } from "antd";
import lodash from "lodash";
import * as utils from "@/utils/utils";

@Form.create()
export default class SkuDetailInfo extends PureComponent {

  constructor(props) {
    super(props);
    let skus = [];
    if (lodash.isArray(props.value)) {
      skus = [...props.value];
    }
    this.state = {
      skus,
      visibleBatchInput: false,
      batchInputValue: null,
      batchFlag: "stock"
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if ("value" in nextProps) {
      if (!utils.deepCompare(nextProps.value, prevState.skus)) {
        let skus = [];
        if (lodash.isArray(nextProps.value)) {
          skus = [...nextProps.value];
        }
        return {
          skus
        };
      }
    }
    return null;
  }

  /**
   * 批量修改
   */
  handleBatchInputSave = () => {
    const { batchInputValue, batchFlag, skus } = this.state;
    if (isNaN(batchInputValue)) {
      if (batchFlag === "price") {
        message.error("请输入数值");
        this.batchInput.focus();
        return;
      } else {
        message.error("请输入正整数");
        this.batchInput.focus();
        return;
      }
    }
    let newBatchInputValue = batchInputValue;
    if (batchFlag === "price") {
      newBatchInputValue = utils.numberFormat(batchInputValue, 2, null, "");
    } else {
      newBatchInputValue = utils.numberFormat(batchInputValue, 0, null, "");
    }
    const newSkus = skus.map((item) => {
      item[batchFlag] = newBatchInputValue;
      return item;
    });
    this.setState({ visibleBatchInput: false, batchInputValue: "", skus: newSkus });
    this.triggerChange(newSkus);
  };

  /**
   * 修改价格
   * @param value
   * @param index
   */
  handleValueChange = (value, fieldFlag, index) => {
    const newSkus = [...this.state.skus];
    newSkus[index][fieldFlag] = value;
    this.setState({ skus: newSkus });
    this.triggerChange(newSkus);
  };

  /**
   * 修改价格-失去焦点
   * @param value
   * @param index
   */
  handleValueBlur = (e, fieldFlag, index) => {
    const { value } = e.target;
    let newValue = value;
    if (isNaN(value)) {
      if (fieldFlag === "price" || fieldFlag === "cost") {
        message.error("请输入数值");
        newValue = 0;
      } else {
        message.error("请输入正整数");
        newValue = 0;
      }
      e.target.focus();
    }
    if (fieldFlag === "price" || fieldFlag === "cost") {
      newValue = utils.numberFormat(newValue, 2, null, "");
    } else {
      newValue = utils.numberFormat(newValue, 0, null, "");
    }
    const newSkus = [...this.state.skus];
    newSkus[index][fieldFlag] = newValue;
    this.setState({ skus: newSkus });
    this.triggerChange(newSkus);
  };


  /**
   * 触发change
   */
  triggerChange = (newSkus) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkus);
    }
  };


  /**
   *  计算rowSpans
   */
  calRowSpans = () => {
    const { specItems } = this.props;
    let entriesCount = 0;
    let rowSpans = [];
    const entries = specItems.map((item, index) => {
      if (entriesCount === 0) {
        entriesCount = item.entries.length;
      } else if (item.entries.length !== 0) {
        entriesCount *= item.entries.length;
      }
      rowSpans[index] = entriesCount;
      return item.entries;
    });
    const isOneSpec = (entries.length === 1);
    if (!isOneSpec) {
      rowSpans = rowSpans.map((rowSpan) => rowSpans[rowSpans.length - 1] / rowSpan);
      rowSpans.reverse();
    } else {
      rowSpans = null;
    }
    return rowSpans;
  };

  render() {
    const { specItems } = this.props;
    const { visibleBatchInput, skus } = this.state;
    const rowSpans = this.calRowSpans();
    const columns = [{
      title: <span ><span style={{ color: "red", marginRight: "4px" }} >*</span >价格(元)</span >,
      dataIndex: "price",
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => this.handleValueChange(e.target.value, "price", index)}
            onBlur={(e) => this.handleValueBlur(e, "price", index)}
            style={{ width: 100 }}
          />
        );
      }
    }, {
      title: <span ><span style={{ color: "red", marginRight: "4px" }} >*</span >库存</span >,
      dataIndex: "stock",
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => this.handleValueChange(e.target.value, "stock", index)}
            onBlur={(e) => this.handleValueBlur(e, "stock", index)}
            style={{ width: 100 }}
          />
        );
      }
    }, {
      title: "规格编码",
      dataIndex: "code",
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => this.handleValueChange(e.target.value, "code", index)}
            style={{ width: 100 }}
          />
        );
      }
    }, {
      title: "成本价",
      dataIndex: "cost",
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => this.handleValueChange(e.target.value, "cost", index)}
            onBlur={(e) => this.handleValueBlur(e, "cost", index)}
            style={{ width: 100 }}
          />
        );
      }
    }];

    // 插入列
    const newSpecItems = [...specItems].reverse();
    newSpecItems.map((item, index) => {
      columns.unshift({
        title: item.name,
        dataIndex: `specItem_${item.name}`,
        render: (value, row, renderIndex) => {
          if (rowSpans === null) {
            return value;
          } else {
            const rowSpan = rowSpans[index];
            const obj = {
              children: value,
              props: {}
            };
            if (renderIndex % rowSpan === 0) {
              obj.props.rowSpan = rowSpan;
            }
            if (renderIndex % rowSpan !== 0) {
              obj.props.rowSpan = 0;
            }
            return obj;
          }
        }
      });
      return null;
    });

    return (
      <Card >
        <Table
          bordered
          size="middle"
          columns={columns}
          dataSource={skus}
          pagination={false}
          footer={() => (
            <div >
              <span >批量设置：</span >
              {visibleBatchInput ?
                (
                  <span >
                    <Input
                      ref={(input) => {
                        if (input) {
                          this.batchInput = input.input;
                        }
                      }}
                      onChange={(e) => this.setState({ batchInputValue: e.target.value })}
                      style={{ width: 100 }}
                    />
                     <span
                       style={{ marginLeft: 10, color: "#3388ff", cursor: "pointer" }}
                       onClick={this.handleBatchInputSave}
                     >
                      保存
                     </span >
                   <span
                     style={{ marginLeft: 10, color: "#3388ff", cursor: "pointer" }}
                     onClick={() => {
                       this.batchInputValue = null;
                       this.setState({ visibleBatchInput: false });
                     }}
                   >
                      取消
                   </span >
                  </span >
                ) :
                (
                  <span >
                    <span
                      style={{ marginLeft: 10, color: "#3388ff", cursor: "pointer" }}
                      onClick={() => this.setState({ visibleBatchInput: true, batchFlag: "price" })}
                    >
                      价格
                    </span >
                    <span
                      style={{ marginLeft: 10, color: "#3388ff", cursor: "pointer" }}
                      onClick={() => this.setState({ visibleBatchInput: true, batchFlag: "stock" })}
                    >
                      库存
                    </span >
                  </span >
                )
              }
            </div >
          )}
        />
      </Card >
    );
  }
}
