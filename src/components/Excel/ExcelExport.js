/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import * as utils from '../../utils/utils';

export default class ExcelExport extends PureComponent {
  /**
   *必填属性 dataSource 和 columns
   *    dataSource 格式同table
   *    columns 格式同table的columns 必须包含title 和 dataIndex字段
   * 非必填属性 filename sheetName name handleExportGetData()
   *  name 按钮名称默认为'download'
   *  filename 默认为'download'
   *  sheetName 工作薄名称默认为'sheet1'
   *  handleGetExportData() 通过handleGetExportData获取新的数据作为导出的数据源，然后调用callback到处excel
   */

  /**
   * 从数据源中取值放入表的data
   * @param dataIndexs 获取数据的index数组
   * @param newData 放入Excel中的数据
   * @param data  数据源
   * @param sumIndexs 用于求和的index数组
   * @param sumData 合计值
   */
  extracted = (dataIndexs, newData, data, sumIndexs, sumData) => {
    dataIndexs.forEach((dataIndex, index) => {
      newData.push(utils.getJsonValue(data, dataIndex));
      if (sumIndexs && sumData[index] !== null) {
        sumData[index] += isNaN(data[dataIndex]) ? 0 : data[dataIndex];
      }
    });
  };

  /**
   * 生成数据并导出excel
   */
  handleExport = (dataSource, handleExportData) => {
    if (handleExportData) {
      handleExportData(this.generateExcelFile);
      return true;
    }
    this.generateExcelFile(dataSource);
  };

  /**
   * 生成excel
   * @param originSource
   */
  generateExcelFile = (originSource) => {
    const { sheetName, filename, columns } = this.props;
    if (!columns) {
      message.error('未找到需要导出的数据!');
      return false;
    }
    const titles = [];
    const dataIndexs = [];
    const newDataSource = [];
    const sumIndexs = [];
    const sumData = [];
    columns.filter(column => 'title' in column && 'dataIndex' in column)
      .forEach((column) => {
        titles.push(column.title);
        dataIndexs.push(column.dataIndex);
        if ('renderType' in column && column.renderType === 'sum') {
          sumIndexs.push(column.dataIndex);
          sumData.push(0);
        } else {
          sumData.push(null);
        }
      });
    newDataSource.push(titles);
    if (dataIndexs) {
      if (originSource) {
        for (const data of originSource) {
          if (!data.isEmpty) {
            const newData = [];
            this.extracted(dataIndexs, newData, data, sumIndexs, sumData);
            newDataSource.push(newData);
          }
        }
        if (sumIndexs) {
          newDataSource.push(sumData);
        }
      }
    }
    const ws = XLSX.utils.aoa_to_sheet(newDataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'sheet1');
    XLSX.writeFile(wb, filename ? `${filename}.xlsx` : 'download.xlsx');
  };

  render() {
    const { name, icon, dataSource, handleExportData } = this.props;
    const newProps = { ...this.props };
    delete newProps.name;
    delete newProps.icon;
    delete newProps.handleExportData;
    delete newProps.dataSource;
    return (
      <Button
        {...newProps}
        icon={icon !== undefined ? icon : 'download'}
        onClick={() => this.handleExport(dataSource, handleExportData)}
      >
        {name || '导出'}
      </Button>
    );
  }
}
