import { useState, useEffect, FC } from 'react';
import { Card, Typography, Space, Divider, Avatar, Button } from 'antd';
import { EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
// import './article.css';
import request from '../../utils/https/request';
import ReactMarkdown from 'react-markdown';
// 支持GFM语法
import remarkGfm from 'remark-gfm';
// HTML渲染
import rehypeRaw from 'rehype-raw';
// emoji渲染
import remarkEmoji from 'remark-emoji';
// math渲染
import remarkMath from 'remark-math';
// katex渲染
import rehypeKatex from 'rehype-katex';
// 代码渲染对应高亮样式
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const { Title, Text } = Typography;

const AnnouncementDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [announcement, setAnnouncement] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchAnnouncement();
        }
    }, [id]);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await request.get(`/api/announcements/${id}`);
            setAnnouncement(response);
        } catch (error) {
            console.error('获取公告失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        // 这里可以添加编辑公告的逻辑
        console.log('编辑公告:', id);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>加载中...</div>;
    }

    if (!announcement) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>公告不存在</div>;
    }

    return (
        <div className="article-detail-container" style={{ padding: '20px 0' }}>
            <Card className="article-card">
                {/* 公告标题 */}
                <Title level={1} style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {announcement.title}
                </Title>

                {/* 公告元数据 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <Space size={16}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size={32} src={announcement.author?.avatar_url} icon={<UserOutlined />} />
                            <Text style={{ marginLeft: '8px' }}>{announcement.author?.username}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            <Text>{new Date(announcement.published_at).toLocaleString()}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                            <EyeOutlined style={{ marginRight: '4px' }} />
                            <Text>{announcement.view_count || 0} 浏览</Text>
                        </div>
                    </Space>
                </div>

                <Divider />

                {/* 公告内容 */}
                <div className="article-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex, rehypePrism]}
                        children={announcement.content}
                    />
                </div>

                {/* 管理员操作按钮 */}
                {useAppStore.getState()?.userInfo && useAppStore.getState()?.userInfo?.role === 'admin' && (
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Button
                            onClick={handleEdit}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            编辑公告
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AnnouncementDetail;