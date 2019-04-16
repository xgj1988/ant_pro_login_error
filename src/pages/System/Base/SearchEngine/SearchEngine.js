import React, { PureComponent } from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TabMemberContent from './TabMemberContent';
import TabArticleContent from './TabArticleContent';
import TabPostTopicContent from './TabPostTopicContent';
import TabPostContent from './TabPostContent';
import TabProductContent from './TabProductContent';

const { TabPane } = Tabs;

@connect(({ loading }) => ({
  submitLoading: loading.effects['searchEngine/update'],
  rebuildLoading: loading.effects['searchEngine/rebuild']
}))
export default class SearchEngine extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentMemberMapping: {},
      currentArticleMapping: {},
      currentPostTopicMapping: {},
      currentPostMapping: {},
      currentProductMapping: {}
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  handleMappingSubmit = params => {
    this.props.dispatch({
      type: 'searchEngine/update',
      payload: {
        params
      },
      callback: () => {
        this.fetchData();
      }
    });
  };

  handleRebuildIndexSubmit = params => {
    this.props.dispatch({
      type: 'searchEngine/rebuild',
      payload: {
        params
      }
    });
  };

  fetchData() {
    this.props.dispatch({
      type: 'searchEngine/fetch',
      callback: data => {
        this.setState({
          currentMemberMapping: data.memberMapping,
          currentArticleMapping: data.articleMapping,
          currentPostTopicMapping: data.postTopicMapping,
          currentPostMapping: data.postMapping,
          currentProductMapping: data.productMapping
        });
      }
    });
  }

  render() {
    const { submitLoading, rebuildLoading } = this.props;
    const {
      currentMemberMapping,
      currentArticleMapping,
      currentPostTopicMapping,
      currentPostMapping,
      currentProductMapping
    } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs>
            <TabPane tab="会员索引" key="member">
              <TabMemberContent
                currentMemberMapping={currentMemberMapping}
                submitLoading={submitLoading}
                handleMappingSubmit={this.handleMappingSubmit}
                handleRebuildIndexSubmit={this.handleRebuildIndexSubmit}
                rebuildLoading={rebuildLoading}
              />
            </TabPane>
            <TabPane tab="文章索引" key="article">
              <TabArticleContent
                currentArticleMapping={currentArticleMapping}
                submitLoading={submitLoading}
                handleMappingSubmit={this.handleMappingSubmit}
                handleRebuildIndexSubmit={this.handleRebuildIndexSubmit}
                rebuildLoading={rebuildLoading}
              />
            </TabPane>
            <TabPane tab="话题索引" key="postTopic">
              <TabPostTopicContent
                currentPostTopicMapping={currentPostTopicMapping}
                submitLoading={submitLoading}
                handleMappingSubmit={this.handleMappingSubmit}
                handleRebuildIndexSubmit={this.handleRebuildIndexSubmit}
                rebuildLoading={rebuildLoading}
              />
            </TabPane>
            <TabPane tab="帖子索引" key="post">
              <TabPostContent
                currentPostMapping={currentPostMapping}
                submitLoading={submitLoading}
                handleMappingSubmit={this.handleMappingSubmit}
                handleRebuildIndexSubmit={this.handleRebuildIndexSubmit}
                rebuildLoading={rebuildLoading}
              />
            </TabPane>
            <TabPane tab="商品索引" key="product">
              <TabProductContent
                currentProductMapping={currentProductMapping}
                submitLoading={submitLoading}
                handleMappingSubmit={this.handleMappingSubmit}
                handleRebuildIndexSubmit={this.handleRebuildIndexSubmit}
                rebuildLoading={rebuildLoading}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
