import React, { Fragment, PureComponent } from "react";
import {
  BackTop,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect
} from "antd";
import { connect } from "dva";
import * as utils from "@/utils/utils";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import FileUpload from "@/components/Common/Upload/FileUpload";
import FooterToolbar from "@/components/FooterToolbar";
import Ueditor from "@/components/Ueditor";
import RegionFormItem from "./RegionFormItem";
import ExpandTag from "./ExpandTag";
import SkuInfo from "./SkuInfo";
import SkuDetailInfo from "./SkuDetailInfo";
import FreightInfo from "./FreightInfo";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ loading }) => ({
  loading: loading.models.product
}))
export default class ProductModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,
      specItems: [],
      skus: [],
      types: [],
      selectedType: {},
      deliveryTypes: [],
      selectedDeliveryTypes: [],
      categories: [],
      brands: [],
      tags: [],
      valueAddeds: [],
      introduction: null
    };

  }

  /**
   * 页面挂载钩子函数
   */
  componentDidMount() {
    let type = "product/create";
    if (location.pathname.endsWith("update")) {
      type = "product/edit";
    }
    this.props.dispatch({
      type,
      callback: data => {
        const { types, deliveryTypes, categories, brands, tags, valueAddeds } = data;
        this.setState({
          selectedType: types[0],
          selectedDeliveryTypes: [deliveryTypes[0]],
          types,
          deliveryTypes,
          categories: utils.reduceTree(categories),
          brands,
          tags,
          valueAddeds
        });
      }
    });
  }

  /**
   * 保存按钮
   */
  handleSaveBtn = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(`没报错了${values}`);
      }
    });

  };


  /**
   * 检查运费
   * @param rule
   * @param value
   * @param callback
   */
  checkFreight = (rule, value, callback) => {
    if (value.type === "uniformFreight") {
      if (!/^\d+\.?\d*$/.test(value.freight)) {
        callback("请输入正确的运费");
        return;
      }
    }
    callback();
  };

  /**
   *  生成SKUS
   * @param specItems
   * @returns {Array}
   */
  generateSkus = (specItems) => {
    let skus = [];
    const objTemplate = { price: 0, stock: 0, code: null, cost: 0 };
    const fieldKeys = [];
    const KEY_SEPARATOR = "_";
    let entriesCount = 0;
    const entries = specItems.map((item) => {
      const key = `specItem_${item.name}`;
      objTemplate[key] = "";
      fieldKeys.push(key);
      if (entriesCount === 0) {
        entriesCount = item.entries.length;
      } else if (item.entries.length !== 0) {
        entriesCount *= item.entries.length;
      }
      return item.entries;
    });
    for (let i = 0; i < entriesCount; i += 1) {
      skus.push({ ...objTemplate });
    }
    const isOneSpec = (entries.length === 1);
    if (entriesCount > 0) {
      // 求笛卡尔积
      const descartesVals = utils.calcDescartes(entries);
      if (isOneSpec) {
        for (let j = 0; j < descartesVals.length; j++) {
          const entry = descartesVals[j];
          skus[j].key = entry.value;
          skus[j][fieldKeys[0]] = entry.value;
        }
      } else {
        // 多规格
        for (let j = 0; j < descartesVals.length; j++) {
          let key = "";
          for (let k = 0; k < descartesVals[j].length; k++) {
            const entry = descartesVals[j][k];
            key += `${entry.value}${KEY_SEPARATOR}`;
            skus[j][fieldKeys[k]] = entry.value;
          }
          key = key.substring(0, key.length - 1);
          skus[j].key = key;
        }
      }
    }
    const oldSkus = this.state.skus;
    skus = skus.map((item) => {
      const findOldItem = oldSkus.find((oldItem) => {
        if (oldItem.key === item.key) {
          return true;
        }
        const lastKeySeparator = item.key.lastIndexOf(KEY_SEPARATOR);
        if (lastKeySeparator !== -1) {
          const keyTemp = item.key.substring(0, lastKeySeparator);
          if (oldItem.key === keyTemp) {
            return true;
          }
        }
        return false;
      });
      if (!utils.isNull(findOldItem)) {
        item.price = findOldItem.price;
        item.stock = findOldItem.stock;
        item.code = findOldItem.code;
        item.cost = findOldItem.cost;
      }
      return item;
    });
    return skus;
  };


  /**
   *
   * @param specItems
   */
  handleSpecItemChange = (specItems) => {
    const { form } = this.props;
    specItems = utils.deepCopySpecItems(specItems);
    specItems = specItems.filter((item) => !utils.isEmptyStr(item.name));
    specItems.map((item) => {
      const newEntries = item.entries.filter((entry) => !utils.isEmptyStr(entry.value));
      item.entries = newEntries;
      return item;
    });
    specItems = specItems.filter((item) => item.entries.length > 0);
    const skus = this.generateSkus(specItems);
    form.setFields({ skus, specItems });
    this.setState({ specItems, skus });

  };


  render() {
    const { form, currentItem = {} } = this.props;
    const {
      specItems, skus, types, deliveryTypes, selectedType,
      selectedDeliveryTypes, categories, brands, tags, valueAddeds, introduction
    } = this.state;
    const showSpec = (specItems.filter((item) => !utils.isEmptyStr(item.name)).length > 0);
    const hasSku = (skus.length > 0);
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    const defaultDeliveryTypes = selectedDeliveryTypes.map((item) => item.enum);
    const showFreight = !utils.isNull(selectedDeliveryTypes.find((item) => item.showFreight));
    const defaultValueAddeds = currentItem.valueAddedIds || [];
    const defaultFreightInfoVal = {
      type: "uniformFreight",
      freight: "",
      freightTempleteId: ""
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 22 }
      }
    };
    if (addFlag) {
      valueAddeds.map(item => {
        if (item.defaultSelected) {
          defaultValueAddeds.push(item.id);
        }
        return null;
      });
    }
    return (
      <PageHeaderWrapper >
        <Form >
          <Card bordered={false} >

            <FormItem >
              <RegionFormItem title="商品类型" />
            </FormItem >
            <FormItem >
              {getFieldDecorator("type", {
                initialValue: selectedType.enum
              })(
                <RadioGroup
                  onChange={(e) => {
                    const { value } = e.target;
                    const findItem = types.find((item) => item.enum === value);
                    this.setState({ selectedType: findItem });
                  }}
                >
                  {types.map(item => (
                    <RadioButton
                      key={item.enum}
                      value={item.enum}
                    >
                      {item.desc}({item.delivery ? "物流发货" : "无需物流"})
                    </RadioButton >
                  ))}
                </RadioGroup >
              )}
            </FormItem >
            <FormItem >
              <RegionFormItem title="基本信息" />
            </FormItem >
            <FormItem {...formItemLayout} label="商品名" >
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入名称" }],
                initialValue: currentItem.name
              })(
                <Input style={{ width: 400 }} autoFocus maxLength={200} />
              )}
            </FormItem >
            <FormItem {...formItemLayout} label="商品卖点" extra="在商品列表页、详情页标题下面展示卖点信息，建议60字以内" >
              {getFieldDecorator("caption", {
                initialValue: currentItem.caption
              })(
                <Input style={{ width: 400 }} autoFocus maxLength={60} />
              )}
            </FormItem >
            <FormItem {...formItemLayout} label="商品编码" >
              {getFieldDecorator("code", {
                rules: [{ required: true, message: "请输入商品编码" }],
                initialValue: currentItem.caption
              })(
                <Input style={{ width: 400 }} autoFocus maxLength={200} />
              )}
            </FormItem >
            <FormItem {...formItemLayout} label="商品类别" >
              {getFieldDecorator("categoryId", {
                rules: [{ required: true, message: "请选择类别" }],
                initialValue: currentItem.categoryId
              })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 500 }}
                  style={{ width: 400 }}
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                >
                  {utils.renderTreeNodes(categories, null, null, item => {
                    const result = {};
                    const parentIdPath = `,${currentItem.id},`;
                    if (utils.isNull(item.parentId)) {
                      return result;
                    }
                    if (
                      item.id === currentItem.id ||
                      item.treePath.indexOf(parentIdPath) > 0
                    ) {
                      return { disabled: true };
                    }
                    return result;
                  })}
                </TreeSelect >
              )}
            </FormItem >
            <FormItem {...formItemLayout} label="商品封面" extra="建议尺寸：800*800像素" >
              {getFieldDecorator("cover", {
                rules: [{ required: true, message: "请输入商品封面" }],
                initialValue: currentItem.cover
              })(
                <FileUpload
                  uploadButtonText="选择图片"
                  accept="image/*"
                  listType="picture-card"
                  fileNum={1}
                  fileMetas={["image/*"]}
                />
              )}
            </FormItem >
            <ExpandTag desc="基本信息展开" >
              <FormItem {...formItemLayout} label="商品品牌" >
                {getFieldDecorator("brandId", {
                  initialValue: currentItem.brandId
                })(
                  <Select
                    style={{ width: 400 }}
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {brands.map(item => {
                      return (
                        <Option key={item.id} title={item.name} value={item.id} >
                          {item.name}
                        </Option >
                      );
                    })}
                  </Select >
                )}
              </FormItem >
              <FormItem {...formItemLayout} label="商品标签" >
                {getFieldDecorator("tagIds", {
                  initialValue: currentItem.tagIds
                })(
                  <Select
                    style={{ width: 400 }}
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {tags.map(item => {
                      return (
                        <Option key={item.id} title={item.name} value={item.id} >
                          {item.name}
                        </Option >
                      );
                    })}
                  </Select >
                )}
              </FormItem >
              <FormItem {...formItemLayout} label="增值服务" >
                {getFieldDecorator("valueAddedIds", {
                  initialValue: defaultValueAddeds
                })(
                  <Select
                    style={{ width: 400 }}
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {valueAddeds.map(item => {
                      return (
                        <Option key={item.id} title={item.name} value={item.id} >
                          {item.name}
                        </Option >
                      );
                    })}
                  </Select >
                )}
              </FormItem >
              <FormItem {...formItemLayout} label="商品图片" extra="建议尺寸：800*800像素，最多5张，如果没有则使用封面图片" >
                {getFieldDecorator("images", {
                  initialValue: currentItem.images
                })(
                  <FileUpload
                    uploadButtonText="选择图片"
                    accept="image/*"
                    listType="picture-card"
                    fileNum={5}
                    fileMetas={["image/*"]}
                  />
                )}
              </FormItem >
            </ExpandTag >
            <FormItem >
              <RegionFormItem title="价格库存" />
            </FormItem >
            {!hasSku ?
              (
                <FormItem {...formItemLayout} label="价格" extra="如果商品有SKU，那么这个价格就忽略。" >
                  {getFieldDecorator("price", {
                    rules: [{ required: true, pattern: /^\d+\.?\d*$/, message: "请输入正确的价格" }],
                    initialValue: currentItem.price
                  })(
                    <Input
                      maxLength={10}
                      addonBefore="¥"
                      style={{ width: 200 }}
                      onBlur={() => {
                        const priceValue = form.getFieldValue("price");
                        const newPriceValue = utils.numberFormat(priceValue, 2, null, "");
                        form.setFieldsValue({
                          price: newPriceValue
                        });
                      }}
                    />
                  )}
                </FormItem >
              )
              : null
            }
            <FormItem {...formItemLayout} label="市场价" extra="划线价在商品详情会以划线形式显示，如果商品有SKU，那么这个价格就忽略" >
              {getFieldDecorator("marketPrice", {
                rules: [{ pattern: /^\d+\.?\d*$/, message: "请输入正确的市场价" }],
                initialValue: currentItem.marketPrice
              })(
                <Input
                  maxLength={10}
                  addonBefore="¥"
                  style={{ width: 200 }}
                  onBlur={() => {
                    const priceValue = form.getFieldValue("marketPrice");
                    const newPriceValue = utils.numberFormat(priceValue, 2, null, "");
                    form.setFieldsValue({
                      marketPrice: newPriceValue
                    });
                  }}
                />
              )}
            </FormItem >
            {!hasSku ?
              (
                <FormItem {...formItemLayout} label="库存" extra="库存为 0 时，会放到『已售罄』的商品列表里，如果商品有SKU，那么这个价格就忽略" >
                  {getFieldDecorator("stock", {
                    initialValue: currentItem.stock,
                    rules: [{ required: true, pattern: /^\d+$/, message: "请输入正确的库存" }]
                  })(
                    <InputNumber
                      style={{ width: 200 }}
                      min={0}
                      max={9999999}
                      parser={(value) => {
                        if (value) {
                          return parseInt(value, 0);
                        }
                      }}
                    />
                  )}
                </FormItem >
              )
              : null
            }
            <FormItem {...formItemLayout} label="库存显示" extra="商品详情不显示剩余件数" >
              {getFieldDecorator("showStock", {
                valuePropName: "checked",
                initialValue: currentItem.showStock || false
              })(
                <Switch checkedChildren="是" unCheckedChildren="否" />
              )}
            </FormItem >
            <FormItem >
              <RegionFormItem title="规格信息" />
            </FormItem >
            <FormItem {...formItemLayout} label="商品规格" extra="如有颜色、尺码等多种规格，请添加商品规格" >
              {getFieldDecorator("specItems", {
                initialValue: currentItem.specItems
              })(
                <SkuInfo onChange={this.handleSpecItemChange} />
              )}
            </FormItem >
            {
              showSpec ?
                (
                  <FormItem {...formItemLayout} label="规格明细" >
                    {getFieldDecorator("skus", {
                      initialValue: skus
                    })(
                      <SkuDetailInfo specItems={specItems} />
                    )}
                  </FormItem >
                )
                : null
            }
            {
              selectedType.delivery ?
                (
                  <Fragment >
                    <FormItem >
                      <RegionFormItem title="物流信息" />
                    </FormItem >
                    <FormItem {...formItemLayout} label="配送方式" >
                      {getFieldDecorator("deliveryTypes", {
                        initialValue: defaultDeliveryTypes
                      })(
                        <Checkbox.Group
                          onChange={(checkedValues) => {
                            const newSelectedDeliveryTypes = deliveryTypes.filter((item) => {
                              return !utils.isNull(checkedValues.find((value) => item.enum === value));
                            });
                            this.setState({ selectedDeliveryTypes: newSelectedDeliveryTypes });
                          }}
                        >
                          {deliveryTypes.map((item => (
                            <Checkbox
                              key={item.enum}
                              value={item.enum}
                            >
                              {item.desc}
                            </Checkbox >
                          )))}
                        </Checkbox.Group >
                      )}
                    </FormItem >
                    {showFreight ?
                      (
                        <FormItem {...formItemLayout} label="运费设置" >
                          {getFieldDecorator("freightInfo", {
                            initialValue: currentItem.freightInfo || defaultFreightInfoVal,
                            rules: [{ validator: this.checkFreight }]
                          })(
                            <FreightInfo />
                          )}
                        </FormItem >
                      ) : null}
                  </Fragment >
                )
                : null
            }
            <FormItem >
              <RegionFormItem title="其他信息" />
            </FormItem >
            <FormItem {...formItemLayout} label="是否上架" >
              {getFieldDecorator("marketable", {
                valuePropName: "checked",
                initialValue: currentItem.marketable || true
              })(
                <Switch checkedChildren="是" unCheckedChildren="否" />
              )}
            </FormItem >
            <FormItem {...formItemLayout} label="商品详情" >
              <Button onClick={() => this.setState({ drawerVisible: true })} >编辑</Button >
            </FormItem >
          </Card >
          <Drawer
            title="商品详情页编辑"
            placement="top"
            onClose={() => this.setState({ drawerVisible: false })}
            visible={this.state.drawerVisible}
            height={600}
          >
            <div style={{
              margin: "0 auto",
              width: 730
            }}
            >
              <div style={{ width: 320, float: "left" }} >
                <div
                  style={{
                    textAlign: "center",
                    background: "#e5e5e5",
                    border: "1px solid",
                    color: "#333333",
                    width: "100%",
                    height: "40px"
                  }}
                >
                  <h4 style={{ fontSize: "14px", lineHeight: "40px" }} >商品详情效果预览</h4 >
                </div >
                <div
                  style={{ width: "100%", height: 460, border: "1px dashed" }}
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />
              </div >
              <div style={{ float: "left", marginLeft: 10, width: 400 }} >
                <Ueditor id="content" onChange={(value) => this.setState({ introduction: value })} height="397" />
              </div >
            </div >
          </Drawer >
          <FooterToolbar >
            <div style={{
              margin: "0 auto",
              width: 800
            }}
            >
              <Button type="primary" onClick={this.handleSaveBtn} >保存</Button >
            </div >
          </FooterToolbar >
          <BackTop />
        </Form >
      </PageHeaderWrapper >
    );
  }
}
