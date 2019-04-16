import React, { PureComponent } from 'react';
import { Form, Input, Tree } from 'antd';
import BasicModal from '@/components/Common/Modal/BasicModal';
import BasicTable from '@/components/Common/Table/BasicTable';
import SplitContainer from '@/components/Common/SplitContainer/SplitContainer';
import * as utils from '@/utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;

@Form.create()
export default class RoleEmpowerModal extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedPermissionIds = new Set();
    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      selectedMenuIds: new Set(),
      expandedKeys: [],
      autoExpandParent: false,
      searchValue: ''
    };
  }


  componentWillReceiveProps(nextProps) {
    const { menus, currentPermissions, currentMenus } = nextProps;
    const { selectedMenuIds } = this.state;
    if (menus.length > 0) {
      const { permissions } = menus[0];
      const selectedRowKeys = this.initSelectedRows(permissions);
      this.selectedPermissionIds.clear();
      selectedMenuIds.clear();
      this.setState({ dataSource: permissions, selectedRowKeys, selectedMenuIds });
    }
    if (currentPermissions.length > 0) {
      this.selectedPermissionIds.clear();
      for (const currentPermission of currentPermissions) {
        this.selectedPermissionIds.add(currentPermission.id);
      }
    }
    if (currentMenus.length > 0) {
      selectedMenuIds.clear();
      for (const currentMenu of currentMenus) {
        selectedMenuIds.add(currentMenu.id);
        this.setState({ selectedMenuIds });
      }
    }
  }

  handleModalClose = () => {
    this.setState({ searchValue: '' });
  };


  handleRowSelectionOnChange = (selectedRowKeys) => {
    const { menus } = this.props;
    const { selectedMenuIds } = this.state;
    // 先删除
    const selectedRowKeysTmp = this.state.selectedRowKeys;
    if (selectedRowKeysTmp.length > 0) {
      for (const selectedRowKeyTmp of selectedRowKeysTmp) {
        this.selectedPermissionIds.delete(selectedRowKeyTmp);
      }
      const menu = this.findMenuByPermission(menus, selectedRowKeysTmp[0]);
      if (!utils.isNull(menu)) {
        selectedMenuIds.delete(menu.id);
      }
    }
    // 再添加
    for (const permissionId of selectedRowKeys) {
      this.selectedPermissionIds.add(permissionId);
    }
    // 添加菜单
    const menu = this.findMenuByPermission(menus, selectedRowKeys[0]);
    if (!utils.isNull(menu)) {
      selectedMenuIds.add(menu.id);
      if (menu.parentId) {
        const parentList = [];
        this.findAncestorMenu(menu, parentList);
        for (const parentMenu of parentList) {
          selectedMenuIds.add(parentMenu.id);
        }
      }
    }
    this.setState({ selectedRowKeys, selectedMenuIds });
  };

  handleTreeOnCheck = (checkedKeys, { node }) => {
    const { menus } = this.props;
    const menuId = node.props.value;
    const menu = utils.findTreeNodeById(menus, menuId);
    const { permissions } = menu;
    if (!utils.isNull(menu) && !utils.isNull(permissions)) {
      const selectedRowKeys = this.initSelectedRows(permissions);
      this.setState({ dataSource: permissions, selectedRowKeys });
    } else {
      this.setState({ dataSource: [], selectedRowKeys: [] });
    }
  };


  handleTreeOnSelect = (selectedKeys, { selected, node }) => {
    const { menus } = this.props;
    if (selected) {
      const menuId = node.props.value;
      const menu = utils.findTreeNodeById(menus, menuId);
      const { permissions } = menu;
      if (!utils.isNull(menu) && !utils.isNull(permissions)) {
        const selectedRowKeys = this.initSelectedRows(permissions);
        this.setState({ dataSource: permissions, selectedRowKeys });
      } else {
        this.setState({ dataSource: [], selectedRowKeys: [] });
      }
    }
  };


  handleModalOk = () => {
    const { handleEmpowerFormSubmit, currentItem, handleEmpowerModalVisible } = this.props;
    const { selectedMenuIds } = this.state;
    handleEmpowerFormSubmit({
      id: currentItem.id,
      menuIds: [...selectedMenuIds],
      permissionIds: [...this.selectedPermissionIds]
    }, (success) => {
      if (success) {
        handleEmpowerModalVisible(false);
      }
    });
  };

  handleSearchChange = (e) => {
    const { value } = e.target;
    const { menuList } = this.props;
    let expandedKeys = menuList.map((item) => {
      const result = utils.hightLightSpan(value, item.name, item.acronym);
      if (typeof result !== 'string') {
        return item.id;
      } else {
        return null;
      }
    });
    expandedKeys = expandedKeys.filter(item => item != null);
    this.setState({
      expandedKeys: [...expandedKeys],
      searchValue: value,
      autoExpandParent: true
    });
  };

  handleTreeExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  findAncestorMenu = (menu, parentList) => {
    const { menuList } = this.props;
    if (menu.parentId) {
      for (const menuTmp of menuList) {
        if (menuTmp.id === menu.parentId) {
          parentList.push(menuTmp);
          this.findAncestorMenu(menuTmp, parentList);
        }
      }
    }
  };

  findMenuByPermission = (menus, permissionId) => {
    let result = null;
    for (const menu of menus) {
      const { permissions } = menu;
      for (const permission of permissions) {
        if (permission.id === permissionId) {
          result = menu;
          break;
        }
      }
      if (result != null) {
        return result;
      } else {
        const { children } = menu;
        if (!utils.isNull(children)) {
          result = this.findMenuByPermission(children, permissionId);
          if (result != null) {
            return result;
          }
        }
      }
    }
    return result;
  };

  initSelectedRows = (permissions) => {
    const selectedRowKeys = [];
    if (!utils.isNull(permissions)) {
      for (const permission of permissions) {
        if (this.selectedPermissionIds.has(permission.id)) {
          selectedRowKeys.push(permission.id);
        }
      }
    }
    return selectedRowKeys;
  };


  treeTitleFn = (item) => {
    const { searchValue } = this.state;
    return utils.hightLightSpan(searchValue, item.name, item.acronym);
  };


  render() {
    const { visible, handleEmpowerModalVisible, title, menus = [] } = this.props;
    const { selectedMenuIds, expandedKeys, autoExpandParent, selectedRowKeys, dataSource } = this.state;
    const defaultMenusKeys = [];
    for (const selectedMenuId of selectedMenuIds) {
      defaultMenusKeys.push(selectedMenuId);
    }
    const columns = [{
      title: '名字',
      width: 100,
      dataIndex: 'name',
      renderType: 'ellipsis'
    }, {
      title: '标识',
      dataIndex: 'value',
      width: 200,
      renderType: 'ellipsis'
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectionOnChange
    };
    const leftNode = (
      <div >
        <Search
          placeholder="输入菜单名字查询"
          onChange={this.handleSearchChange}
          style={{ marginTop: '5px' }}
        />
        <Tree
          onExpand={this.handleTreeExpand}
          autoExpandParent={autoExpandParent}
          expandedKeys={expandedKeys}
          onSelect={this.handleTreeOnSelect}
          onCheck={this.handleTreeOnCheck}
          checkedKeys={defaultMenusKeys}
          defaultExpandAll
          checkable
          checkStrictly
        >
          {utils.renderTreeNodes(menus, TreeNode, null, null, this.treeTitleFn)}
        </Tree >
      </div >
    );
    const rightNode = (
      <div >
        <BasicTable
          lineNumFix={false}
          autoFillRowNum={-1}
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div >
    );
    return (
      <BasicModal
        onShow={this.handleModalClose}
        title={title}
        visible={visible}
        onVisible={handleEmpowerModalVisible}
        onOk={this.handleModalOk}
        width={900}
      >
        <SplitContainer
          leftNode={leftNode}
          rightNode={rightNode}
          name="菜单"
          option={{ toolbar: true }}
        />
      </BasicModal >
    );
  }
}
