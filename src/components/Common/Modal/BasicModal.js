import React, { Fragment, PureComponent } from 'react';
import { Button, Modal } from 'antd';

/**
 * 自定义参数
 * 1:onShow，显示的时候事件。
 * 2:hasContinue 是否有继续按钮。 默认true
 * 3:addFlag添加标记。
 * 4:hasOk  是否有确定按钮 默认为 true
 * 5:hasClear 是否有清空按钮 默认为false
 * 6:onClear 增加onClear事件
 * 7:footer 自定义（只是扩展，还是会保留以前的按钮）
 * 8:clearTxt 清空文本。
 * 9:okLoading 点击确认按钮的时候是否loading状态。
 */
export default class BasicModal extends PureComponent {
  constructor(props) {
    super(props);
    this.firstShow = true;
  }


  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    const { onShow } = this.props;
    if (visible) {
      if (this.firstShow) {
        this.firstShow = false;
        if (onShow) {
          onShow();
        }
      }
    } else {
      this.firstShow = true;
    }
  }


  handleClearClick = (e) => {
    e.stopPropagation();
    const { onClear } = this.props;
    if (onClear) {
      onClear();
    }
  };

  handleOkClick = (e, modalVisible) => {
    e.stopPropagation();
    const { addFlag, onOk } = this.props;
    if (onOk) {
      onOk(addFlag, modalVisible);
    }
  };

  render() {
    const { addFlag, onVisible, clearTxt = '清空', style = {}, hasContinue = true, maskClosable = false, hasClear = false, hasOk = true, footer, okLoading } = this.props;
    if (!style.top) {
      style.top = 30;
    }
    const footerTmp = (
      <Fragment>
        {footer}
        {
          (hasClear) ?
            (<Button type="dashed" onClick={this.handleClearClick}>{clearTxt}</Button>)
            : null
        }
        <Button onClick={() => onVisible(false)}>取消</Button>
        {
          (hasOk) ?
            (
              <Fragment>
                <Button type="primary" loading={okLoading} onClick={e => this.handleOkClick(e, false)}>确定</Button>
                {
                  (hasContinue && addFlag) ?
                    (
                      <Button
                        type="primary"
                        loading={okLoading}
                        onClick={e => this.handleOkClick(e, true)}
                      >保存并继续
                      </Button>
                    )
                    : null
                }
              </Fragment>
            ) : null
        }
      </Fragment>
    );
    const newModalProps = { ...this.props };
    delete newModalProps.addFlag;
    delete newModalProps.hasContinue;
    delete newModalProps.onShow;
    delete newModalProps.onOk;
    delete newModalProps.onClear;
    delete newModalProps.maskClosable;
    delete newModalProps.hasClear;
    delete newModalProps.style;
    delete newModalProps.footer;
    delete newModalProps.clearTxt;
    delete newModalProps.okLoading;
    return (
      <Modal
        confirmLoading={okLoading}
        {...newModalProps}
        maskClosable={maskClosable}
        footer={footerTmp}
        onCancel={() => onVisible(false)}
        destroyOnClose
        style={style}
      >
        {this.props.children}
      </Modal>
    );
  }
}
