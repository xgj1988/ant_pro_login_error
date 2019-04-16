import React, { PureComponent } from "react";
import { Form, Input, Select } from "antd";
import BasicModal from "@/components/Common/Modal/BasicModal";
import FileUpload from "@/components/Common/Upload/FileUpload";
import Ueditor from "@/components/Ueditor";
import * as utils from "@/utils/utils";
import { connect } from "dva";

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects["article/add"] || loading.effects["article/update"]
}))
export default class ArticleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.editorInstance = null;
  }


  validateArticleTagSelect = (rule, value, callback) => {
    const errors = [];
    if (value.length > 5) {
      errors.push(new Error("最多选择5个标签"));
    }
    callback(errors);
  };


  handleModalOk = (addFlag, modalVisible) => {
    const { form, handleFormSubmit, handleModalVisible, currentItem } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const newValues = utils.copyJsonIgnoreCommonFields(currentItem, { ...values }, "creator", "area", "articleTags", "article", "state");
        newValues.state = null;
        handleFormSubmit(addFlag, newValues, (success) => {
          if (addFlag) {
            if (success && modalVisible) {
              this.editorInstance.clearContent();
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

  render() {
    const {
      form, visible, title, handleModalVisible, currentItem = {},
      articleTags = [], areaList = [], loading
    } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    const { getFieldDecorator } = form;
    const currentArticleTagsVal = [];
    const currentArticleTags = currentItem.articleTags;
    const articleTagChildren = [];
    const areaChildren = [];
    let defaultAreaId = null;
    for (const area of areaList) {
      if (defaultAreaId === null) {
        defaultAreaId = area.id;
      }
      areaChildren.push(
        <Option key={area.id.toString()} title={area.name} value={area.id} >
          {area.name}
        </Option >
      );
    }
    const formLayout = {
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
    if (!addFlag) {
      if (currentArticleTags) {
        for (const currentArticleTag of currentArticleTags) {
          currentArticleTagsVal.push(currentArticleTag.id);
        }
      }
      defaultAreaId = currentItem.areaId;
    }
    return (
      <BasicModal
        okLoading={loading}
        onShow={this.handleShow}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        addFlag={addFlag}
        onOk={this.handleModalOk}
        hasContinue={false}
        width="1000px"
      >
        <Form >
          <FormItem
            hasFeedback
            {...formLayout}
            label="标题"
          >
            {getFieldDecorator("title", {
              rules: [{ required: true, message: "请输入文章标题" }],
              initialValue: currentItem.title
            })(
              <Input
                autoFocus
                maxLength={200}
              />
            )}
          </FormItem >
          <FormItem
            hasFeedback
            label="标签"
            {...formLayout}
          >
            {getFieldDecorator("articleTagIds", {
              initialValue: currentArticleTagsVal,
              rules: [{ required: true, validator: this.validateArticleTagSelect }]
            })(
              <Select
                allowClear
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="选择标签"
              >
                {articleTagChildren}
              </Select >
            )}
          </FormItem >
          <FormItem
            hasFeedback
            {...formLayout}
            label="区域"
          >
            {getFieldDecorator("areaId", {
              rules: [{ required: true, message: "请选择区域" }],
              initialValue: defaultAreaId
            })(
              <Select
                showSearch
                dropdownStyle={{ maxHeight: 500 }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder="选择区域"
              >
                {areaChildren}
              </Select >
            )}
          </FormItem >
          <FormItem
            {...formLayout}
            label="封面"
          >
            {getFieldDecorator("cover", {
              rules: [{ required: true, message: "请上传封面" }],
              initialValue: currentItem.cover
            })(
              <FileUpload
                accept="image/*"
                listType="picture-card"
                fileNum={1}
                fileMetas={["image/jpeg", "image/png", "image/gif"]}
              />
            )}
          </FormItem >
          <FormItem
            {...formLayout}
            label="内容"
          >
            {getFieldDecorator("content", {
              rules: [{ required: true, message: "请输入内容" }],
              initialValue: currentItem.content
            })(
              <Ueditor id="content" height="400" />
            )}
          </FormItem >
        </Form >
      </BasicModal >
    );
  }
}
