import React, { PureComponent } from 'react';
import BasicModal from '../Modal/BasicModal';
import EditColumnTable from './EditColumnTable';
import * as utils from '@/utils/utils';

export default class EditColumnModal extends PureComponent {
  constructor(props) {
    super(props);
    this.maxId = -1;
    this.state = {
      dataSource: this.gemerateDataSource(this.props.tableColumns)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.isUnmount) {
      return;
    }
    if (nextProps.tableColumns) {
      this.setState({
        dataSource: this.gemerateDataSource(nextProps.tableColumns)
      });
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  handleReset = () => {
    const { resetColumns } = this.props;
    resetColumns();
  };

  gemerateDataSource = (tableColumns) => {
    const result = [];
    let index = 0;
    for (const tableColumn of tableColumns) {
      const obj = {};
      obj.id = this.maxId;
      obj.index = index;
      obj.parent = null;
      obj.realTitle = utils.isEmptyStr(tableColumn.realTitle)
        ? tableColumn.title
        : tableColumn.realTitle;
      obj.showTitle = tableColumn.title;
      obj.visable = utils.isNull(tableColumn.visable)
        ? true
        : tableColumn.visable;
      obj.enter = utils.isNull(tableColumn.enter) ? false : tableColumn.enter;
      obj.order = 0 - this.maxId;
      obj.fixed = tableColumn.fixed;
      this.maxId = this.maxId - 1;
      index += 1;
      result.push(obj);
    }
    return result;
  };

  handleModalOk = () => {
    const { handleModalVisible, onChange } = this.props;
    const { dataSource } = this.state;
    handleModalVisible(false);
    onChange(dataSource);
  };

  handleChangeDataSource = (dataSource) => {
    this.setState({ dataSource });
  };


  render() {
    const { visible, handleModalVisible } = this.props;
    const { dataSource } = this.state;
    return (
      <BasicModal
        hasClear
        clearTxt="重置"
        onClear={this.handleReset}
        width={800}
        title="编辑列"
        visible={visible}
        onVisible={handleModalVisible}
        onOk={this.handleModalOk}
      >
        <EditColumnTable
          onChange={this.handleChangeDataSource}
          dataSource={dataSource}
        />
      </BasicModal>
    );
  }
}
