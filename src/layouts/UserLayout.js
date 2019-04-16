import React from 'react';
import Link from 'umi/link';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../../public/logo.jpg';
import project from '@/project';


// const links = [
//   {
//     key: 'help',
//     title: '帮助',
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: '隐私',
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: '条款',
//     href: '',
//   },
// ];

const links = [];


class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container} >
        <div className={styles.content} >
          <div className={styles.top} >
            <div className={styles.header} >
              <Link to="/" >
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title} >{project.name}</span >
              </Link >
            </div >
            <div className={styles.desc} >
              后台管理系统
            </div >
          </div >
          {children}
        </div >
        <GlobalFooter links={links} copyright={project.copyright} />
      </div >
    );
  }
}

export default UserLayout;
