/* eslint-disable */
import React, { Component } from 'react';

const {uploadHost} = window._config;
const UE = window.UE;

class Ueditor extends Component {
  // componentWillReceiveProps(nextProps){
  //     const { value: nv } = nextProps;
  //     const { value: tv } = this.props;
  //     if(nv!==tv){
  //         this.UEditor.ready(()=>{
  //             this.UEditor.setContent(nv||'');
  //         });
  //     }
  // }
  componentDidMount() {
    this.UEditor = UE.getEditor(this.props.id, {
      autoClearinitialContent: false, // focus时自动清空初始化时的内容
      wordCount: true, // 关闭字数统计
      elementPathEnabled: false, // 关闭elementPath
      serverUrl: uploadHost,
      initialFrameWidth: '100%',
      initialFrameHeight: '600',
    });
    this.UEditor.ready(() => {
      this.UEditor.setContent(this.props.value || '');
      this.UEditor.setHeight(this.props.height);
      this.UEditor.addListener('selectionchange', () => {
        const value = this.UEditor.getContent();
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      });
    });
  }

  componentWillUnmount() {
    UE.delEditor(this.props.id);
    this.UEditor.removeListener('selectionchange', () => {
      const value = this.UEditor.getContent();
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    });
    const dom = document.getElementById(this.props.id);
    const parentDom = dom.parentElement;
    parentDom.removeChild(dom);
  }

  render() {
    return (
      <div>
        <script type="text/plain" id={this.props.id} />
      </div>
    );
  }
}

export default Ueditor;
