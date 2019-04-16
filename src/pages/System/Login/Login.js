import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import Geetest from 'react-geetest';
import Login from '@/components/Login';
import styles from './Login.less';
import LoginUser from '@/utils/LoginUser';
import project from '@/project';
import * as utils from '@/utils/utils';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ systemLogin, loading }) => ({
  systemLogin,
  submitting: loading.effects['systemLogin/login']
}))

export default class LoginPage extends PureComponent {

  constructor(props) {
    super(props);
    this.userId = utils.uuid();
    this.geetestSuccessInfo = null;
    this.geetestInstance = null;
    this.state = {
      type: 'account',
      geetestLoad: false,
      geetestData: null,
      submitDisabled: project.supportGeetest === true
    };
  }


  componentDidMount() {
    if (project.supportGeetest === true) {
      this.props.dispatch({
        type: 'systemLogin/geetestLogin',
        payload: {
          userId: this.userId
        },
        callback: data => {
          this.setState({ geetestLoad: true, geetestData: data });
        }
      });
    }
  }


  onTabChange = (type) => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      alert("验证成功");
    }
  };

  handlerGeetestSuccess = (result, geetestInstance) => {
    this.geetestSuccessInfo = result;
    this.setState({ submitDisabled: false });
    this.geetestInstance = geetestInstance;
  };

  handlerGeetestError = (result, geetestInstance) => {
    this.geetestInstance = geetestInstance;
    this.geetestInstance.reset();
  };


  render() {
    const { submitting } = this.props;
    const { type, geetestLoad, geetestData, submitDisabled } = this.state;
    return (
      <div className={styles.main} >
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录" >
            <UserName
              autoFocus
              name="username"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Password
              name="password"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            {(project.supportGeetest === true && geetestLoad) ?
              (
                <Geetest
                  gt={geetestData.gt}
                  challenge={geetestData.challenge}
                  success={geetestData.success ? 1 : 0}
                  new_captcha={geetestData.new_captcha}
                  onSuccess={this.handlerGeetestSuccess}
                  onError={this.handlerGeetestError}
                  product="popup"
                  width="100%"
                />
              )
              : null
            }
          </Tab >
          <Submit loading={submitting} disabled={submitDisabled} >
            登录
          </Submit >
        </Login >
      </div >
    );
  }
}
