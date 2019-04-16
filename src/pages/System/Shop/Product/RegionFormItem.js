import React, { PureComponent } from "react";

export default class RegionFormItem extends PureComponent {

  render() {
    const { title } = this.props;
    return (
      <div style={{
        height: 40,
        width: "100%",
        backgroundColor: "#f8f8f8",
        verticalAlign: "baseline",
        fontSize: 14,
        fontWeight: 700
      }}
      >
        <div
          style={{
            color: "#333333",
            paddingLeft: "10px"
          }}
        >
          {title}
        </div >
      </div >
    );
  }
}
