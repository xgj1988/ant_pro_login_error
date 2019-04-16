/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Button, message, Upload } from 'antd';
import * as XLSX from 'xlsx';

export default class ExcelExport extends PureComponent {
  /**
   *必填属性 handleExcelToJson
   *    handleExcelToJson 获取从excel中读取的data
   * 非必填属性 name firstDataRow
   *  name 默认为'导入'
   *  firstDataRow 从第几行开始读取数据,默认为1
   */

  render() {
    const {name, icon, firstDataRow, handleExcelToJson, importCallback} = this.props;
    const newProps = {...this.props};
    delete newProps.name;
    delete newProps.icon;
    delete newProps.firstDataRow;
    delete newProps.handleExcelToJson;
    delete newProps.importCallback;
    const props = {
      action: '/file/upload',
      beforeUpload(file) { // 上传文件之前校验格式
        if (!(file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
          message.error('文件格式不正确,请上传Excel文件!');
          return false;
        }
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, {header: firstDataRow || 1});
          if (!handleExcelToJson) {
            message.error('还未传入数据导入之后的处理');
            return false;
          }
          handleExcelToJson(data);
          if (importCallback) {
            importCallback();
          }
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
        return false;
      },
      showUploadList: false,
    };
    return (
      <Upload {...props}>
        <Button
          {...newProps}
          icon={icon !== undefined ? icon : 'upload'}
        >
          {name || '导入'}
        </Button>
      </Upload>
    );
  }
}
