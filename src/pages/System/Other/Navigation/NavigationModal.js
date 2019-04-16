import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import BasicModal from '@/components/Common/Modal/BasicModal';
import Constant from '@/utils/Constant';
import * as utils from '@/utils/utils';
import FileUpload from '@/components/Common/Upload/FileUpload';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class NavigationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagType: 'indexHead',
      defaultIcon: ''
    };
  }

  handleShow = () => {
    const { currentItem = {} } = this.props;
    const addFlag = utils.isEmptyObject(currentItem);
    if (!addFlag) {
      this.setState({
        tagType: currentItem.position.value,
        defaultIcon: currentItem.icon
      });
    }
  };

  handleChangeImg = (value, option) => {
    if (option.props.icon) {
      this.setState({ defaultIcon: option.props.icon });
    }
  };

  handleModalOk = (addFlag, modalVisible) => {
    const {
      form,
      handleFormSubmit,
      handleModalVisible,
      currentItem
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = values;
        if (!addFlag) {
          newValues = utils.copyJsonIgnoreCommonFields(
            currentItem,
            { ...values },
            'articleTag',
            'postTopicTag'
          );
        }
        handleFormSubmit(addFlag, newValues, success => {
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

  handlePositionTypeChange = (value, option) => {
    this.setState({ tagType: option.props.tagType });
  };

  render() {
    const {
      form,
      visible,
      title,
      handleModalVisible,
      currentItem = {},
      positionTypes = [],
      articleTags = [],
      videoTags = [],
      postTopicTags = []
    } = this.props;
    const { tagType, defaultIcon } = this.state;
    const addFlag = utils.isEmptyObject(currentItem);
    let initOrder = 99;
    const { getFieldDecorator } = form;
    let defaultPositionVal = null;
    let currentArticleTagVal;
    let currentPostTopicTagVal;
    const positionTypeChildren = [];
    for (const positionType of positionTypes) {
      positionTypeChildren.push(
        <Option
          key={positionType.enum}
          title={positionType.enum}
          value={positionType.enum}
          tagType={positionType.value}
        >
          {positionType.desc}
        </Option>
      );
    }
    const articleTagChildren = [];
    for (const articleTag of articleTags) {
      articleTagChildren.push(
        <Option
          key={articleTag.id}
          title={articleTag.name}
          value={articleTag.id}
          icon={articleTag.icon}
        >
          {articleTag.name}
        </Option>
      );
    }
    const videoTagChildren = [];
    for (const videoTag of videoTags) {
      videoTagChildren.push(
        <Option
          key={videoTag.id}
          title={videoTag.name}
          value={videoTag.id}
          icon={videoTag.icon}
        >
          {videoTag.name}
        </Option>
      );
    }
    const postTopicTagChildren = [];
    for (const postTopicTag of postTopicTags) {
      postTopicTagChildren.push(
        <Option
          key={postTopicTag.id}
          title={postTopicTag.name}
          value={postTopicTag.id}
        >
          {postTopicTag.name}
        </Option>
      );
    }

    if (!addFlag) {
      defaultPositionVal = currentItem.position.enum;
      if (currentItem.position.article) {
        currentArticleTagVal = currentItem.tagId;
      } else {
        currentPostTopicTagVal = currentItem.tagId;
      }
      initOrder = currentItem.orders;
    }
    return (
      <BasicModal
        onShow={this.handleShow}
        title={title}
        visible={visible}
        onVisible={handleModalVisible}
        addFlag={addFlag}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem hasFeedback {...Constant.formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名称' }],
              initialValue: currentItem.name
            })(
              <Input
                ref={input => {
                  this.name = input;
                }}
                maxLength={200}
              />
            )}
          </FormItem>
          <FormItem hasFeedback {...Constant.formItemLayout} label="位置">
            {getFieldDecorator('position', {
              rules: [{ required: true, message: '请选择位置' }],
              initialValue: defaultPositionVal
            })(
              <Select
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder="选择位置"
                onChange={this.handlePositionTypeChange}
              >
                {positionTypeChildren}
              </Select>
            )}
          </FormItem>
          {tagType === 'indexHead' ? (
            <FormItem hasFeedback label="文章标签" {...Constant.formItemLayout}>
              {getFieldDecorator('tagId', {
                initialValue: currentArticleTagVal,
                rules: [{ required: true, message: '请选择文章标签' }]
              })(
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.handleChangeImg}
                  placeholder="选择文章标签"
                >
                  {articleTagChildren}
                </Select>
              )}
            </FormItem>
          ) : null}
          {tagType === 'videoHead' ? (
            <FormItem hasFeedback label="视频标签" {...Constant.formItemLayout}>
              {getFieldDecorator('tagId', {
                initialValue: currentArticleTagVal,
                rules: [{ required: true, message: '请选择视频标签' }]
              })(
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.handleChangeImg}
                  placeholder="选择视频标签"
                >
                  {videoTagChildren}
                </Select>
              )}
            </FormItem>
          ) : null}
          {tagType === 'groupHead' ? (
            <FormItem hasFeedback label="话题标签" {...Constant.formItemLayout}>
              {getFieldDecorator('tagId', {
                initialValue: currentPostTopicTagVal,
                rules: [{ required: true, message: '请选择话题标签' }]
              })(
                <Select
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="选择话题标签"
                >
                  {postTopicTagChildren}
                </Select>
              )}
            </FormItem>
          ) : null}
          <FormItem {...Constant.formItemLayout} label="序号">
            {getFieldDecorator('orders', {
              initialValue: initOrder,
              rules: [{ required: true, message: '请输入序号' }]
            })(<InputNumber min={1} max={65535} />)}
          </FormItem>
          <FormItem {...Constant.formItemLayout} label="图标">
            {getFieldDecorator('icon', {
              rules: [{ message: '请选择图标' }],
              initialValue: defaultIcon
            })(
              <FileUpload
                accept="image/*"
                listType="picture-card"
                fileNum={1}
                fileMetas={['image/jpeg', 'image/png', 'image/gif']}
              />
            )}
          </FormItem>
        </Form>
      </BasicModal>
    );
  }
}
