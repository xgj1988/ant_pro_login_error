import React, { Fragment, PureComponent } from "react";
import { Button, Card, Checkbox, Empty, Icon, Input, message, Modal, Tooltip } from "antd";
import { DragDropContext } from "react-dnd";
import lodash from "lodash";
import HTML5Backend from "react-dnd-html5-backend";
import * as utils from "@/utils/utils";
import SpecEntryDragBtn from "./SpecEntryDragBtn";
import styles from "./Product.less";

class SkuInfo extends PureComponent {
  constructor(props) {
    super(props);
    let specItems = [];
    if (lodash.isArray(props.value)) {
      specItems = utils.deepCopySpecItems([props.value]);
    }
    this.state = {
      enabled: specItems.length > 0,
      orderModalVisible: false,
      specItems,
      sortSpecItems: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (!utils.deepCompare(nextProps.value, prevState.specItems)) {
        let specItems = [];
        if (lodash.isArray(nextProps.value)) {
          specItems = [...nextProps.value];
        }
        return {
          enabled: specItems.length > 0,
          specItems
        };
      }
    }
    return null;
  }

  /**
   * 触发change
   */
  triggerChange = (newSpecItems) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(utils.deepCopySpecItems(newSpecItems));
    }
  };


  /**
   * 添加规格值
   * @param specName
   */
  handleAddSpecValueClick = (specName) => {
    if (utils.isEmptyStr(specName)) {
      message.error(`请先输入规格名字`);
      return;
    }
    const newSpecItems = [...this.state.specItems];
    const findItem = newSpecItems.find((item) => {
      return item.name === specName;
    });
    if (utils.isNull(findItem)) {
      message.error(`名字为${specName}的规格不存在，请联系管理员！`);
      return;
    }
    const { entries } = findItem;
    entries.push({ index: entries.length + 1, value: "" });
    this.setState({ specItems: newSpecItems });
    this.triggerChange(newSpecItems);
  };

  /**
   * 改变规格值
   * @param specName
   * @param index
   * @param value
   * @param target
   */
  handleSpecValueChange = (specName, index, value, target) => {
    const newSpecItems = [...this.state.specItems];
    const findItem = newSpecItems.find((item) => {
      return item.name === specName;
    });
    if (utils.isNull(findItem)) {
      message.error(`名字为${specName}的规格不存在，请联系管理员！`);
      return;
    }
    const { entries } = findItem;
    const findEntry = entries.find((item) => {
      return item.index === index;
    });
    if (utils.isNull(findEntry)) {
      message.error(`名字为${specName}且索引为${index}的规格不存在，请联系管理员！`);
      return;
    }
    const findNameEntry = entries.find((item) => {
      return item.value === value && item.index !== index;
    });
    if (findNameEntry) {
      message.error(`已经存在相同的规格值！`);
      findEntry.value = "";
      // eslint-disable-next-line
      target.value = "";
      return;
    }
    findEntry.value = value;
    this.setState({ specItems: newSpecItems });
    this.triggerChange(newSpecItems);
  };


  /**
   * 删除规格值
   * @param specName
   * @param index
   */
  handleDelSpecValueClick = (specName, index) => {
    const newSpecItems = [...this.state.specItems];
    const findItem = newSpecItems.find((item) => {
      return item.name === specName;
    });
    if (utils.isNull(findItem)) {
      message.error(`名字为${specName}的规格不存在，请联系管理员！`);
      return;
    }

    const newEntries = findItem.entries.filter((item) => {
      return item.index !== index;
    }).map((newItem, newIndex) => {
      // eslint-disable-next-line
      newItem.index = newIndex + 1;
      return newItem;
    });
    findItem.entries = newEntries;
    this.setState({ specItems: newSpecItems });
    this.triggerChange(newSpecItems);
  };

  /**
   * 规格名改变
   * @param e
   * @param oldIndex
   */
  handleSpecNameChange = (e, oldIndex) => {
    const { value } = e.target;
    const { specItems } = this.state;
    if (utils.isEmptyStr(value)) {
      message.error("规格名字不能为空！");
      return;
    }
    const findItem = specItems.find((item, index) => {
      return item.name === value && index !== oldIndex;
    });
    if (!utils.isNull(findItem)) {
      message.error(`名字为${value}的规格已经存在！`);
      e.target.value = "";
      return;
    }
    const newSpecItems = [...specItems];
    const findOldItem = specItems.find((item, index) => {
      return index === oldIndex;
    });
    if (findOldItem) {
      findOldItem.name = value;
    } else {
      newSpecItems.push({ name: value, entries: [{ index: 1, value: "" }] });
    }
    this.setState({ specItems: newSpecItems });
    this.triggerChange(newSpecItems);
  };

  /**
   * 添加条目
   */
  handleAddSpecNameClick = () => {
    const { specItems } = this.state;
    const newSpecItems = [...specItems];
    newSpecItems.push(this.generateEmptySpecItem());
    this.setState({ specItems: newSpecItems });
    this.triggerChange(newSpecItems);
  };


  /**
   * 删除规格名
   * @param itemIndex
   */
  handleDelSpecNameClick = (itemIndex) => {
    const { specItems } = this.state;
    const newSpecItems = specItems.filter((item, index) => {
      return index !== itemIndex;
    });
    if (newSpecItems.length > 0) {
      this.setState({ specItems: newSpecItems });
    } else {
      this.setState({ specItems: newSpecItems, enabled: false });
    }
    this.triggerChange(newSpecItems);
  };


  /**
   *  控制规格是否显示
   * @returns {*}
   */
  handleEnabledSpecVisible = () => {
    const { enabled, specItems = [] } = this.state;
    if (enabled) {
      let newSpecItems = [];
      let specItemChildren;
      if (specItems.length > 0) {
        newSpecItems = [...specItems];
        specItemChildren = newSpecItems.map((item, index) => {
          return (
            // eslint-disable-next-line
            <Fragment key={`frgment_${item.name}_${index}`} >
              {this.generateSpecItem(item, index)}
            </Fragment >
          );
        });
      } else {
        specItemChildren = this.generateSpecItem({ name: "" });
      }
      return (
        <Fragment >
          {specItemChildren}
          <div className={styles.titleItemBgStyle} >
            {
              (specItems.length >= 3)
                ?
                (
                  <Tooltip title="最多支持3组规格" >
                    <Button onClick={this.handleAddSpecNameClick} disabled >添加规格条目</Button >
                  </Tooltip >
                )
                :
                (<Button onClick={this.handleAddSpecNameClick} >添加规格条目</Button >)
            }
            <span
              style={{ marginLeft: 12, color: "#3388ff", cursor: "pointer" }}
              onClick={() => {
                this.setState({ orderModalVisible: true, sortSpecItems: [] });
              }}
            >
              自定义排序
            </span >
          </div >
        </Fragment >
      );
    } else {
      return (
        <div className={styles.titleSpecBgStyle} >
          <Button
            onClick={() => {
              const newSpecItems = [...this.state.specItems];
              if (newSpecItems.length === 0) {
                newSpecItems.push(this.generateEmptySpecItem());
              }
              this.setState({ enabled: true, specItems: newSpecItems });
              this.triggerChange(newSpecItems);
            }}
          >
            添加规格项目
          </Button >
        </div >
      );
    }
  };

  /**
   * 改变排序
   * @param sortSpecItems
   */
  handleChangeSortSpecEntry = (sortSpecItems) => {
    this.setState({ sortSpecItems });
  };

  /**
   * 生成规格条目
   * @param item
   * @param itemIndex
   * @returns {*}
   */
  generateSpecItem = (item, itemIndex) => {
    const { entries = null } = item;
    return (
      <Fragment >
        <div key={`div_${item.name}_${itemIndex}`} className={styles.titleSpecBgStyle} >
          <span >规格名：</span >
          <Input
            maxLength={10}
            placeholder="请输入规格名"
            onPressEnter={(e) => this.handleSpecNameChange(e, itemIndex)}
            onBlur={(e) => this.handleSpecNameChange(e, itemIndex)}
            defaultValue={item.name}
            style={{ width: 150 }}
          />
          <Checkbox style={{ marginLeft: 10 }} >添加规格图片</Checkbox >
          <span
            className={styles.closeBtnStyle}
            onClick={() => {
              this.handleDelSpecNameClick(itemIndex);
            }}
          >
            ×
          </span >
        </div >
        {!utils.isEmptyArray(entries) ? (
            <div className={styles.contentBgStyle} >
              <span >规格值：</span >
              {
                entries.map((entry, entryIndex) => {
                  let style = { marginLeft: 10, width: 150 };
                  if (entryIndex === 0) {
                    style = { width: 150 };
                  }
                  return (
                    <Input
                      key={`${item.name}-${entries.length}-${entry.index}`}
                      maxLength={20}
                      placeholder="请输入规格值"
                      style={style}
                      defaultValue={entry.value}
                      onBlur={(e) => {
                        this.handleSpecValueChange(item.name, entry.index, e.target.value, e.target);
                      }}
                      suffix={
                        <Icon
                          type="close-circle"
                          onClick={() => this.handleDelSpecValueClick(item.name, entry.index)}
                          style={{ cursor: "pointer" }}
                          theme="filled"
                        />}
                    />
                  );
                })
              }
              <span
                style={{ marginLeft: 12, color: "#3388ff", cursor: "pointer" }}
                onClick={() => this.handleAddSpecValueClick(item.name)}
              >
                添加规格值
              </span >
            </div >
          ) :
          (
            <div className={styles.contentBgStyle} >
              <span >规格值：</span >
              <span
                style={{ marginLeft: 12, color: "#3388ff", cursor: "pointer" }}
                onClick={() => this.handleAddSpecValueClick(item.name)}
              >
                添加规格值
              </span >
            </div >
          )
        }
      </Fragment >
    );
  };

  /**
   * 生成要排序的规格
   * @returns {*}
   */
  generateSortableSpec = () => {
    const { specItems = [], orderModalVisible } = this.state;
    if (!orderModalVisible) {
      return;
    }
    let { sortSpecItems = [] } = this.state;
    if (utils.isEmptyArray(sortSpecItems)) {
      sortSpecItems = utils.deepCopySpecItems(specItems);
    }
    if (sortSpecItems.length === 0) {
      return (<Empty />);
    }
    const result = sortSpecItems.map((item, itemIndex) => {
      const { entries } = item;
      const newEntries = entries.filter((entryItem) => {
          return !utils.isEmptyStr(entryItem.value);
        }
      );
      return (
        <div key={`div_${item.name}_${itemIndex}`} >
          <div style={{ marginTop: 10 }} >{item.name}</div >
          <div >
            {
              newEntries.map((entry, entryIndex) => {
                const style = {};
                if (entryIndex > 0) {
                  style.marginLeft = 10;
                }
                return (
                  <SpecEntryDragBtn
                    handleChangeSortSpecEntry={this.handleChangeSortSpecEntry}
                    sortSpecItems={sortSpecItems}
                    specIndex={itemIndex}
                    entry={entry}
                    key={`btn_${entry.value}_${entry.index}`}
                    style={style}
                    specValue={entry.value}
                  />
                );
              })
            }
          </div >
        </div >
      );
    });
    return result;
  };

  /**
   * 生成一个空的规格项
   * @returns {{name: string, entries: Array}}
   */
  generateEmptySpecItem = () => {
    return { name: "", entries: [{ index: 1, value: "" }] };
  };


  render() {
    return (
      <Fragment >
        <Card className={styles.skuInfo} style={{ width: "100%" }} >
          {this.handleEnabledSpecVisible()}
        </Card >
        <Modal
          title="拖动规格值进行排序"
          visible={this.state.orderModalVisible}
          onOk={() => {
            const newSpecItems = utils.deepCopySpecItems(this.state.sortSpecItems);
            this.setState({ orderModalVisible: false, specItems: newSpecItems, sortSpecItems: [] });
            this.triggerChange(newSpecItems);
          }}
          onCancel={() => {
            this.setState({ orderModalVisible: false, sortSpecItems: [] });
          }}
        >
          {this.generateSortableSpec()}
        </Modal >
      </Fragment >
    );
  }
}

const SkuInfoWrapper = DragDropContext(HTML5Backend)(SkuInfo);
export default SkuInfoWrapper;
