import React, { PureComponent } from 'react';
import { Avatar, Dropdown, Icon, Menu, Spin, Tag } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import styles from './index.less';
import logo from '../../../public/logo.jpg';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold'
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }} >
            {newNotice.extra}
          </Tag >
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }


  generateName = () => {
    const {
      currentUser
    } = this.props;
    return currentUser.name;
  };

  render() {
    const {
      currentUser,
      onMenuClick,
      theme
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} >
        <Menu.Item key="logout" >
          <Icon type="logout" />
          退出登录
        </Menu.Item >
      </Menu >
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className} >
        {currentUser.name ? (
          <Dropdown overlay={menu} >
            <span className={`${styles.action} ${styles.account}`} >
              <Avatar
                size="small"
                className={styles.avatar}
                src={logo}
                alt="avatar"
              />
              <span className={styles.name} >{this.generateName()}</span >
            </span >
          </Dropdown >
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div >
    );
  }
}
