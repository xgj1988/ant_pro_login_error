import React, { PureComponent } from 'react';
import { Icon, Input, Tooltip } from 'antd';
import classNames from 'classnames';
import * as utils from '@/utils/utils';
import styles from './ResetInput.less';

/**
 * 这是一个带清空按钮的输入框组件，使用方式，<ResetInput/>。
 * 额外属性：
 * inlineMode 是否内联样式，默认为 false
 */
export default class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.realItem = null;
    const value = this.props.value || '';
    this.state = {
      value
    };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }


  componentDidMount() {
    this.adaption();
  }

  /**
   *解决form resetFields的情况
   */
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  componentDidUpdate() {
    this.adaption();
  }

  adaption = () => {
    let prefixPadding = 0;
    let suffixPadding = 0;
    if (this.inputPrefix) {
      prefixPadding = this.inputPrefix.offsetWidth + 20;
    }
    if (this.inputSuffix) {
      suffixPadding = this.inputSuffix.offsetWidth + 20;
    }
    if (prefixPadding && this.input) {
      this.input.style.paddingLeft = `${prefixPadding}px`;
    }
    if (suffixPadding && this.input) {
      this.input.style.paddingRight = `${suffixPadding}px`;
    }
  };

  handleResetSuffixClick = (e) => {
    e.stopPropagation();
    const { onResetClick } = this.props;
    if (onResetClick) {
      onResetClick(e);
    }
    this.triggerChange('');
    this.focusInput();
  };

  handleStopBlur = (e) => {
    e.stopPropagation();
  };

  handleChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ value });
      this.props.onChange(e);
    }
  };

  focusInput = () => {
    setTimeout(() => {
      if (this.realItem && this.realItem.focus) {
        this.realItem.focus();
      }
    });
  };

  render() {
    const {
      name = '',
      required = false,
      className,
      maxLength = 200,
      size,
      prefixCls = 'ant-input-search',
      inputPrefixCls = 'ant-input',
      inlineMode,
      clear
    } = this.props;
    const { type, value } = this.state;
    const newInputProps = { ...this.props };
    delete newInputProps.className;
    delete newInputProps.size;
    delete newInputProps.maxLength;
    delete newInputProps.prefixCls;
    delete newInputProps.inputPrefixCls;
    delete newInputProps.onResetClick;
    delete newInputProps.onChange;
    delete newInputProps.name;
    delete newInputProps.inlineMode;
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size
    });
    let inputPrefix = null;
    if (inlineMode) {
      inputPrefix = (
        <div
          className={styles.prefix}
          ref={(c) => {
            if (c) {
              this.inputPrefix = c;
            }
          }}
        >
          {inlineMode ? name : null}
          {inlineMode && required ? (
            <strong style={{ color: '#DC143C' }}>* &nbsp;</strong>
          ) : null}
        </div>
      );
    }
    let inputSuffix = null;
    if (!utils.isNull(value) && value.length > 0) {
      inputSuffix = (
        <div
          className={styles.suffix}
          ref={(c) => {
            if (c) {
              this.inputSuffix = c;
            }
          }}
        >
          {clear ? (
            <Tooltip title="清空" iconFlag>
              <Icon
                onBlur={this.handleStopBlur}
                className={styles.clear}
                type="close-circle"
                style={{ cursor: 'pointer' }}
                onClick={this.handleResetSuffixClick}
              />
            </Tooltip>
          ) : null}
        </div>
      );
    }
    return (
      <div className={styles.ResetInput}>
        <Input
          ref={(input) => {
            if (input) {
              this.input = input.input;
            }
          }}
          value={value}
          type={type}
          prefix={inputPrefix}
          suffix={inputSuffix}
          maxLength={maxLength}
          className={inputClassName}
          prefixCls={inputPrefixCls}
          onChange={this.handleChange}
          size={size}
          {...newInputProps}
        />
      </div>
    );
  }
}
