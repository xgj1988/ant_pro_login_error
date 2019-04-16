import React, { PureComponent } from "react";
import { DatePicker, Form, Input, InputNumber, Radio, Select, Switch, Tooltip } from "antd";
import moment from "moment";
import BasicModal from "@/components/Common/Modal/BasicModal";
import Constant from "@/utils/Constant";
import * as utils from "@/utils/utils";
import FileUpload from "@/components/Common/Upload/FileUpload";
import ProductInput from "@/components/Common/Product/ProductInput";
import CategoryInput from "@/components/Common/Category/CategoryInput";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
@Form.create()
export default class HomeContentModal extends PureComponent {
  constructor(props) {
    super(props);
    const { currentItem } = this.props;
    let contentType = "ARTICLE";
    if (!utils.isEmptyObject(currentItem)) {
      contentType = currentItem.type.enum;
    }
    this.state = {
      contentType
    };
  }

  handleShow = () => {
    setTimeout(() => {
      if (this.name && this.name.focus) {
        this.name.focus();
      }
    });
    const { currentItem } = this.props;
    if (!utils.isEmptyObject(currentItem)) {
      this.setState({ contentType: currentItem.type.enum });
    }
  };

  generateContenetTypeInput = (getFieldDecorator) => {
    const { currentItem, productTags = [] } = this.props;
    const { contentType } = this.state;
    let ChildrenDom = null;
    let label = null;
    let fieldName = "contentId";
    let initialValue = null;
    if (!utils.isEmptyObject(currentItem)) {
      if (currentItem.type.enum === "CATEGORY" && contentType === "CATEGORY") {
        initialValue = currentItem.category;
      } else if (currentItem.type.enum === "PRODUCT_TAG" && contentType === "PRODUCT_TAG") {
        initialValue = currentItem.productTag;
      } else if (currentItem.type.enum === "PRODUCT" && contentType === "PRODUCT") {
        initialValue = currentItem.product;
      } else if (currentItem.type.enum === "EXTERNAL_URL" && contentType === "EXTERNAL_URL") {
        initialValue = currentItem.url;
      }
    }
    if (contentType === "PRODUCT") {
      ChildrenDom = <ProductInput inlineMode={false}/>;
      label = "选择商品";
    } else if (contentType === "CATEGORY") {
      ChildrenDom = <CategoryInput inlineMode={false}/>;
      label = "选择类别";
    } else if (contentType === "PRODUCT_TAG") {
      const productTagChildren = [];
      for (const productTag of productTags) {
        productTagChildren.push(
          <Option
            key={productTag.id}
            title={productTag.name}
            value={productTag.id}
          >
            {productTag.name}
          </Option>
        );
      }
      ChildrenDom = (
        <Select
          allowClear
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="选择商品标签"
        >
          {productTagChildren}
        </Select>
      );
      label = "选择商品标签";
    } else if (contentType === "EXTERNAL_URL") {
      ChildrenDom = <Input maxLength="200"/>;
      label = "外部地址";
      fieldName = "url";
    } else {
      return null;
    }
    return (
      <FormItem
        {...Constant.formItemLayout}
        label={label}
      >
        {getFieldDecorator(fieldName, {
          initialValue,
          rules: [{ required: true, message: `请${label}` }]
        })(
          ChildrenDom
        )}
      </FormItem>
    );
  };

  handleModalOk = (addFlag, modalVisible) => {
    const { form, handleFormSubmit, handleModalVisible, currentItem } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const newValues = utils.copyJsonIgnoreCommonFields(currentItem, { ...values }, "productTag", "category", "product");
        if (newValues.contentId && !(typeof newValues.contentId === "string")) {
          newValues.contentId = newValues.contentId.id;
        }
        const { showDate } = newValues;
        newValues.startDate = showDate[0].format("YYYY-MM-DD 0:0:0");
        newValues.endDate = showDate[1].format("YYYY-MM-DD 23:59:59");
        delete newValues.showDate;
        newValues.type = this.state.contentType;
        handleFormSubmit(addFlag, newValues, (success) => {
          if (addFlag) {
            if (success && modalVisible) {
              form.resetFields();
            } else if (success && !modalVisible) {
              handleModalVisible(false);
            }
          } else if (!addFlag && success) {
            handleModalVisible(false);
          }
        });
      }
    });
  };

  generateUrlTitleInput = (getFieldDecorator) => {
    const { contentType } = this.state;
    let ChildrenDom = null;
    let label = null;
    const valuePropName = "value";
    const fieldName = "urlTitle";
    let initialValue = null;
    const { currentItem } = this.props;
    if (!utils.isEmptyObject(currentItem)) {
      if (currentItem.type.enum === "EXTERNAL_URL" && contentType === "EXTERNAL_URL") {
        initialValue = currentItem.urlTitle;
      }
    }
    if (contentType === "EXTERNAL_URL") {
      ChildrenDom = <Input maxLength="200"/>;
      label = "URL标题";
    } else {
      return null;
    }
    return (
      <FormItem
        {...Constant.formItemLayout}
        label={label}
      >
        {getFieldDecorator(fieldName, {
          initialValue,
          valuePropName,
          rules: [{ required: true, message: `请${label}` }]
        })(
          ChildrenDom
        )}
      </FormItem>
    );
  };


  render() {
    const { form, visible, title, handleModalVisible, currentItem = {}, positionTypes = [] } = this.props;
    const { contentType } = this.state;
    const addFlag = utils.isEmptyObject(currentItem);
    let initOrder = 99;
    const defaultShowDate = [];
    const { getFieldDecorator } = form;
    let defaultPositionVal = null;
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
    if (!addFlag) {
      defaultPositionVal = currentItem.position.enum;
      initOrder = currentItem.orders;
      if (currentItem.startDate && currentItem.endDate) {
        defaultShowDate.push(moment(currentItem.startDate));
        defaultShowDate.push(moment(currentItem.endDate));
      }
    }
    return (
      <BasicModal
        width={800}
        onShow={this.handleShow}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        addFlag={addFlag}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="名称"
          >
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称" }],
              initialValue: currentItem.name
            })(
              <Input
                ref={(input) => {
                  this.name = input;
                }}
                maxLength={200}
              />
            )}
          </FormItem>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="位置"
          >
            {getFieldDecorator("position", {
              rules: [{ required: true, message: "请选择位置" }],
              initialValue: defaultPositionVal
            })(
              <Select
                showSearch
                allowClear
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="选择位置"
                onChange={this.handlePositionTypeChange}
              >
                {positionTypeChildren}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...Constant.formItemLayout}
            label="内容类型"
          >
            {getFieldDecorator("type", {
              initialValue: contentType,
              rules: [{ required: true, message: "请选择内容类型" }]
            })(
              <RadioGroup
                onChange={(e) => {
                  form.resetFields(["contentId", "url", "url_title"]);
                  this.setState({ contentType: e.target.value });
                }}
              >
                <Radio value="PRODUCT">
                  商品
                </Radio>
                <Radio value="PRODUCT_TAG">
                  商品标签
                </Radio>
                <Radio value="CATEGORY">
                  商品分类
                </Radio>
                <Radio value="EXTERNAL_URL">
                  外部地址
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          {
            this.generateContenetTypeInput(getFieldDecorator)
          }
          {
            this.generateUrlTitleInput(getFieldDecorator)
          }
          <FormItem
            {...Constant.formItemLayout}
            label="展示时间"
          >
            {getFieldDecorator("showDate", {
              rules: [{ required: true, message: "请选择展示时间" }],
              initialValue: defaultShowDate
            })(
              <RangePicker
                disabledDate={this.disabledDate}
                dateRender={(current) => {
                  const style = {};
                  if (current.date() === 1) {
                    style.border = "1px solid #1890ff";
                    style.borderRadius = "50%";
                  }
                  return (
                    <div className="ant-calendar-date" style={style}>
                      {current.date()}
                    </div>
                  );
                }}
                ranges={{ 今天: [moment(), moment()], 这个月: [moment().startOf("month"), moment().endOf("month")] }}
              />
            )}
          </FormItem>
          <FormItem
            {...Constant.formItemLayout}
            label="图片"
          >
            {getFieldDecorator("image", {
              rules: [{ required: true, message: "请选择图片" }],
              initialValue: currentItem.image
            })(
              <FileUpload
                accept="image/*"
                listType="picture-card"
                fileNum={1}
                fileMetas={["image/jpeg", "image/png", "image/gif"]}
              />
            )}
          </FormItem>
          <FormItem
            {...Constant.formItemLayout}
            label="启用"
          >
            <Tooltip title="">
              {getFieldDecorator("enabled", {
                initialValue: utils.isNull(currentItem.enabled) ? true : currentItem.enabled,
                valuePropName: "checked",
                rules: [{ required: true, message: "请选择是否启用" }]
              })(
                <Switch checkedChildren="是" unCheckedChildren="否"/>
              )}
            </Tooltip>
          </FormItem>
          <FormItem {...Constant.formItemLayout} label="序号">
            {getFieldDecorator("orders", {
              initialValue: initOrder,
              rules: [{ required: true, message: "请输入序号" }]
            })(
              <InputNumber min={1} max={65535}/>
            )}
          </FormItem>
          <FormItem
            hasFeedback
            {...Constant.formItemLayout}
            label="备注"
          >
            {getFieldDecorator("remarks", {
              rules: [{ required: false, message: "请输入备注" }],
              initialValue: currentItem.remarks
            })(
              <TextArea
                maxLength={200}
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </FormItem>
        </Form>
      </BasicModal>
    );
  }
}
