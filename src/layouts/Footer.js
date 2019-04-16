import React from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import project from '@/project';

const { Footer } = Layout;
// const links = [
//   {
//     key: 'Pro 首页',
//     title: 'Pro 首页',
//     href: 'https://pro.ant.design',
//     blankTarget: true,
//   },
//   {
//     key: 'github',
//     title: <Icon type="github"/>,
//     href: 'https://github.com/ant-design/ant-design-pro',
//     blankTarget: true,
//   },
//   {
//     key: 'Ant Design',
//     title: 'Ant Design',
//     href: 'https://ant.design',
//     blankTarget: true,
//   },
// ];
const links = [];
const FooterView = () => (
  <Footer style={{ padding: 0 }} >
    <GlobalFooter
      links={links}
      copyright={project.copyright}
    />
  </Footer >
);
export default FooterView;
