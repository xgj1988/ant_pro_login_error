import React, { PureComponent } from 'react';
import { AutoComplete, Icon, Input, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import lodash from 'lodash';
import * as utils from '@/utils/utils';
import style from './PostInput.less';
import Ellipsis from '../../Ellipsis';
import PostSearchModal from './PostSearchModal';

const { Option } = AutoComplete;
/**
 * 这是一个文章的选择组件，使用方式，<PostInput/>。
 * 额外属性：
 * name 显示的名字 默认 仓库
 * questionTitle 显示的 问题title，默认false
 * hasAddIcon 是否有添加按钮  默认 false
 * required  是否必填 默认为false
 * inlineMode 是否内联样式，默认为 false
 * 其他
 * from 的 valuePropName值为 selectItem.id .
 */
@connect()
export default class PostInput extends PureComponent {
  constructor(props) {
    super(props);
    this.readOnly = false;
    this.delimiter = ',';
    this.value = [];
    if (lodash.isArray(props.value)) {
      this.value = [...props.value];
    } else if (!utils.isEmptyObject(props.value)) {
      this.value.push(props.value);
    }
    this.loadFlag = false;
    // 消抖函数.
    this.searchDebounceFn = lodash.debounce(fun => {
      fun();
    }, 150);
    this.state = {
      dataSource: [],
      searchModalVisible: false,
      keyword: this.generateKeyword()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.isUnmount) {
      return;
    }
    if ('value' in nextProps) {
      let newValue = nextProps.value;
      if (!utils.isNull(newValue)) {
        if (!utils.isEmptyObject(nextProps.value)) {
          newValue = [];
          newValue.push(nextProps.value);
        }
        if (!lodash.isEqual(this.value, Array.from(newValue))) {
          this.value = [];
          this.addSelectedItem(newValue);
        }
      }
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  firstClickCompleteInput = () => {
    if (!this.loadFlag) {
      this.search(this.state.keyword);
    }
    this.loadFlag = true;
  };

  handleClearClick = e => {
    e.stopPropagation();
    this.value = [];
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
    this.search(null);
  };

  handleCompleteChange = (searchValue, option) => {
    if (utils.isNull(option.props.item)) {
      // 单纯的值变化
      this.search(searchValue);
      this.setState({ keyword: searchValue });
    } else {
      // 选中
      this.addSelectedItem(option.props.item, true);
    }
  };

  handleTableSelect = records => {
    this.value = records.filter(item => {
      return utils.isNull(item.autoCreate) || item.autoCreate === false;
    });
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
  };

  addSelectedItem = (item, addDelimiter = false) => {
    let tmpArray = item;
    if (!lodash.isArray(item)) {
      tmpArray = [];
      tmpArray.push(item);
    }
    const { multi = false } = this.props;
    if (!multi) {
      this.value = [];
    }
    this.value = lodash.unionBy(this.value, tmpArray, 'id');
    this.setState({ keyword: this.generateKeyword(addDelimiter) });
    this.triggerChange();
  };

  handleSearchModalVisible = modalVisible => {
    this.setState({ searchModalVisible: modalVisible });
  };

  handleSearchChange = e => {
    e.stopPropagation();
    this.handleSearchModalVisible(true);
  };

  handleAutoCompleteTagClose = removeItem => {
    lodash.remove(this.value, item => {
      return item.id === removeItem.id;
    });
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
  };

  generateKeyword = (addDelimiter = false) => {
    const { multi = false } = this.props;
    if (this.value.length === 0) {
      return null;
    }
    let result = '';
    this.value.forEach(item => {
      result = `${result}${this.delimiter}${item.content}`;
    });
    result = result.substr(1, result.length);
    if (multi && addDelimiter) {
      result += this.delimiter;
    }
    return result;
  };

  handleInputBlur = () => {
    this.setState({ keyword: this.generateKeyword() });
  };

  handleInputFocus = () => {
    if (this.value.length > 0) {
      this.setState({ keyword: null });
    }
  };

  triggerChange = () => {
    const { onChange, multi = false } = this.props;
    if (onChange) {
      if (multi) {
        onChange([...this.value]);
      } else {
        onChange(lodash.cloneDeep(this.value[0]));
      }
    }
  };

  generateAutoCompleteTag = () => {
    let tags = null;
    const { readOnly = false } = this.props;
    if (this.value && this.value.length > 0) {
      tags = this.value.map(item => (
        <Tag
          closable={!readOnly}
          onClose={() => this.handleAutoCompleteTagClose(item)}
          key={item.id}
        >
          {item.content}
        </Tag>
      ));
    } else {
      tags = null;
    }
    return tags;
  };

  calcPaddingLeftSpace = (name, inlineMode, required, inputPrefixIcons) => {
    if (inlineMode) {
      // 计算文字
      let len = utils.strLenChinese2Len(name);
      if (required) {
        len += 1;
      }
      let space = len * 8;
      // 图标
      if (
        inputPrefixIcons &&
        inputPrefixIcons.props &&
        inputPrefixIcons.props.children
      ) {
        let { children } = inputPrefixIcons.props;
        if (!lodash.isArray(children)) {
          children = [];
          children.push(inputPrefixIcons.props.children);
        }
        for (const child of children) {
          if (child && child.props && child.props.iconFlag) {
            space += 14;
          }
        }
      }
      space += 14;
      return `${space}px`;
    } else {
      return null;
    }
  };

  calcPaddingRightSpace = (inlineMode, inputSuffixIcons) => {
    if (inlineMode) {
      // 图标
      let space = 0;
      if (
        inputSuffixIcons &&
        inputSuffixIcons.props &&
        inputSuffixIcons.props.children
      ) {
        let { children } = inputSuffixIcons.props;
        if (!lodash.isArray(children)) {
          children = [];
          children.push(inputSuffixIcons.props.children);
        }
        for (const child of children) {
          if (child && child.props && child.props.iconFlag) {
            space += 24;
          }
        }
      }
      space += 14;
      return `${space}px`;
    } else {
      return null;
    }
  };

  search = keyword => {
    const { readOnly = false } = this.props;
    if (readOnly) {
      return;
    }
    let newKeyword = lodash.trim(keyword);
    const delimiterIndex = newKeyword.lastIndexOf(this.delimiter);
    if (delimiterIndex > 0) {
      newKeyword = newKeyword.substring(delimiterIndex + 1, newKeyword.length);
    }
    this.searchDebounceFn(() => {
      this.props.dispatch({
        type: 'post/search',
        payload: { keyword: newKeyword },
        callback: data => {
          this.setState({ dataSource: data.page.records });
        }
      });
    });
  };

  render() {
    const { dataSource, keyword, searchModalVisible } = this.state;
    const {
      name = '帖子',
      required = false,
      questionTitle = false,
      multi = false,
      hasClearBtn = true,
      hasSearchBtn = true,
      inlineMode = true,
      className,
      size,
      prefixCls = 'ant-input-search',
      readOnly = false
    } = this.props;
    const newAutoCompleteProps = { ...this.props };
    delete newAutoCompleteProps.required;
    delete newAutoCompleteProps.name;
    delete newAutoCompleteProps.questionTitle;
    delete newAutoCompleteProps.hasAddBtn;
    delete newAutoCompleteProps.hasClearBtn;
    delete newAutoCompleteProps.hasXiangBtn;
    delete newAutoCompleteProps.hasSearchBtn;
    delete newAutoCompleteProps.inlineMode;
    delete newAutoCompleteProps.value;
    delete newAutoCompleteProps.multi;
    delete newAutoCompleteProps.readOnly;
    delete newAutoCompleteProps.allowClear;
    const hasValue = !utils.isEmptyArray(this.value);
    const hasClearBtnTmp = hasClearBtn && hasValue && !readOnly;
    const hasSearchBtnTmp = hasSearchBtn && !readOnly;
    let placeholder = `请选择${name}`;
    if (hasValue) {
      placeholder = this.generateKeyword();
    }
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size,
      'brand-input': true
    });
    let inputPrefix = null;
    if (inlineMode || questionTitle) {
      inputPrefix = (
        <div
          ref={c => {
            this.inputPrefix = c;
          }}
          className={style.prefix}
        >
          {inlineMode ? name : null}
          {inlineMode && required ? (
            <strong style={{ color: '#DC143C' }}>*&nbsp;</strong>
          ) : (
            <span>&nbsp;</span>
          )}
          {questionTitle ? (
            <Tooltip iconFlag title={questionTitle}>
              <Icon style={{ cursor: 'pointer' }} type="question-circle" />
            </Tooltip>
          ) : null}
        </div>
      );
    }
    const inputSuffix = (
      <div
        ref={c => {
          if (c) {
            this.inputSuffix = c;
          }
        }}
        className={style.suffix}
      >
        {hasClearBtnTmp ? (
          <Tooltip title={`清空${name}`} iconFlag>
            <Icon
              style={{ cursor: 'pointer', marginRight: '4px' }}
              type="close-circle"
              onClick={this.handleClearClick}
            />
          </Tooltip>
        ) : null}
        {hasSearchBtnTmp ? (
          <Tooltip title={`${name}选择`} iconFlag>
            <Icon
              onClick={this.handleSearchChange}
              style={{ cursor: 'pointer' }}
              type="search"
            />
          </Tooltip>
        ) : null}
      </div>
    );
    const options = dataSource.map(option => {
      return (
        <Option key={option.id} value={utils.uuid()} item={option}>
          {option.highlightContent ? (
            <Ellipsis lines={1} tooltip>
              <span
                dangerouslySetInnerHTML={{ __html: option.highlightContent }}
              />
            </Ellipsis>
          ) : (
            <Ellipsis lines={1} tooltip>
              {option.content}
            </Ellipsis>
          )}
        </Option>
      );
    });
    const paddingLeft = this.calcPaddingLeftSpace(
      name,
      inlineMode,
      required,
      inputPrefix
    );
    const paddingRight = this.calcPaddingRightSpace(inlineMode, inputSuffix);
    return (
      <div className={style.brandInput} onClick={this.firstClickCompleteInput}>
        <Tooltip title={this.generateAutoCompleteTag()}>
          <AutoComplete
            value={keyword}
            dataSource={!readOnly ? options : null}
            {...newAutoCompleteProps}
            onChange={this.handleCompleteChange}
          >
            <Input
              ref={input => {
                if (input) {
                  this.input = input.input;
                  if (this.input) {
                    if (paddingLeft) {
                      this.input.style.paddingLeft = paddingLeft;
                    }
                    if (paddingRight) {
                      this.input.style.paddingRight = paddingRight;
                    }
                  }
                }
              }}
              onBlur={this.handleInputBlur}
              onFocus={this.handleInputFocus}
              placeholder={placeholder}
              prefix={inputPrefix}
              suffix={inputSuffix}
              className={inputClassName}
              readOnly={readOnly}
            />
          </AutoComplete>
        </Tooltip>
        <PostSearchModal
          multi={multi}
          selectedRows={this.value}
          name={name}
          title={`${name}选择`}
          handleTableSelect={this.handleTableSelect}
          visible={searchModalVisible}
          handleModalVisible={this.handleSearchModalVisible}
        />
      </div>
    );
  }
}
