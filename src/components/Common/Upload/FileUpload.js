import React, { PureComponent } from "react";
import { Icon, message, Upload } from "antd";
import lodash from "lodash";
import * as utils from "@/utils/utils";
import LoginUser from "@/utils/LoginUser";

/**
 * 这是一个文件杀死那个穿组件，使用方式，<FileUpload/>。
 * 额外属性：
 * fileSize = 1024，文件大小（单位M），1024
 * fileNum =1，文件数量，默认65536
 * fileMetas = ['image/jpeg', 'image/png', 'image/gif']，上传的时候支持的文件类型（文件类型对照表），默认无
 * isSingleArray 单个情况下是否用数组，默认为false，
 */
export default class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    const value = this.props.value || null;
    this.state = {
      value,
      fileList: this.generateFileList(value)
    };
  }

  /**
   *解决form resetFields的情况
   */
  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const { value } = nextProps;
      const fileList = this.generateFileList(value);
      this.setState({ value, fileList });
    }
  }

  handleFileBeforeUpload = (file, fileMetas, fileSize) => {
    let isMatchFileType = false;
    if (utils.isNull(fileMetas)) {
      isMatchFileType = true;
    } else {
      const fileMetasRegexStrs = fileMetas.map(item => lodash.replace(item, "*", ".*"));
      for (const fileMetasRegexStr of fileMetasRegexStrs) {
        const fileMetasRegex = new RegExp(fileMetasRegexStr, "ig");
        if (fileMetasRegex.test(file.type)) {
          isMatchFileType = true;
          break;
        }
      }
    }
    if (!isMatchFileType) {
      message.error("上传文件格式不对");
      return false;
    }
    const isLtSize = file.size / 1024 / 1024 < fileSize; // 2M
    if (!isLtSize) {
      message.error(`文件大小不能超过${fileSize}MB!`);
      return false;
    }
    return true;
  };

  handleFileChange = ({ file, fileList }) => {
    let isSetState = false;
    const { isSingleArray = false } = this.props;
    if (file.status === "removed" || file.status === "done") {
      let value = [];
      const fileListLen = fileList.length;
      if (fileListLen >= 1) {
        for (const fileTmp of fileList) {
          const { response } = fileTmp;
          if (!utils.isNull(fileTmp.url)) {
            value.push(fileTmp.url);
          } else if (!utils.isNull(response) && response.success) {
            let breakFlag = false;
            // 上传成功
            if (isSingleArray) {
              value.push(response.data.url);
            } else if (fileListLen === 1) {
              value = response.data.url;
              breakFlag = true;
            } else {
              value.push(response.data.url);
            }
            // 处理上传成功
            if (this.props.success) {
              this.props.success(response.data);
            }
            if (breakFlag) {
              break;
            }
          } else if (!utils.isNull(response) && !response.success) {
            // 处理上传失败
            if (this.props.error) {
              this.props.error(response.data);
            } else {
              alert(response.msg);
            }
          }
        }
      } else {
        value = null;
      }
      this.setState({ value, fileList: [...fileList] });
      this.triggerChange(value);
      isSetState = true;
    }
    if (file.status === "error") {
      message.error(`${file.name} 文件上传失败.`);
    }
    if (!utils.isNull(file.status) && !isSetState) {
      this.setState({ fileList: [...fileList] });
    }
  };

  generateUploadButton = () => {
    const { uploadButtonText = "选择文件" } = this.props;
    return (
      <div >
        <Icon type="plus" />
        <div >{uploadButtonText}</div >
      </div >
    );
  };

  triggerChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  generateFileList = (value) => {
    const fileList = [];
    if (!utils.isNull(value) && value !== "") {
      if (value instanceof Array) {
        for (let i = 0; i < value.length; i += 1) {
          fileList.push({
            uid: 0 - i,
            url: value[i],
            name: "logo",
            status: "done"
          });
        }
      } else {
        fileList.push({ uid: -1, url: value, name: "logo", status: "done" });
      }
    }
    return fileList;
  };

  render() {
    const {
      fileMetas,
      action = "/api/file/upload",
      beforeUpload,
      fileNum = 65536,
      fileSize = 1024
    } = this.props;
    const { fileList, value } = this.state;
    const newUploadProps = { ...this.props };
    delete newUploadProps.fileSize;
    delete newUploadProps.fileNum;
    delete newUploadProps.fileMetas;
    delete newUploadProps.onChange;
    delete newUploadProps.isSingleArray;
    delete newUploadProps.action;
    delete newUploadProps.success;
    delete newUploadProps.error;
    delete newUploadProps.headers;
    let beforeUploadFn = beforeUpload;
    if (utils.isNull(beforeUploadFn) || typeof beforeUploadFn !== "function") {
      beforeUploadFn = (file) => {
        return this.handleFileBeforeUpload(file, fileMetas, fileSize);
      };
    }
    return (
      <Upload
        action={action}
        headers={{ token: LoginUser.getToken() }}
        beforeUpload={beforeUploadFn}
        onChange={this.handleFileChange}
        fileList={fileList}
        value={value}
        {...newUploadProps}
      >
        {fileList.length >= fileNum ? null : this.generateUploadButton()}
      </Upload >
    );
  }
}
