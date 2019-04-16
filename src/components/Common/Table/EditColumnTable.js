import React from "react";
import { Input, message, Switch, Tooltip } from "antd";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import cssStyles from "./BasicTable.less";
import BasicTable from "./BasicTable";
import * as utils from "@/utils/utils";

class EditColumnTable extends React.Component {
  constructor(props) {
    super(props);
    this.originDataSource = props.dataSource || [];
    this.state = {
      dataSource: [...this.originDataSource]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource) {
      this.setState({ dataSource: nextProps.dataSource });
    }
  }

  dragDirection = (
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset
  ) => {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
      return "downward";
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
      return "upward";
    }
  };

  handleMoveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];
    dataSource.splice(dragIndex, 1);
    dataSource.splice(hoverIndex, 0, dragRow);
    this.triggerChange(dataSource);
  };

  triggerChange = (dataSource) => {
    this.setState({
      dataSource
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(dataSource);
    }
  };

  render() {
    const { dataSource } = this.state;
    const self = this;
    const rowSource = {
      beginDrag(props) {
        return {
          index: props.index
        };
      }
    };
    const rowTarget = {
      drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
        if (
          !utils.isNull(dataSource[dragIndex].fixed)
          || !utils.isNull(dataSource[hoverIndex].fixed)
        ) {
          message.info("固定列不能切换位置");
          return;
        }
        // Time to actually perform the action
        self.handleMoveRow(dragIndex, hoverIndex);
        // eslint-disable-next-line no-param-reassign
        monitor.getItem().index = hoverIndex;
      }
    };

    let BodyRow = (props) => {
      const {
        isOver,
        connectDragSource,
        connectDropTarget,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
      } = props;
      const style = { ...restProps.style, cursor: "move" };

      let { className } = restProps;
      if (isOver && initialClientOffset) {
        const direction = this.dragDirection(
          dragRow.index,
          restProps.index,
          initialClientOffset,
          clientOffset,
          sourceClientOffset
        );
        if (direction === "downward") {
          className += ` ${cssStyles["drop-over-downward"]}`;
        }
        if (direction === "upward") {
          className += ` ${cssStyles["drop-over-upward"]}`;
        }
      }
      return connectDragSource(
        connectDropTarget(
          <tr {...restProps} className={className} style={style} />
        )
      );
    };


    BodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      sourceClientOffset: monitor.getSourceClientOffset()
    }))(
      DragSource("row", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
      }))(BodyRow)
    );

    const columns = [
      /* {
      title: '上级',
      dataIndex: 'parent',
      key: 'parent',
      align: 'center',
      width: 120,
    }, */ {
        title: "列名",
        dataIndex: "realTitle",
        key: "realTitle",
        editable: true,
        align: "center",
        width: 120
      },
      {
        title: "显示名",
        dataIndex: "showTitle",
        key: "showTitle",
        editable: true,
        align: "center",
        width: 120,
        render: (value, record) => {
          if (record.autoCreate) {
            return null;
          }
          return (
            <Input
              max={20}
              onChange={(e) => {
                // eslint-disable-next-line
                record.showTitle = e.target.value;
              }}
              defaultValue={value}
            />
          );
        }
      },
      {
        title: "显示",
        dataIndex: "visable",
        key: "visable",
        editable: true,
        align: "center",
        width: 60,
        render: (value, record) => {
          if (record.autoCreate) {
            return null;
          }
          return (
            <Switch
              onChange={(val) => {
                // eslint-disable-next-line
                record.visable = val;
              }}
              defaultChecked={value}
              checkedChildren="开"
              unCheckedChildren="关"
            />
          );
        }
      },
      /* {
      title: '回车键跳转',
      dataIndex: 'enter',
      key: 'enter',
      align: 'center',
      width: 80,
      render: (value, record) => {
        if (record.autoCreate) {
          return null;
        }
        return (
          <Switch
            onChange={(val) => {
              // eslint-disable-next-line no-param-reassign
              record.enter = val;
            }}
            defaultChecked={value}
            checkedChildren="开"
            unCheckedChildren="关"
          />);
      },
    }, */ {
        title: "顺序",
        dataIndex: "order",
        key: "order",
        align: "center",
        width: 100,
        render: (value, record) => {
          if (record.autoCreate) {
            return null;
          }
          if (!utils.isNull(record.fixed)) {
            return "不能移动";
          }
          return (
            <Tooltip title="按住拖动上下切换顺序" >
              <i
                className="iconfont icon-drag"
                style={{ cursor: "pointer", fontSize: "15px" }}
              />
            </Tooltip >
          );
        }
      }
    ];

    const components = {
      body: {
        row: BodyRow
      }
    };
    return (
      <BasicTable
        isEditColumnTable
        columns={columns}
        dataSource={dataSource}
        components={components}
        hasEditButton={false}
        autoFillRowNum={-1}
        scroll={{ y: 600 }}
      />
    );
  }
}

const EditColumnTableWrapper = DragDropContext(HTML5Backend)(EditColumnTable);
export default EditColumnTableWrapper;
