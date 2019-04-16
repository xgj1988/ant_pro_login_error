import React, {Fragment, PureComponent} from 'react';
import {Icon, Input, Popconfirm} from 'antd';
import classNames from 'classnames';


/**
 * 这是一个密码组件，使用方式，<Password/>。
 * 额外属性：
 * showEye = boolean，是否显示眼睛图标，默认true
 * showRest =boolean，是否显示重置按钮，默认false
 * resetValue= 123456 重置按钮，点击之后password的值，默认123456
 */
export default class Password extends PureComponent {
  constructor(props) {
    super(props);
    this.realItem = null;
    const value = this.props.value || '';
    this.state = {
      type: 'password',
      iconType: 'eye',
      value,
    };
  }

  /**
   *解决form resetFields的情况
   */
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const {value} = nextProps;
      this.setState({value});
    }
  }


  handleEyeSuffixClick = () => {
    if (this.state.type === 'password') {
      this.setState({
        type: 'text',
        iconType: 'eye-o',
      });
    } else {
      this.setState({
        type: 'password',
        iconType: 'eye',
      });
    }
  };

  handleResetSuffixClick = () => {
    const {resetValue = '123456'} = this.props;
    this.triggerChange(resetValue);
  };


  handleChange = (e) => {
    const {value} = e.target;
    this.triggerChange(value);
  };

  triggerChange = (value) => {
    this.setState({value});
    const {onChange} = this.props;
    if (onChange) {
      onChange(value);
    }
  };


  generateSuffix = () => {
    const {showEye = true, showRest = false} = this.props;
    const {iconType} = this.state;
    const generateEyeIcon = () => {
      return (
        <Icon
          type={iconType}
          style={{cursor: 'pointer'}}
          onClick={this.handleEyeSuffixClick}
          key="eyeIcon"
        />
      );
    };

    const generateResetIcon = () => {
      const {resetValue = '123456'} = this.props;
      return (
        <Popconfirm
          title={`是否重置密码为${resetValue}`}
          onConfirm={this.handleResetSuffixClick}
          okText="确定"
          cancelText="取消"
        >
          <i
            className="iconfont icon-Reset"
            style={{cursor: 'pointer', marginLeft: '2px'}}
          />
        </Popconfirm>
      );
    };
    if (showEye && showRest) {
      return (
        <Fragment>
          {generateEyeIcon()}
          {generateResetIcon()}
        </Fragment>
      );
    } else if (showEye) {
      return generateEyeIcon();
    } else if (showRest) {
      return generateResetIcon();
    } else {
      return (<Fragment/>);
    }
  };


  render() {
    const {className, maxLength = 20, size, prefixCls = 'ant-input-search', inputPrefixCls = 'ant-input'} = this.props;
    const {type, value} = this.state;
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size,
    });
    // 删除一些不必要的属性。以免报错。
    const newInputProps = {...this.props};
    delete newInputProps.showEye;
    delete newInputProps.showRest;
    delete newInputProps.resetValue;
    return (
      <Input
        ref={(input) => {
          this.realItem = input;
        }}
        value={value}
        type={type}
        suffix={this.generateSuffix()}
        maxLength={maxLength}
        className={inputClassName}
        prefixCls={inputPrefixCls}
        onChange={this.handleChange}
        {...newInputProps}
      />
    );
  }
}
