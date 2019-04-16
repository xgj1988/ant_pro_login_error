import React, { Component, Fragment } from 'react';
import { Card, Col, Divider, Row, Tabs } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import numeral from 'numeral';
import { Bar, ChartCard } from '@/components/Charts/index';
import styles from './Analysis.less';
import * as utils from '@/utils/utils';

const { TabPane } = Tabs;

@connect(({ loading }) => ({
  analysisLoading: loading.effects['analysis/fetch'],
  analysisTrendLoading: loading.effects['analysis/trend']
}))
export default class Analysis extends Component {
  constructor(props) {
    super(props);
    this.analysisParam = {
      trendStartDate: moment('00:00:00', 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      trendEndDate: moment('23:59:59', 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      trendBarType: 'ARTICLE',
      trendBarDateType: 'TODAY'
    };
    this.topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 }
    };
    this.state = {
      articleAuditingCount: 0,
      articleReportErrorCount: 0,
      analysisTrendData: [],
      articleCount: 0
    };
  }


  componentDidMount() {
    this.props.dispatch({
      type: 'systemLogin/isLogin',
      callback: (success) => {
        if (success) {
          this.fetchDataInit();
          this.fetchTrend(this.analysisParam);
        } else {
          this.props.history.push('/system/login/index');
        }
      }
    });
  }

  handleTreadTabChange = (activeKey) => {
    this.analysisParam.trendBarType = activeKey;
    this.fetchTrend(this.analysisParam);
  };

  selectDate = (type) => {
    const rangePickerValue = utils.getTimeDistance(type);
    this.analysisParam.trendStartDate = rangePickerValue[0].format('YYYY-MM-DD HH:mm:ss');
    this.analysisParam.trendEndDate = rangePickerValue[1].format('YYYY-MM-DD HH:mm:ss');
    this.analysisParam.trendBarDateType = type.toUpperCase();
    this.fetchTrend(this.analysisParam);
  };


  isActive = (type) => {
    const value = utils.getTimeDistance(type);
    if (!this.analysisParam.trendStartDate || !this.analysisParam.trendEndDate) {
      return;
    }
    if (
      moment(this.analysisParam.trendStartDate).isSame(value[0], 'day')
      && moment(this.analysisParam.trendEndDate).isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  };

  fetchDataInit = () => {
    this.props.dispatch({
      type: 'analysis/fetch',
      callback: (data) => {
        this.setState({
          articleCount: data.articleCount
        });
      }
    });
  };

  fetchTrend = (param) => {
    this.props.dispatch({
      type: 'analysis/trend',
      payload: param,
      callback: (data) => {
        this.setState({ analysisTrendData: data.analysisTrendData });
      }
    });
  };


  render() {

    const { analysisLoading, analysisTrendLoading } = this.props;
    const {
      articleAuditingCount, articleReportErrorCount, analysisTrendData = [],
      articleCount
    } = this.state;
    const salesData = [];
    analysisTrendData.forEach((item) => {
      salesData.push({
        x: item.time,
        y: item.value
      });
    });

    const salesExtra = (
      <div className={styles.salesExtraWrap} >
        <div className={styles.salesExtra} >
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')} >
            今日
          </a >
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')} >
            本周
          </a >
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')} >
            本月
          </a >
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')} >
            全年
          </a >
        </div >
      </div >
    );
    return (
      <Fragment >
        <Divider style={{ color: 'red' }} >内容数量</Divider >
        <Row gutter={24} >
          <Col {...this.topColResponsiveProps}>
            <ChartCard
              loading={analysisLoading}
              bordered={false}
              title="待审文章"
              total={numeral(articleAuditingCount).format('0,0')}
              contentHeight={46}
              footer={
                <Link to={{
                  pathname: '/system/article/article',
                  query: { state: 'AUDITING' }
                }}
                >
                  查看
                </Link >
              }
            />
          </Col >
          <Col {...this.topColResponsiveProps}>
            <ChartCard
              loading={analysisLoading}
              bordered={false}
              title="报错文章"
              total={numeral(articleReportErrorCount).format('0,0')}
              contentHeight={46}
              footer={
                <Link to={{
                  pathname: '/system/article/article_report_error',
                  query: { state: 'UNRESOLVED' }
                }}
                >
                  查看
                </Link >
              }
            />
          </Col >
        </Row >
        <Divider style={{ color: 'red' }} >趋势图</Divider >
        <Card loading={analysisTrendLoading} bordered={false} bodyStyle={{ padding: 0 }} >
          <div className={styles.salesCard} >
            <Tabs
              activeKey={this.analysisParam.trendBarType}
              tabBarExtraContent={salesExtra}
              onChange={this.handleTreadTabChange}
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab={`文章数【${articleCount}】`} key="ARTICLE" >
                <div className={styles.salesBar} >
                  <Bar
                    height={400}
                    title="文章趋势"
                    data={this.analysisParam.trendBarType === 'ARTICLE' ? salesData : []}
                  />
                </div >
              </TabPane >
            </Tabs >
          </div >
        </Card >
      </Fragment >
    );
  }
}
