import React, { Fragment, PureComponent } from 'react';
import { Button, Modal, Row } from 'antd';
import ExcelExport from './ExcelExport'
import ExcelImport from './ExcelImport'
import * as utils from '@/utils/utils';

/**
 *必填属性  handleExcelToJson
 *    handleExcelToJson 导入Excel之后接收数据的函数
 * 非必填属性 title, description, templateColumns，filename
 *  title 导入界面标题
 *  description 导入界面内容描述
 *
 *  下载模板————相关参数filename,templateColumns
 *  filename优先级大于templateColumns
 *  filename 传入filename时从后端根据filename下载模板,文件必须放在后端resources目录下
 *  templateColumns 模板根据templateColumns在前端自动生成，格式同table中的columns
 */

/**
 * Excel导入窗口
 */
export default class ExcelImportModal extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '商品sku编码(必填)',
        dataIndex: 'product.fullText',
      },
      {
        title: '序列号',
        dataIndex: 'serialNo',
      },
      {
        title: '数量',
        dataIndex: 'serialNumber',
      },
      {
        title: '单价',
        dataIndex: 'price',
      },
      {
        title: '金额',
        dataIndex: 'amount',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleDownloadExcel = (filename) =>{
    utils.download(filename);
    this.handleCancel();
  };

  generateTemplate = (filename, templateColumns) => {
    if (filename) {
      return (
        <Button
          icon={null}
          type="danger"
          onClick={() =>this.handleDownloadExcel(filename)}
        >
          下载模板
        </Button>
      );
    }
    return (
      <ExcelExport
        columns={templateColumns}
        name="下载模板"
        icon={null}
        type="danger"
      />
    );
  }

  render() {
    const { title, description, templateColumns = this.columns, handleExcelToJson, filename } = this.props;
    return (
      <Fragment>
        <Button icon="upload" onClick={() => this.showModal()}>导入</Button>
        <Modal
          title={title || '单据导入'}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          {
            description || (
              <div style={{ marginLeft: 24 }}>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>导入规则说明</Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }} style={{ paddingTop: 15, paddingLeft: 15 }}>1.导入商品按编码精确匹配</Row>
                <Row
                  gutter={{ md: 24, lg: 24, xl: 48 }}
                  style={{ paddingTop: 5, paddingLeft: 15 }}
                >
                  2.如果未填写数量，则默认为1
                </Row>
                <Row
                  gutter={{ md: 24, lg: 24, xl: 48 }}
                  style={{ paddingTop: 5, paddingLeft: 15, fontWeight: 'bold' }}
                >
                  相同商品，数量自动累加
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }} style={{ paddingTop: 8 }}>
                  {this.generateTemplate(filename, templateColumns)}
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }} style={{ paddingTop: 38, paddingLeft: '80%' }}>
                  <ExcelImport
                    type="primary"
                    name="导入文件"
                    icon={null}
                    handleExcelToJson={handleExcelToJson}
                    importCallback={() => this.handleCancel()}
                  />
                </Row>
              </div>
            )
          }
        </Modal>
      </Fragment>
    );
  }
}
