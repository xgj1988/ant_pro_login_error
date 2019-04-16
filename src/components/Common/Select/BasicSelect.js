import React, {PureComponent} from 'react';
import {Select} from 'antd';
import style from './BasicSelect.less';

/**
 * 自定义参数
 * 1:leftPadding，輸入框左边距。
 * 2.prefixNode, 左前缀node
 */


export default class BasicSelect extends PureComponent {
  componentDidMount() {
    this.adaption();
  }

  componentDidUpdate() {
    this.adaption();
  }

  adaption = () => {
    let leftPadding = 0;
    const {prefixDiv} = this;
    if (prefixDiv.offsetWidth) {
      leftPadding = prefixDiv.offsetWidth + 10;
      const dom = this.BasicSelect.getElementsByClassName('ant-select-selection-selected-value')[0];
      const input = this.BasicSelect.getElementsByClassName('ant-select-search__field')[0];
      if (dom) {
        dom.style.paddingLeft = `${leftPadding}px`;
      }
      if (input) {
        input.style.paddingLeft = leftPadding;
      }
    }
  }

  render() {
    const {prefixNode} = this.props;
    const modalProps = {...this.props};
    return (
      <div
        className={style.BasicSelect}
        ref={(c) => {
          this.BasicSelect = c;
        }}
      >
        <div
          className={style.prefix}
          ref={(c) => {
            this.prefixDiv = c;
          }}
        >
          {prefixNode}
        </div>
        <Select
          {...modalProps}
        >
          {this.props.children}
        </Select>
      </div>
    );
  }
}

BasicSelect.Option = Select.Option;
