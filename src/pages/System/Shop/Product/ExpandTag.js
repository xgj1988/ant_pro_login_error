import React, { Fragment, PureComponent } from "react";
import { Icon } from "antd";

export default class ExpandTag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.expand
    };
  }


  render() {
    const { expand = true } = this.state;
    let txt = "折叠更多信息";
    let iconType = "caret-down";
    if (!expand) {
      txt = "更多设置";
      iconType = "caret-up";
    }
    return (
      <Fragment >
        <div
          onClick={() => {
            this.setState({ expand: !expand });
          }}
          style={{ cursor: "pointer", height: 40 }}
        >
          <Icon type={iconType} />
          <span style={{ color: "#3388FF" }} >{txt}</span >
        </div >
        {expand ? this.props.children : null}
      </Fragment >
    );
  }
}
