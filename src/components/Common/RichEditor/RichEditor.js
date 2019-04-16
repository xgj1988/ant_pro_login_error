import React, { PureComponent } from 'react';
import { message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import cssStyle from './RichEditor.less';
import * as utils from '@/utils/utils';

export default class RichEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.editorInstance = null;
    const value = props.value || null;
    this.state = {value};
  }


  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const stateValue = this.state.value;
      const {value} = nextProps;
      if (stateValue !== value) {
        this.setState({value});
      }
    }
  }

  clearContent = () => {
    if (this.editorInstance) {
      this.editorInstance.clear();
    }
    this.handleValueChange(null);
  };

  uploadFn = (param) => {
    const serverURL = '/api/file/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = () => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      const {data} = JSON.parse(xhr.responseText);
      param.success({
        url: data.url,
        meta: {
          id: param.libraryId,
        }
      });
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      message.error('上传文件失败');
      param.error({
        msg: 'unable to upload.'
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };


  validateUploadFile = (file) => {
    // 5M
    const result = file.size < 1024 * 1024 * 5;
    if (!result) {
      message.error('文件大小过大，只能上传小于5M的文件');
    }
    return result;
  };

  preview = () => {
    utils.previewHtml(this.state.value);
  };


  handleValueChange = (value) => {
    let valueTmp = value;
    if (value === '<p></p>') {
      valueTmp = null;
    }
    this.setState({value: valueTmp});
    this.triggerChange(valueTmp);
  };


  triggerChange = (value) => {
    // Should provide an event to pass value to Form.
    const {onChange} = this.props;
    if (onChange) {
      onChange(value);
    }
  };


  render() {
    const {value} = this.state;
    const {style = {}, hasPreview = false} = this.props;
    const newBraftEditorProps = {...this.props};
    delete newBraftEditorProps.fileSize;
    delete newBraftEditorProps.fileNum;
    delete newBraftEditorProps.fileMetas;
    delete newBraftEditorProps.onChange;
    delete newBraftEditorProps.style;
    delete newBraftEditorProps.hasPreview;
    let extendControls = [];
    if (hasPreview) {
      extendControls = [{
        type: 'split'
      }, {
        type: 'button',
        text: '预览',
        html: '预览',
        onClick: this.preview
      }];
    }
    return (
      <div id="editorDivId" style={style} className={cssStyle.editorWrapper}>
        <BraftEditor
          ref={(instance) => {
            this.editorInstance = instance;
          }}
          viewWrapper="#editorDivId"
          onChange={this.handleValueChange}
          contentFormat="html"
          initialContent={value}
          excludeControls={['code']}
          {...newBraftEditorProps}
          media={{
            allowPasteImage: true,
            image: true,
            video: true,
            audio: true,
            uploadFn: this.uploadFn,
            validateFn: this.validateUploadFile
          }}
          extendControls={extendControls}
        />
      </div>
    );
  }
}
