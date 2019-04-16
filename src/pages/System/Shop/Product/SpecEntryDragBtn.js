import { DragSource, DropTarget } from "react-dnd";
import React from "react";
import styles from "./Product.less";
import * as utils from "@/utils/utils";

const boxSource = {
  /**
   * 开始拖拽时触发当前函数
   * @param {*} props 组件的 props
   */
  beginDrag(props) {
    // 返回的对象可以在 monitor.getItem() 中获取到
    return { ...props.entry, specIndex: props.specIndex };
  }

  /**
   * 拖拽结束时触发当前函数
   * @param {*} props 当前组件的 props
   * @param {*} monitor DragSourceMonitor 对象
   */
  // endDrag(props, monitor) {
  // 当前拖拽的 item 组件
  // const item = monitor.getItem();
  // 拖拽元素放下时，drop 结果
  // const dropResult = monitor.getDropResult();
  // 如果 drop 结果存在，就弹出 alert 提示
  // if (dropResult) {
  //   alert(`You dropped ${item.name} into ${dropResult.name}!`);
  // }
  // }
};


const boxTarget = {
  // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
  drop: (props, monitor) => {
    const sourceEntry = monitor.getItem();
    const targetEntry = props.entry;
    const sourceSpecIndex = monitor.getItem().specIndex;
    const targetSpecIndex = props.specIndex;
    const newSortSpecItems = [...props.sortSpecItems];
    const { handleChangeSortSpecEntry } = props;
    if (sourceEntry.index === targetEntry.index) {
      return;
    }
    if (sourceSpecIndex !== targetSpecIndex) {
      return;
    }
    const { entries } = newSortSpecItems[targetSpecIndex];
    const sourceArrayIndex = entries.findIndex((item) => item.index === sourceEntry.index);
    const targetArrayIndex = entries.findIndex((item) => item.index === targetEntry.index);
    utils.swap(entries, sourceArrayIndex, targetArrayIndex);
    handleChangeSortSpecEntry(newSortSpecItems);
    return targetEntry;
  }
};

@DropTarget(
  // type 标识，这里是字符串 'box'
  "specEntryDrag",
  // 接收拖拽的事件对象
  boxTarget,
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => {
    let monitorSpecIndex = -1;
    if (monitor.isOver()) {
      monitorSpecIndex = monitor.getItem().specIndex;
    }
    return {
      // 包裹住 DOM 节点，使其可以接收对应的拖拽组件
      connectDropTarget: connect.dropTarget(),
      // drag source是否在 drop target 区域
      isOver: monitor.isOver(),
      // 是否可以被放置
      canDrop: monitor.canDrop(),
      monitorSpecIndex
    };
  }
)
@DragSource(
  // type 标识，这里是字符串 'box'
  "specEntryDrag",
  // 拖拽事件对象
  boxSource,
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => ({
    // 包裹住 DOM 节点，使其可以进行拖拽操作
    connectDragSource: connect.dragSource(),
    // 是否处于拖拽状态
    isDragging: monitor.isDragging()
  })
)

export default class SpecEntryDragBtn extends React.Component {
  render() {
    // 使用 connectDragSource 包裹住 DOM 节点，使其可以接受各种拖动 API
    // connectDragSource 包裹住的 DOM 节点才可以被拖动
    // 使用 connectDropTarget 包裹住 DOM 节点，使其可以接收对应的 drag source 组件
    // connectDropTarget 包裹住的 DOM 节点才能接收 drag source 组件
    const { connectDragSource, isOver, connectDropTarget, specIndex, monitorSpecIndex, specValue, style = {} } = this.props;
    const newProps = { ...this.props };
    const newStyle = { ...style };
    delete newProps.style;
    // 当前组件可以放置 drag source 时，背景色变为 pink
    if (isOver && (specIndex === monitorSpecIndex)) {
      newStyle.backgroundColor = "#FF9966";
    }
    return connectDragSource(connectDropTarget(
      <div style={newStyle} className={styles.specDrag} >
        {specValue}
      </div >
    ));
  }
}
