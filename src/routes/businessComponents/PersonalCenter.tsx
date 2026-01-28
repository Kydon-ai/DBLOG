import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Card, List, Avatar, Button, Typography, Space, Spin, message, Modal, Input, Form } from 'antd';
import { HeartOutlined, CommentOutlined, StarOutlined, UserOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
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
  const { isLogin, userInfo } = useAppStore();
  const navigate = useNavigate();

  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('1');
  const [likedBlogs, setLikedBlogs] = useState<BlogItem[]>([]);
  const [commentedBlogs, setCommentedBlogs] = useState<BlogItem[]>([]);
  const [collectedBlogs, setCollectedBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(userInfo);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 处理头像上传
  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await request.post('/api/users/avatar', formData, {
        'Content-Type': 'multipart/form-data',
      });

      if (response.status === 'success') {
        // 获取完整的头像URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const fullAvatarUrl = response.avatar_url.startsWith('http')
          ? response.avatar_url
          : baseUrl + response.avatar_url;

        // 更新用户信息（包含完整URL）
        const updatedUser = {
          ...response.user,
          avatar_url: fullAvatarUrl
        };

        // 更新本地状态
        setUserDetails(updatedUser);

        // 更新全局状态（同时更新userInfo和avatar字段）
        const appStore = useAppStore.getState();
        appStore.updateUserInfo(updatedUser);
        appStore.setAvatar(fullAvatarUrl);

        message.success('头像上传成功');
      } else {
        message.error(response.message || '头像上传失败');
      }
    } catch (error: any) {
      message.error('头像上传失败: ' + (error.response?.data?.detail || error.message));
      console.error('头像上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  // 打开编辑信息弹窗
  const handleEditInfo = () => {
    editForm.setFieldsValue({
      username: userDetails?.username,
      email: userDetails?.email,
      full_name: userDetails?.full_name,
      bio: userDetails?.bio,
    });
    setEditModalVisible(true);
  };

  // 保存用户信息
  const handleSaveUserInfo = async (values: any) => {
    try {
      setLoading(true);
      const response = await request.put('/api/users/profile', values);

      if (response.status === 'success') {
        // 获取完整的头像URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        let updatedUser = response.user;

        if (updatedUser.avatar_url) {
          const fullAvatarUrl = updatedUser.avatar_url.startsWith('http')
            ? updatedUser.avatar_url
            : baseUrl + updatedUser.avatar_url;
          updatedUser = {
            ...updatedUser,
            avatar_url: fullAvatarUrl
          };
        }

        // 更新本地状态
        setUserDetails(updatedUser);

        // 更新全局状态
        const appStore = useAppStore.getState();
        appStore.updateUserInfo(updatedUser);
        if (updatedUser.avatar_url) {
          appStore.setAvatar(updatedUser.avatar_url);
        }

        message.success('用户信息更新成功');
        setEditModalVisible(false);
      } else {
        message.error(response.message || '用户信息更新失败');
      }
    } catch (error: any) {
      message.error('用户信息更新失败: ' + (error.response?.data?.detail || error.message));
      console.error('用户信息更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户详细信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/auth/me');

      // 获取完整的头像URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (response.avatar_url) {
        const fullAvatarUrl = response.avatar_url.startsWith('http')
          ? response.avatar_url
          : baseUrl + response.avatar_url;
        response.avatar_url = fullAvatarUrl;
      }

      // 更新本地状态
      setUserDetails(response);

      // 更新全局状态（同时更新userInfo和avatar字段）
      const appStore = useAppStore.getState();
      appStore.updateUserInfo(response);
      if (response.avatar_url) {
        appStore.setAvatar(response.avatar_url);
      }

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
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditInfo}
              >
                编辑信息
              </Button>
            }
            style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  size={80}
                  src={userDetails?.avatar_url}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    border: '2px solid white',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  loading={uploading}
                >
                  <UploadOutlined style={{ fontSize: 16 }} />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAvatarUpload(file);
                    }
                    // 清空文件输入，以便下次可以选择同一个文件
                    e.target.value = '';
                  }}
                />
              </div>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {/* 用户名在这里 */}
                  {userDetails?.full_name || userDetails?.username || '用户'}
                </Title>
                <Space direction="vertical" size="small">
                  <Text type="secondary">邮箱: {userDetails?.email === "" ? '未绑定' : userDetails.email}</Text>
                  <Text type="secondary">角色: {userDetails?.role === 'admin' ? '管理员' : '普通用户'}</Text>
                  <Text type="secondary">注册时间: {userDetails?.created_at ? formatDate(userDetails.created_at) : '未知'}</Text>
                  {userDetails?.bio && <Text type="secondary">个人简介: {userDetails.bio}</Text>}
                </Space>
              </div>
            </div>
          </Card>
        </Spin>

        {/* 编辑用户信息弹窗 */}
        <Modal
          title="编辑用户信息"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleSaveUserInfo}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 50, message: '用户名长度必须在3到50个字符之间' },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>

            <Form.Item
              name="full_name"
              label="姓名"
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea placeholder="请输入个人简介" rows={4} />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

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
