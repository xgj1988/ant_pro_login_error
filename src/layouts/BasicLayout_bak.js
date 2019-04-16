import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import NProgress from 'nprogress';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import SiderMenu from '@/components/SiderMenu';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../../public/logo.jpg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import { getMenuData as serverMenuData, getPathMenuMapData } from '@/common/menu';
import project from '@/project';
import '@/layouts/NProgress.less';

const { Content } = Layout;

NProgress.configure({ showSpinner: false });

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.currHref = '';
    this.menuData = serverMenuData();
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent'
    });
    dispatch({
      type: 'setting/getSetting'
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false
      });
    });
    this.enquireHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }


  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap = () => {
    const routerMap = {};
    const mergeMenuAndRouter = (data) => {
      data.forEach((menuItem) => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.menuData);
    return routerMap;
  }

  matchParamsPath = (pathname) => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname) => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return project.name;
    }
    // const message = formatMessage({
    //   id: currRouterData.locale || currRouterData.name,
    //   defaultMessage: currRouterData.name
    // });
    return `${currRouterData.name} - ${project.name}`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px'
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0
    };
  };

  handleMenuCollapse = (collapsed) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  };

  renderSettingDrawer() {
    // Do show SettingDrawer in production
    // unless deployed in preview.pro.ant.design as demo
    // const {rendering} = this.state;
    // if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'dev') {
    //   return null;
    // }
    // xgj start
    const { rendering, isMobile } = this.state;
    if (rendering || isMobile) {
      return null;
    }
    // xgj end
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      loading,
      location: { pathname }
    } = this.props;
    const { isMobile } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const { href } = window.location; // 浏览器地址栏中地址
    if (this.currHref !== href) {
      // currHref 和 href 不一致时说明进行了页面跳转
      NProgress.start(); // 页面开始加载时调用 start 方法
      if (!loading.global) {
        // loading.global 为 false 时表示加载完毕
        NProgress.done(); // 页面请求完毕时调用 done 方法
        this.currHref = href; // 将新页面的 href 值赋值给 currHref
      }
    }
    const layout = (
      <Layout >
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={this.menuData}
            pathMenuMap={getPathMenuMapData()}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh'
          }}
        >
          <Header
            menuData={this.menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()} >
            {children}
          </Content >
          <Footer />
        </Layout >
      </Layout >
    );
    return (
      <React.Fragment >
        <DocumentTitle title={this.getPageTitle(pathname)} >
          <ContainerQuery query={query} >
            {params => (
              <Context.Provider value={this.getContext()} >
                <div className={classNames(params)} >{layout}</div >
              </Context.Provider >
            )}
          </ContainerQuery >
        </DocumentTitle >
        {this.renderSettingDrawer()}
      </React.Fragment >
    );
  }
}

export default connect(({ global, setting, loading }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  loading,
  ...setting
}))(BasicLayout);
