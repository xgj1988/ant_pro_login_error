/* eslint-disable import/no-cycle,jsx-a11y/label-has-associated-control */
import React, { Fragment, PureComponent } from "react";
import { Table, Tooltip } from "antd";
import clone from "clone";
import LinkedMap from "linked-map";
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import EditColumnModal from "./EditColumnModal";
import * as utils from "@/utils/utils";
import styles from "./BasicTable.less";
import Ellipsis from "../../Ellipsis";
import Constant from "@/utils/Constant";

/**
 * 已知BUG：
 * 自定义参数
 * showLineNum 是否显示行 默认 true
 * lineNumFix 默认true
 * align 默认column对齐方式
 * calcScrollX 是否自动计算scrollX
 * calcScrollY 是否自动计算scrollY
 * onRowDbClick 行双击
 * onRowClick 行单击事件
 * onPageChange 页面改变事件
 * rowKey = (record => record.id)
 * bordered 默认true
 * totalRow 默认 false
 * lastColumn 默认true  是否自动加入最后一列
 * autoFillRowNum 自动填充row数量，负数(-1)表示不填充 默认 10
 * hasEditButton 是否有编辑列按钮
 * isEditSave 编辑列是否可以保存
 * isEditColumnTable 是否编辑列table
 * showTotal total => `共${total}条`,
 * autoAlign 自动对齐
 * column相关
 *  1：renderType：暂时只支持sum，average,ellipsis 。
 *  2: sortName:排序名称，默认无，没有就会用columnIndex。
 *  3：sortZh:是否中文，默认true。
 *  4: drag：true可以拖动，false 不能拖动，如果没填写，并且column的fix属性也没有，那么默认可以拖动。（如果有fixed属性，drag属性没有设置，则为可以拖动）
 *  5：renderDecimals：render的数据保留几位小数。
 *
 */
export default class BasicTable extends PureComponent {
  constructor(props) {
    super(props);
    this.originColumns = clone(props.columns);
    for (const originColumn of this.originColumns) {
      originColumn.realTitle = originColumn.title;
    }
    this.state = {
      selectRecord: null,
      showEditColumnVisible: false,
      columns: props.columns || [],
      sortedInfo: null
    };
  }


  componentWillReceiveProps(nextProps) {
    if (!utils.deepCompare(this.props.columns, nextProps.columns)) {
      this.originColumns = clone(nextProps.columns);
      this.setState({ columns: nextProps.columns });
    }
  }

  /**
   * 编辑列改变
   * @param columnDataSource
   */
  handleColumnDataSourceChange = columnDataSource => {
    const { columns } = this.state;
    const newColumns = [];
    for (const item of columnDataSource) {
      const itemTmp = columns.find((value, index) => item.index === index);
      itemTmp.realTitle = item.realTitle;
      itemTmp.title = item.showTitle;
      itemTmp.visible = item.visible;
      itemTmp.enter = item.enter;
      newColumns.push(itemTmp);
    }
    this.setState({ columns: newColumns });
  };

  /**
   * 重置列
   */
  handleResetColumns = () => {
    const originColumnsCopy = clone(this.originColumns);
    this.setState({ columns: originColumnsCopy });
  };

  handleRowClick = record => {
    this.setState({ selectRecord: record });
    const { onRowClick } = this.props;
    if (onRowClick) {
      onRowClick(record);
    }
  };

  /**
   * 现实编辑列modal
   * @param modalVisible
   */
  handleShowEditColumnModal = modalVisible => {
    this.setState({ showEditColumnVisible: modalVisible });
  };


  /**
   * row选中的方法(眼那个是改变)
   * @param record
   * @param index
   * @param stylesObj
   * @returns {*}
   */
  rowClassNameFn = (record, index, stylesObj) => {
    const { selectRecord } = this.state;
    if (!utils.isNull(selectRecord) && selectRecord.id === record.id) {
      return stylesObj.selectRow;
    }
    return null;
  };

  /**
   * 生成新的dataSource和返回真实的记录数
   * @param dataSource
   * @returns {{newDataSource: *[], realRecordNum: number}}
   */
  generateNewDataSource = (dataSource) => {
    let newDataSource = dataSource;
    let nextId = -2147483648;
    const totalDataSource = [];
    const realRecordNum = dataSource.length;
    // 如果没得ID，自动生成ID
    if (dataSource.length > 0) {
      if (!dataSource[0].id) {
        // eslint-disable-next-line
        dataSource.forEach((obj) => {
          nextId += 1;
          // eslint-disable-next-line
          obj.id = nextId + "";
        });
      }
    }
    // 填充数据
    let { autoFillRowNum = 10 } = this.props;
    const { pagination, totalRow = false } = this.props;
    if (autoFillRowNum > 0) {
      if (!utils.isEmptyObject(pagination) && pagination.pageSize) {
        autoFillRowNum = pagination.pageSize;
      }
      const size = autoFillRowNum - newDataSource.length;
      if (size > 0) {
        newDataSource = clone(dataSource);
        const lastId = newDataSource[newDataSource.length - 1] ? newDataSource[newDataSource.length - 1].id : null;
        if (lastId < 0) {
          nextId = lastId;
        }
        for (let i = 0; i < size; i += 1) {
          nextId += 1;
          newDataSource.push({ id: `${nextId}`, autoCreate: true });
        }
      }
    }
    // 生成合计行DataSource
    if (totalRow) {
      nextId += 1;
      totalDataSource.push({ id: `${nextId}`, autoCreate: true, totalRow: true });
    }
    return { newDataSource, totalDataSource, realRecordNum };
  };

  /**
   * 生成新的列，指定是否显示行号，和默认排序。
   * @param cssStyles
   * @param columns
   * @param dataSource
   * @param hasEditButton
   * @returns {*}
   */
  generateNewColumns = (cssStyles, columns, dataSource, hasEditButton, realRecordNum) => {
    const {
      showLineNum = true,
      align = "center",
      pagination,
      onCellDbClick,
      onCellClick,
      totalRow = false,
      totalRowHeaderTxt = "合计",
      isEditColumnTable = false
    } = this.props;
    // 如果是编辑列table 直接返回。
    if (isEditColumnTable) {
      return columns;
    }
    let newColumns = [...columns];
    // 哪些行不显示。
    newColumns = newColumns.filter((item) => {
      return (utils.isNull(item.lastColumn) || item.lastColumn) || (utils.isNull(item.visible) || item.visible);
    });
    // 显示行号。
    if (showLineNum) {
      const numColumnWidth = this.calcNumColumnWidth(dataSource);
      // let numFixed = null;
      let hasEditButtonDom = null;
      // 显示编辑列图标
      if (hasEditButton) {
        hasEditButtonDom = (
          <Tooltip title="编辑列" >
            <i
              onClick={() => this.handleShowEditColumnModal(true)}
              className="iconfont icon-setting"
              style={{ cursor: "pointer", fontSize: "15px" }}
            />
          </Tooltip >
        );
      }
      // if (lineNumFix) {
      //   numFixed = 'left';
      // }

      // 增加设置列
      const numColumn = {
        title: hasEditButtonDom,
        width: numColumnWidth,
        key: "zyzc_setting",
        // fixed: numFixed,
        className: styles.cellEdit,
        align,
        render: (text, record, index) => {
          let result = null;
          if (totalRow && record.totalRow) {
            return (<strong >{totalRowHeaderTxt}</strong >);
          }
          if (this.hasPagination(pagination)) {
            result = (pagination.current - 1) * pagination.pageSize + index + 1;
          } else {
            result = index + 1;
          }
          return result;
        }
      };
      newColumns.unshift(numColumn);
    }

    // 处理column
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    // let indexColumn = 0;
    for (const newColumn of newColumns) {
      // 设置默认对齐方式
      if (utils.isNull(newColumn.align)) {
        newColumn.align = align;
      }
      if (utils.isNull(newColumn.drag) && !utils.isNull(newColumn.fixed)) {
        newColumn.drag = false;
      }
      // 设置sortOrder参数
      if (newColumn.sorter) {
        newColumn.sortOrder = (sortedInfo.columnKey === newColumn.dataIndex && sortedInfo.order);
      }
      // 设置onCell事件
      if (!newColumn.onCell) {
        newColumn.onCell = () => ({
          onClick: e => {
            if (newColumn.editable) {
              const dom = e.target.firstElementChild;
              if (dom && dom.click) {
                dom.click();
              }
            } else if (onCellClick) {
              onCellClick(e);
            }
          },
          onDoubleClick: e => {
            // 双击事件
            if (onCellDbClick) {
              onCellDbClick(e);
            }
          }
        });
      }
      // 如果是编辑列，就设置列样式
      if (newColumn.editable) {
        if (newColumn.className) {
          newColumn.className += ` ${cssStyles.cellEdit}`;
        } else {
          newColumn.className = cssStyles.cellEdit;
        }
      }

      // 修改render
      const oldRender = newColumn.render;
      newColumn.render = (val, record, index) => {
        // 如果renderType有，那么就用renderType渲染
        const recordTotalRow = record.totalRow || false;
        let resultValue = val;
        if (newColumn.renderType) {
          // 合计行
          if (recordTotalRow) {
            if (newColumn.renderType === "sum") {
              // 求和
              resultValue = this.aggregationSum(dataSource, newColumn);
            } else if (newColumn.renderType === "average") {
              // 平均值
              resultValue = this.aggregationAverage(dataSource, newColumn, realRecordNum);
            }
          } else if (newColumn.renderType === "ellipsis") {
            // ellipsis
            resultValue = <Ellipsis lines={1} tooltip >{val}</Ellipsis >;
          } else {
            resultValue = val;
          }
        }
        if (recordTotalRow && newColumn.title === "操作") {
          return (
            { /* <div style={{ minWidth: '80px' }} /> */ }
          );
        }
        if (oldRender) {
          return oldRender(resultValue, record, index, recordTotalRow);
        } else {
          return resultValue;
        }
      };
      // eslint-disable-next-line
      // newColumn.onHeaderCell = column => ({
      //   width: column.width,
      //   onResize: this.handleResize(indexColumn)
      // });
      // indexColumn += 1;
    }
    // newColumns = newColumns.map((col, index) => ({
    //   ...col,
    //   onHeaderCell: column => ({
    //     width: column.width,
    //     onResize: this.handleResize(index)
    //   })
    // }));
    return newColumns;
  };

  /**
   * 计算数字行宽度
   * @param dataSource
   * @returns {number}
   */
  calcNumColumnWidth = dataSource => {
    const { pagination, totalRow = false } = this.props;
    let numColumnWidth = 20;
    let maxRecordNum = dataSource.length;
    if (this.hasPagination(pagination)) {
      maxRecordNum =
        (pagination.current - 1) * pagination.pageSize + dataSource.length;
    }
    if (maxRecordNum < 10) {
      numColumnWidth = 20;
    } else if (maxRecordNum < 100) {
      numColumnWidth = 50;
    } else if (maxRecordNum < 1000) {
      numColumnWidth = 80;
    } else if (maxRecordNum < 10000) {
      numColumnWidth = 100;
    } else if (maxRecordNum < 100000) {
      numColumnWidth = 120;
    } else {
      numColumnWidth = 140;
    }
    if (totalRow && numColumnWidth < 80) {
      numColumnWidth = 80;
    }
    return numColumnWidth;
  };

  /**
   * 计算scrollX宽度
   * @param columns
   */
  calcScrollFn = columns => {
    const { calcScrollX = false, calcScrollY = false, scroll = {}, size = "middle" } = this.props;
    let result = scroll;
    if (calcScrollX) {
      if (scroll) {
        result = { ...scroll };
        delete result.x;
      } else {
        result = {};
      }
      let newX = 0;
      for (const column of columns) {
        const columnWidth = column.width;
        if (columnWidth) {
          let columnWidthTmp = columnWidth;
          if (typeof columnWidth === "string") {
            columnWidthTmp = parseInt(columnWidth.replace("px", ""), 0);
          }
          newX += columnWidthTmp;
        }
      }
      result.x = newX;
    }

    if (calcScrollY) {
      if (size === "small") {
        result.y = 382;
      } else if (size === "default") {
        result.y = 542;
      } else if (size === "tiny") {
        result.y = 260;
      }
    }
    return result;
  };


  /**
   * 求和
   * @param dataSource
   * @param dataIndex
   * @returns {number}
   */
  aggregationSum = (dataSource, newColumn) => {
    const { dataIndex, renderDecimals = 0 } = newColumn;
    let result = 0;
    for (const item of dataSource) {
      if (!item.autoCreate) {
        const valueTmp = Number(utils.getJsonValue(item, dataIndex));
        if (!isNaN(valueTmp)) {
          result += valueTmp;
        }
      }
    }
    result = utils.numberFormat(result, renderDecimals);
    return result;
  };

  /**
   * 平均值
   * @param dataSource
   * @param dataIndex
   * @returns {number}
   */
  aggregationAverage = (dataSource, newColumn, realRecordNum) => {
    const { dataIndex, renderDecimals = 0 } = newColumn;
    const sum = this.aggregationSum(dataSource, dataIndex);
    let result = sum / realRecordNum;
    result = utils.numberFormat(result, renderDecimals);
    return result;
  };

  /**
   * 是否有分页
   * @param pagination
   * @returns {boolean|*|number}
   */
  hasPagination = pagination => {
    return (
      !utils.isEmptyObject(pagination) &&
      pagination.current &&
      pagination.pageSize
    );
  };

  // eslint-disable-next-line no-undef
  handleTableOnChange = ({ current, pageSize: size } = pagination, filters, sorterObj) => {
    const { remoteSelectFn, selectCondition } = this.props;
    if (selectCondition) {
      this.setState({
        sortedInfo: sorterObj
      });
      const oldSize = selectCondition.size;
      const oldCurrent = selectCondition.current;
      let sortFlag = false;
      let searchFlag = false;
      // 排序
      if (sorterObj && sorterObj.column && (sorterObj.column.sorter === true)) {
        // 只允许排序一个字段
        utils.deleteFromObject("orderList[", selectCondition);
        delete selectCondition.zyzcOrderMap;
        //
        let { zyzcOrderMap } = selectCondition;
        if (utils.isEmptyObject(zyzcOrderMap)) {
          zyzcOrderMap = new LinkedMap();
        }
        let finalSortName = sorterObj.columnKey;
        const { sortZh } = sorterObj.column;
        if (sorterObj.column.sortName) {
          const { sortName } = sorterObj.column;
          finalSortName = sortName;
        }
        zyzcOrderMap.remove(finalSortName);
        zyzcOrderMap.unshift(finalSortName, sorterObj.order === "ascend");
        // 数据转换
        let index = 0;
        zyzcOrderMap.each((key, value) => {
          let newKey = key;
          if (!utils.isNull(sortZh) || sortZh === true) {
            newKey = `convert(${key} using gbk)`;
          }
          selectCondition[`orderList[${index}].name`] = newKey;
          selectCondition[`orderList[${index}].asc`] = value;
          index += 1;
        });
        selectCondition.zyzcOrderMap = zyzcOrderMap;
        sortFlag = true;
        searchFlag = true;
        selectCondition.current = Constant.defaultPagination.current;
      }
      // 过滤
      // if (!utils.isEmptyObject(filters)) {
      //   let index = 0;
      //   for (let field in filters) {
      //     if (data.hasOwnProperty(i) === true) {
      //       console.log(data[i])
      //     }
      //     index += 1;
      //     selectCondition[`conditionList[${index}].name`] = newKey;
      //   }
      // }
      // 分页
      // 重置分页  满足条件：如果当前页数没有改变，说明不是分页，那么就是过滤和排序，则重置。
      if (!sortFlag && (!utils.isNull(size) && (size !== oldSize))) {
        selectCondition.size = size;
        selectCondition.current = Constant.defaultPagination.current;
        searchFlag = true;
      }
      // 重置分页  满足条件：如果当前页数没有改变，说明不是分页，那么就是过滤和排序，则重置。
      if (!sortFlag && (!utils.isNull(current) && (current !== oldCurrent))) {
        selectCondition.current = current;
        searchFlag = true;
      }
      // 查询
      if (searchFlag && remoteSelectFn) {
        remoteSelectFn(selectCondition);
      }
    }
  };


  render() {
    const {
      onRowDbClick,
      hasEditButton = true,
      isEditColumnTable = false,
      dataSource = [],
      pagination,
      bordered = false,
      rowKey = record => record.id,
      size = "middle",
      totalRow = false,
      onChange,
      components,
      showTotal = total => `共${total}条`
    } = this.props;
    let { scroll = {} } = this.props;
    const { showEditColumnVisible, columns } = this.state;
    const newTableProps = { ...this.props };
    delete newTableProps.onRowDbClick;
    delete newTableProps.onRowClick;
    delete newTableProps.onCellDbClick;
    delete newTableProps.onCellClick;
    delete newTableProps.showLineNum;
    delete newTableProps.calcScrollX;
    delete newTableProps.calcScrollY;
    delete newTableProps.columns;
    delete newTableProps.dataSource;
    delete newTableProps.align;
    delete newTableProps.editable;
    delete newTableProps.totalRow;
    delete newTableProps.totalRowHeaderTxt;
    delete newTableProps.onPageChange;
    delete newTableProps.remoteSelectFn;
    delete newTableProps.selectCondition;
    delete newTableProps.components;
    delete newTableProps.autoFillRowNum;
    delete newTableProps.isEditColumnTable;
    delete newTableProps.lineNumFix;
    delete newTableProps.showTotal;
    const { newDataSource, totalDataSource, realRecordNum } = this.generateNewDataSource(dataSource);
    const newColumns = this.generateNewColumns(styles, columns, newDataSource, hasEditButton, realRecordNum);
    let paginationProps = false;
    let totalRowScroll;
    let tableClassName = this.props.className;
    let footerFn = null;
    let onChangeFn = onChange;
    // change回调函数
    if (utils.isNull(onChange)) {
      onChangeFn = this.handleTableOnChange;
    }
    if (!isEditColumnTable) {
      // 是否有分页
      if (!utils.isEmptyObject(pagination)) {
        paginationProps = {
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal,
          ...pagination
        };
      }
      // 计算滚动
      scroll = this.calcScrollFn(newColumns);
      // total样式
      if (totalRow) {
        totalRowScroll = clone(scroll);
        tableClassName = "ant-table-body";
        const { rowSelection } = this.props;
        const selection = {
          selectedRowKeys: []
        };
        footerFn = () => (
          <Table
            rowKey={record => record.id}
            columns={newColumns}
            dataSource={totalDataSource}
            pagination={false}
            showHeader={false}
            scroll={totalRowScroll}
            size={size}
            bordered={bordered}
            rowSelection={rowSelection ? selection : null}
          />
        )
        ;
      }
    }

    const BodyCell = ({ children, style, ...rest }) => (
      <td {...rest} style={style} >
        <div style={{ minHeight: 20 }} >{children}</div >
      </td >
    );

    let newComponents = components;
    if (utils.isNull(components)) {
      newComponents = {
        body: {
          cell: BodyCell
        }
      };
    }

    return (
      <Fragment >
        <Table
          {...newTableProps}
          onRow={(record, index) => {
            return {
              index,
              onDoubleClick: e => {
                e.stopPropagation();
                // 双击事件
                if (onRowDbClick) {
                  onRowDbClick(record);
                }
              },
              onClick: (e) => {
                e.stopPropagation();
                // 单击事件
                this.handleRowClick(record);
              }
            };
          }}
          rowClassName={(record, index) =>
            this.rowClassNameFn(record, index, styles)
          }
          components={newComponents}
          bordered={bordered}
          dataSource={newDataSource}
          size={size}
          columns={newColumns}
          scroll={scroll}
          rowKey={rowKey}
          pagination={paginationProps}
          className={tableClassName}
          footer={footerFn}
          onChange={onChangeFn}
        />
        {hasEditButton ? (
          <EditColumnModal
            onChange={this.handleColumnDataSourceChange}
            resetColumns={this.handleResetColumns}
            tableColumns={columns}
            handleModalVisible={this.handleShowEditColumnModal}
            visible={showEditColumnVisible}
          />
        ) : null}
      </Fragment >
    );
  }
}
