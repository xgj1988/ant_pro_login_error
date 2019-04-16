import React, { PureComponent } from 'react';
import { Divider, Drawer, Icon, List, Select, Switch, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import ThemeColor from './ThemeColor';
import BlockChecbox from './BlockChecbox';
import * as utils from '@/utils/utils';

const { Option } = Select;

const Body = ({ children, title, style }) => (
  <div
    style={{
      ...style,
      marginBottom: 24
    }}
  >
    <h3 className={styles.title} >{title}</h3 >
    {children}
  </div >
);

@connect(({ setting }) => ({ setting }))
class SettingDrawer extends PureComponent {
  state = {
    collapse: false
  };

  getLayoutSetting = () => {
    const {
      setting: {
        contentWidth,
        fixedHeader,
        layout,
        autoHideHeader,
        fixSiderbar
      }
    } = this.props;
    return [
      {
        title: '内容区域宽度',
        action: (
          <Select
            value={contentWidth}
            size="small"
            onSelect={value => this.changeSetting('contentWidth', value)}
            style={{ width: 80 }}
          >
            {layout === 'sidemenu' ? null : <Option value="Fixed" >定宽</Option >}
            <Option value="Fluid" >流式</Option >
          </Select >
        )
      },
      {
        title: '固定 Header',
        action: (
          <Switch
            size="small"
            checked={!!fixedHeader}
            onChange={checked => this.changeSetting('fixedHeader', checked)}
          />
        )
      },
      {
        title: '下滑时隐藏 Header',
        disabled: !fixedHeader,
        disabledReason: '固定 Header 时可配置',
        action: (
          <Switch
            size="small"
            checked={!!autoHideHeader}
            onChange={checked => this.changeSetting('autoHideHeader', checked)}
          />
        )
      },
      {
        title: '固定侧边菜单',
        disabled: layout === 'topmenu',
        disabledReason: '侧边菜单布局时可配置',
        action: (
          <Switch
            size="small"
            checked={!!fixSiderbar}
            onChange={checked => this.changeSetting('fixSiderbar', checked)}
          />
        )
      }
    ];
  };

  changeSetting = (key, value) => {
    const { setting, dispatch } = this.props;
    const nextState = { ...setting };
    nextState[key] = value;
    if (key === 'layout') {
      nextState.contentWidth = value === 'topmenu' ? 'Fixed' : 'Fluid';
    } else if (key === 'fixedHeader' && !value) {
      nextState.autoHideHeader = false;
    }
    this.setState(nextState, () => {
      // xgj start
      if (utils.isAdminUrl()) {
        dispatch({
          type: 'admin/settingUpdate',
          payload: { type: 'THEME', value: JSON.stringify(nextState) }
        });
      }
      // xgj end

      dispatch({
        type: 'setting/changeSetting',
        payload: this.state
      });
    });
  };

  togglerContent = () => {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  };

  renderLayoutSettingItem = (item) => {
    const action = React.cloneElement(item.action, {
      disabled: item.disabled
    });
    return (
      <Tooltip
        title={item.disabled ? item.disabledReason : ''}
        placement="left"
      >
        <List.Item actions={[action]} >
          <span style={{ opacity: item.disabled ? '0.5' : '' }} >
            {item.title}
          </span >
        </List.Item >
      </Tooltip >
    );
  };

  render() {
    const { setting } = this.props;
    const { navTheme, primaryColor, layout, colorWeak } = setting;
    const { collapse } = this.state;
    return (
      <Drawer
        visible={collapse}
        width={300}
        onClose={this.togglerContent}
        placement="right"
        handler={
          <div className={styles.handle} >
            <Icon
              type={collapse ? 'close' : 'setting'}
              style={{
                color: '#fff',
                fontSize: 20
              }}
            />
          </div >
        }
        onHandleClick={this.togglerContent}
        style={{
          zIndex: 999
        }}
      >
        <div className={styles.content} >
          <Body title="整体风格设置" >
          <BlockChecbox
            list={[
              {
                key: 'dark',
                url:
                  'https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg',
                title: '暗色菜单风格'
              },
              {
                key: 'light',
                url:
                  'https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg',
                title: '亮色菜单风格'
              }
            ]}
            value={navTheme}
            onChange={value => this.changeSetting('navTheme', value)}
          />
          </Body >

          <ThemeColor
            title="主题色"
            value={primaryColor}
            onChange={color => this.changeSetting('primaryColor', color)}
          />

          <Divider />

          <Body title="导航模式" >
          <BlockChecbox
            list={[
              {
                key: 'sidemenu',
                url:
                  'https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg',
                title: '侧边菜单布局'
              },
              {
                key: 'topmenu',
                url:
                  'https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg',
                title: '顶部菜单布局'
              }
            ]}
            value={layout}
            onChange={value => this.changeSetting('layout', value)}
          />
          </Body >

          <List
            split={false}
            dataSource={this.getLayoutSetting()}
            renderItem={this.renderLayoutSettingItem}
          />

          <Divider />

          <Body title="其他设置" >
          <List.Item
            actions={[
              <Switch
                size="small"
                checked={!!colorWeak}
                onChange={checked => this.changeSetting('colorWeak', checked)}
              />
            ]}
          >
            色弱模式
          </List.Item >
          </Body >
        </div >
      </Drawer >
    );
  }
}

export default SettingDrawer;
