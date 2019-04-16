/* eslint-disable no-underscore-dangle */
import { Icon } from 'antd';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import style from './SplitContainer.less';
import { getLeft } from '@/utils/utils';

/**
 * 分离器
 * name: 组件名称
 * leftNode: 左窗口显示内容
 * rightNode: 有窗口显示内容
 * option.minLeft: 左边最小移动到多少像素就不能移动了
 * option.rightLeft: 右边最小移动到多少像素就不能移动了
 * option.width : 分离器总宽度
 * option.height: 分离器总高度
 * option.leftBackground: 分离器左窗口背景颜色（十六进制）
 * option.rightBackround: 分离器有窗口背景颜色(十六进制)
 * option.isModal: 默认为true,当组件在Modal框里的时候一定要填写true，反之不在modal框里就要填写false,否则移动位置会有误差
 * option.toolbar: 是否显示工具栏
 * tools: 工具栏图标(接受参数为node  注意：只有option.toolabar为true才有用,icon一定要在div里,事件也写div里 如<div><Icon type="down" /></div>)
 */
export default class SplitContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      leftOffset: 0,
      banDrag: false,
      lastLineLeft: 0,
      treeFildShow: false,
      show: false,
      wrapWidth: 0
    };
  }

  componentWillMount() {
    this.init();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.init();
      }, 30);
    });
  }

  onMouseDown = () => {
    if (!this.state.banDrag) {
      this.setState({
        dragging: true,
        leftOffset: this.wrap.offsetLeft
      });
      this.content1.classList.add(style.noselect);
      this.content2.classList.add(style.noselect);
      this.line.classList.add(style.noselect);
    }
  };

  onMouseMove = (e, option) => {
    const { dragging, leftOffset } = this.state;
    if (dragging) {
      let clickX = e.pageX;
      const pLeft = getLeft(this.wrap) - this.wrap.offsetLeft;
      clickX -= pLeft;
      if (clickX - leftOffset < parseInt(option.minLeft, 10)) {
        clickX = leftOffset + parseInt(option.minLeft, 10);
      }
      if (clickX - leftOffset > parseInt(option.maxLeft, 10)) {
        clickX = leftOffset + parseInt(option.maxLeft, 10);
      }
      const lineLeft = clickX - leftOffset;
      if (clickX > leftOffset) {
        this.calculateWidth(lineLeft);
      }
    }
  };

  onMouseUp = () => {
    if (this.state.dragging) {
      this.cancelDragging();
    }
  };

  onMouseLeave = () => {
    if (this.state.dragging) {
      this.cancelDragging();
    }
  };

  cancelDragging = () => {
    this.setState({
      dragging: false
    });
    this.content1.classList.remove(style.noselect);
    this.content2.classList.remove(style.noselect);
    this.line.classList.remove(style.noselect);
  };

  shrink = () => {
    this.cancelDragging();
    this.setState({
      banDrag: true,
      treeFildShow: true
    });
    this.calculateWidth(30);
  };

  pop = () => {
    this.setState({
      banDrag: false,
      treeFildShow: false
    });
    this.calculateWidth(this.state.lastLineLeft);
  };

  calculateWidth = (lineLeft) => {
    this.setState({
      lastLineLeft: this.line.offsetLeft
    });
    const { wrapWidth } = this.state;
    const lineWidth = this.line.offsetWidth;
    this.line.style.left = `${lineLeft}px`;
    this.content1.style.width = `${lineLeft}px`;
    this.content2.style.width = `${wrapWidth - (lineLeft + lineWidth) - 1}px`;
    this.content2.style.marginLeft = `${lineWidth}px`;
  };

  init = () => {
    setTimeout(() => {
      if (this.wrap && this.wrap.offsetWidth) {
        this.setState({
          wrapWidth: this.wrap.offsetWidth
        });
        this.calculateWidth(this.line.offsetLeft);
        this.setState({
          show: true
        });
      }
    }, 30);
  };

  render() {
    const { treeFildShow, show } = this.state;
    const {
      lineObj = {},
      option = {},
      leftNode,
      rightNode,
      tools,
      name
    } = this.props;
    const _lineObj = {
      width: '1%',
      height: '100%',
      left: '20%'
    };
    const _option = {
      minLeft: '100px',
      maxLeft: '650px',
      height: '450px',
      width: '800px',
      leftBackground: '#FFFFFF',
      rightBackground: '#FFFFFF',
      isModal: true,
      toolbar: false
    };
    Object.assign(_lineObj, lineObj);
    Object.assign(_option, option);
    return (
      <div
        className={style.wrap}
        ref={(c) => {
          this.wrap = c;
        }}
        onMouseUp={this.onMouseUp}
        onMouseMove={(e) => {
          this.onMouseMove(e, _option);
        }}
        onSelectCapture={this.onSelect}
        onMouseLeave={this.onMouseLeave}
        style={{
          height: _option.height,
          width: _option.width,
          visibility: show ? 'visible' : 'hidden'
        }}
      >
        <div
          className={style.content1}
          ref={(c) => {
            this.content1 = c;
          }}
          style={{
            height: '100%',
            background: _option.leftBackground,
            border: '1px solid #cad1d8',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}
        >
          <div
            onClick={this.pop}
            className={style.treeFild}
            style={{
              height: '100%',
              textAlign: 'left',
              color: '#346ac9',
              cursor: 'pointer',
              display: treeFildShow ? 'block' : 'none'
            }}
          >
            <div className="treeIcon" style={{ padding: '14px 0px 0px 6px' }}>
              <Icon type="double-right" />
            </div>
            <div
              className="treeTitle"
              style={{ padding: '5px', lineHeight: '1.6em' }}
            >
              {name}
            </div>
          </div>
          <div
            className="content"
            style={{ display: !treeFildShow ? 'block' : 'none' }}
          >
            <div
              className={style.treeToolbar}
              style={{ display: _option.toolbar ? 'block' : 'none' }}
            >
              <div className={style.dockbody}>{name}</div>
              {tools}
              <div
                onClick={() => {
                  this.shrink();
                }}
              >
                <Icon type="double-left" />
              </div>
            </div>
            {leftNode}
          </div>
        </div>
        <div
          ref={(c) => {
            this.line = c;
          }}
          className={style.line}
          onMouseDown={this.onMouseDown}
          style={{
            width: _lineObj.width,
            height: _lineObj.height,
            left: _lineObj.left
          }}
        >
          <div
            className={classNames({
              [style.lineThumb]: true
            })}
          >
            <div className={style.v} />
          </div>
        </div>
        <div
          className={style.content2}
          ref={(c) => {
            this.content2 = c;
          }}
          style={{
            height: '100%',
            background: _option.rightBackground,
            border: '1px solid #cad1d8',
            boxSizing: 'border-box'
          }}
        >
          {rightNode}
        </div>
      </div>
    );
  }
}
