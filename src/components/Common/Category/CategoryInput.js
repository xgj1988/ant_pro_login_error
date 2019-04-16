import React, { Fragment, PureComponent } from "react";
import { AutoComplete, Icon, Input, Tag, Tooltip } from "antd";
import { connect } from "dva";
import classNames from "classnames";
import lodash from "lodash";
import Ellipsis from "@/components/Ellipsis";
import CategoryModal from "@/pages/System/Shop/Category/CategoryModal";
import CategorySearchModal from "./CategorySearchModal";
import PermissionAuth from "@/utils/PermissionAuth";
import * as utils from "@/utils/utils";
import style from "./CategoryInput.less";

const { Option } = AutoComplete;
/**
 * 这是一个分销商的选择组件，使用方式，<DistributorInput/>。
 * 额外属性：
 * name 显示的名称 默认 商品类别
 * questionTitle 显示的 问题title，默认false
 * hasAddBtn 是否有添加按钮  默认 false
 * hasClearBtn 是否有清空按钮  默认 false
 * hasXiangBtn 是否有详情按钮  默认 false
 * hasSearchBtn 是否有查询  默认 false
 * required  是否必填 默认为false
 * inlineMode 是否内联样式，默认为 false
 * multi 是否多选，默认false。multi情况下不能输入值。多选模式返回数组，单选模式返回单个。
 *
 */
@connect()
export default class CategoryInput extends PureComponent {
  constructor(props) {
    super(props);
    this.readOnly = false;
    this.delimiter = ",";
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
      addModalVisible: false,
      searchModalVisible: false,
      keyword: this.generateKeyword()
    };
  }


  componentWillReceiveProps(nextProps) {
    if (this.isUnmount) {
      return;
    }
    if ("value" in nextProps) {
      let newValue = nextProps.value;
      if (!utils.isNull(newValue)) {
        if (!Array.isArray(newValue) && !utils.isEmptyObject(newValue)) {
          newValue = [];
          newValue.push(nextProps.value);
        }
        let isChange = false;
        if (this.value.length === 0 && newValue.length > 0) {
          isChange = true;
        } else if (this.value.length > 0 && newValue.length === 0) {
          isChange = true;
        } else if (!lodash.isEqualWith(this.value, newValue, (objValue, othValue) => {
          return objValue.id === othValue.id;
        })) {
          isChange = true;
        }
        if (isChange) {
          this.value = [];
          this.addSelectedItem(newValue);
        }
      } else if (this.value.length > 0) {
        this.value = [];
        this.setState({ keyword: null, dataSource: [], addModalVisible: false, searchModalVisible: false });
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


  handleClearClick = (e) => {
    e.stopPropagation();
    const { onAutoCompleteClear } = this.props;
    let isSearch = true;
    if (onAutoCompleteClear) {
      isSearch = onAutoCompleteClear();
    }
    this.value = [];
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
    if (isSearch) {
      this.search(null);
    }
  };

  handleAddModalVisible = (addModalVisible, readOnly) => {
    this.readOnly = readOnly;
    this.setState({ addModalVisible });
  };

  handleCompleteChange = (searchValue, option) => {
    if (utils.isNull(option.props.item)) {
      // 单纯的值变化
      this.search(searchValue);
      this.setState({ keyword: searchValue });
    } else {
      // 选中
      this.addSelectedItem(option.props.item, true);
      const { onAutoCompeteSelect } = this.props;
      if (onAutoCompeteSelect) {
        onAutoCompeteSelect(option.props.item);
      }
    }
  };

  handleTableSelect = records => {
    const { onTableSelect } = this.props;
    let isClose = true;
    if (onTableSelect) {
      isClose = onTableSelect(records);
      if (utils.isNull(isClose)) {
        isClose = true;
      }
    }
    this.value = records.filter(item => {
      return utils.isNull(item.autoCreate) || item.autoCreate === false;
    });
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
    return isClose;
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
    this.value = lodash.unionBy(this.value, tmpArray, "id");
    this.setState({ keyword: this.generateKeyword(addDelimiter) });
    this.triggerChange();
  };

  handleXiangChange = (e) => {
    e.stopPropagation();
    this.handleAddModalVisible(true, true);
  };

  handlePlusChange = (e) => {
    e.stopPropagation();
    this.handleAddModalVisible(true, false);
  };

  handleSearchModalVisible = modalVisible => {
    this.setState({ searchModalVisible: modalVisible });
  };

  handleSearchChange = (e) => {
    e.stopPropagation();
    this.handleSearchModalVisible(true);
  };

  handleAutoCompleteTagClose = removeItem => {
    const { onAutoCompleteRemove } = this.props;
    lodash.remove(this.value, item => {
      return item.id === removeItem.id;
    });
    this.setState({ keyword: this.generateKeyword() });
    this.triggerChange();
    if (onAutoCompleteRemove) {
      onAutoCompleteRemove(removeItem);
    }
  };

  callbackAddSubmit = item => {
    const { onAddItem } = this.props;
    this.addSelectedItem(item);
    if (onAddItem) {
      onAddItem(item);
    }
  };

  generateKeyword = (addDelimiter = false) => {
    const { multi = false } = this.props;
    if (this.value.length === 0) {
      return null;
    }
    let result = "";
    this.value.forEach(item => {
      result = `${result}${this.delimiter}${item.name}`;
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
    let { keyword } = this.state;
    if (this.value.length > 0) {
      keyword = null;
    }
    this.setState({ keyword });
    this.search(keyword);
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
          {item.name}
        </Tag >
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
      if (inputPrefixIcons && inputPrefixIcons.props && inputPrefixIcons.props.children) {
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
      if (inputSuffixIcons && inputSuffixIcons.props && inputSuffixIcons.props.children) {
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
        type: "category/search",
        payload: { keyword: newKeyword },
        callback: data => {
          this.setState({ dataSource: data.page.records });
        }
      });
    });
  };

  render() {
    const {
      dataSource,
      keyword,
      addModalVisible,
      searchModalVisible
    } = this.state;
    const {
      name = "商品类别",
      required = false,
      questionTitle = false,
      multi = false,
      hasAddBtn = true,
      hasClearBtn = true,
      hasXiangBtn = true,
      hasSearchBtn = true,
      inlineMode = true,
      className,
      size,
      prefixCls = "ant-input-search",
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
    const hasXiangBtnTmp = hasXiangBtn && hasValue && (this.value.length === 1);
    const hasClearBtnTmp = hasClearBtn && hasValue && !readOnly;
    const hasAddBtnTmp = hasAddBtn && !readOnly;
    const hasSearchBtnTmp = hasSearchBtn && !readOnly;
    let placeholder = `请选择${name}`;
    if (!utils.isNull(this.props.placeholder)) {
      placeholder = this.props.placeholder;
    } else if (hasValue) {
      placeholder = this.generateKeyword();
    }
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size,
      "employee-input": true
    });
    let inputPrefix = null;
    if (inlineMode || questionTitle) {
      inputPrefix = (
        <Fragment >
          {inlineMode ? name : null}
          {inlineMode && required ? (
            <strong style={{ color: "#DC143C" }} >* &nbsp;</strong >
          ) : null}
          {questionTitle ? (
            <Tooltip iconFlag title={questionTitle} >
              <Icon style={{ cursor: "pointer" }} type="question-circle" />
            </Tooltip >
          ) : null}
        </Fragment >
      );
    }
    const inputSuffix = (
      <Fragment >
        {hasClearBtnTmp ? (
          <Tooltip title={`清空${name}`} iconFlag >
            <Icon
              style={{ cursor: "pointer", marginRight: "4px" }}
              type="close-circle"
              onClick={this.handleClearClick}
            />
          </Tooltip >
        ) : null}
        {hasXiangBtnTmp ? (
          <Tooltip title={`查看${name}详情`} iconFlag >
            <i
              onClick={this.handleXiangChange}
              className="iconfont icon-xiang"
              style={{ cursor: "pointer", marginRight: "4px" }}
            />
          </Tooltip >
        ) : null}
        <PermissionAuth permissions="system:category:add" >
          {hasAddBtnTmp ? (
            <Tooltip title={`添加${name}`} iconFlag >
              <Icon
                onClick={this.handlePlusChange}
                style={{ cursor: "pointer", marginRight: "4px" }}
                type="plus"
              />
            </Tooltip >
          ) : null}
        </PermissionAuth >
        {hasSearchBtnTmp ? (
          <Tooltip title={`${name}选择`} iconFlag >
            <Icon
              onClick={this.handleSearchChange}
              style={{ cursor: "pointer" }}
              type="search"
            />
          </Tooltip >
        ) : null}
      </Fragment >
    );
    const options = dataSource.map(option => {
      return (
        <Option key={option.id} value={utils.uuid()} item={option} >
          <Ellipsis lines={1} tooltip >{option.fullText}</Ellipsis >
        </Option >
      );
    });
    const paddingLeft = this.calcPaddingLeftSpace(name, inlineMode, required, inputPrefix);
    const paddingRight = this.calcPaddingRightSpace(inlineMode, inputSuffix);
    return (
      <div
        className={style.categoryInput}
        onClick={this.firstClickCompleteInput}
      >
        <Tooltip title={this.generateAutoCompleteTag()} >
          <AutoComplete
            value={keyword}
            dataSource={!readOnly ? options : null}
            {...newAutoCompleteProps}
            onChange={this.handleCompleteChange}
            onSelect={this.handleCompleteSelect}
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
          </AutoComplete >
        </Tooltip >
        <CategoryModal
          currentItem={hasXiangBtnTmp && this.readOnly ? this.value[0] : {}}
          readOnly={this.readOnly}
          title={this.readOnly ? `${name}查看` : `${name}添加`}
          visible={addModalVisible}
          handleModalVisible={this.handleAddModalVisible}
          callbackSubmit={this.callbackAddSubmit}
        />
        <CategorySearchModal
          multi={multi}
          name={name}
          selectedRows={this.value}
          title={`${name}选择`}
          handleTableSelect={this.handleTableSelect}
          visible={searchModalVisible}
          handleModalVisible={this.handleSearchModalVisible}
        />
      </div >
    );
  }
}
