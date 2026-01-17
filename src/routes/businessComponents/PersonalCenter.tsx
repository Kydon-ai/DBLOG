import React, { useState, useEffect } from 'react';
import { Tabs, Card, List, Avatar, Button, Typography, Space, Spin, message } from 'antd';
import { HeartOutlined, CommentOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/https/request';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 定义接口
interface BlogItem {
  id: number;
  title: string;
  summary: string;
  author: string;
  created_at: string;
}

const PersonalCenter: React.FC = () => {
  const { isLogin, userInfo, logout } = useAppStore();
  const navigate = useNavigate();

  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('1');
  const [likedBlogs, setLikedBlogs] = useState<BlogItem[]>([]);
  const [commentedBlogs, setCommentedBlogs] = useState<BlogItem[]>([]);
  const [collectedBlogs, setCollectedBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(userInfo);

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!isLogin || !userInfo) {
      navigate('/login');
    } else {
      // 获取用户详细信息
      fetchUserInfo();
    }
  }, [isLogin, userInfo, navigate]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 获取用户详细信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/auth/me');
      setUserDetails(response);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取用户点赞的博客
  const fetchLikedBlogs = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/user/liked-blogs');
      setLikedBlogs(response);
    } catch (error) {
      console.error('获取点赞博客失败:', error);
      message.error('获取点赞博客失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取用户评论的博客
  const fetchCommentedBlogs = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/user/commented-blogs');
      setCommentedBlogs(response);
    } catch (error) {
      console.error('获取评论博客失败:', error);
      message.error('获取评论博客失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取用户收藏的博客
  const fetchCollectedBlogs = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/user/collected-blogs');
      setCollectedBlogs(response);
    } catch (error) {
      console.error('获取收藏博客失败:', error);
      message.error('获取收藏博客失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // 根据标签页获取对应的数据
    switch (key) {
      case '1':
        fetchLikedBlogs();
        break;
      case '2':
        fetchCommentedBlogs();
        break;
      case '3':
        fetchCollectedBlogs();
        break;
      default:
        break;
    }
  };

  // 渲染博客列表项
  const renderBlogItem = (blog: BlogItem) => (
    <List.Item
      actions={[
        <Button type="link" key="view" onClick={() => navigate(`/articles/${blog.id}`)}>
          查看
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={<a href={`/articles/${blog.id}`}>{blog.title}</a>}
        description={
          <Space direction="vertical" size="small">
            <Text ellipsis>
              {blog.summary}
            </Text>
            <Text type="secondary">
              作者: {blog.author} | 发布时间: {formatDate(blog.created_at)}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );

  // 渲染当前标签页的内容
  const renderTabContent = () => {
    switch (activeTab) {
      case '1':
        return (
          <Spin spinning={loading}>
            <List
              dataSource={likedBlogs}
              renderItem={renderBlogItem}
              locale={{ emptyText: '暂无点赞的博客' }}
            />
          </Spin>
        );
      case '2':
        return (
          <Spin spinning={loading}>
            <List
              dataSource={commentedBlogs}
              renderItem={renderBlogItem}
              locale={{ emptyText: '暂无评论的博客' }}
            />
          </Spin>
        );
      case '3':
        return (
          <Spin spinning={loading}>
            <List
              dataSource={collectedBlogs}
              renderItem={renderBlogItem}
              locale={{ emptyText: '暂无收藏的博客' }}
            />
          </Spin>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        个人中心
      </Title>

      <Space direction="vertical" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 用户信息卡片 */}
        <Spin spinning={loading}>
          <Card
            title="用户信息"
            style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Avatar
                size={80}
                src={userDetails?.avatar_url}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {userDetails?.full_name || userDetails?.username || '用户'}
                </Title>
                <Space direction="vertical" size="small">
                  <Text type="secondary">用户名: {userDetails?.username}</Text>
                  <Text type="secondary">邮箱: {userDetails?.email}</Text>
                  <Text type="secondary">角色: {userDetails?.role === 'admin' ? '管理员' : '普通用户'}</Text>
                  <Text type="secondary">注册时间: {userDetails?.created_at ? formatDate(userDetails.created_at) : '未知'}</Text>
                  {userDetails?.bio && <Text type="secondary">个人简介: {userDetails.bio}</Text>}
                </Space>
              </div>
            </div>
          </Card>
        </Spin>

        {/* 内容标签页 */}
        <Card style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            tabPosition="top"
            onTabClick={(key) => setActiveTab(key)}
          >
            <TabPane
              tab={<span><HeartOutlined /> 点赞的博客</span>}
              key="1"
            >
              {renderTabContent()}
            </TabPane>
            <TabPane
              tab={<span><CommentOutlined /> 评论的博客</span>}
              key="2"
            >
              {renderTabContent()}
            </TabPane>
            <TabPane
              tab={<span><StarOutlined /> 收藏的博客</span>}
              key="3"
            >
              {renderTabContent()}
            </TabPane>
          </Tabs>
        </Card>
      </Space>
    </div>
  );
};

export default PersonalCenter;
