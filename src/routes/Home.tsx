import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../utils/https/request';
import { List, Typography, Tooltip } from 'antd';
import { HeartOutlined, MessageOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
const { Text } = Typography;
// 文章数据类型定义
interface AuthorInfo {
  id: number;
  username: string;
  avatar_url?: string;
}

interface Article {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  tags: string | null;
  is_published: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  collect_count: number;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  author?: AuthorInfo;
}

// 公告数据类型定义
interface Announcement {
  id: number;
  title: string;
  view_count: number;
  created_at: string;
  published_at: string;
  author?: AuthorInfo;
}

// 文章卡片组件
const ArticleCard = ({ article }: { article: Article }) => {
  const navigate = useNavigate();
  const { id, title, author, like_count, comment_count, collect_count, view_count } = article;
  const [isHovered, setIsHovered] = useState(false);

  // 处理卡片点击事件
  const handleCardClick = () => {
    navigate(`/articles/${id}`);
  };

  // 使用默认图片URL
  const imageUrl = '/img/default_blog.svg';
  // 使用默认头像
  const defaultAvatar = '/img/user.png';
  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        border: '1px solid #eee',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: isHovered ? '0 4px 16px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* 16:9比例的图片容器 */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9比例
        overflow: 'hidden'
      }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* 文章标题 */}
      <Text
        ellipsis={{
          tooltip: title,
        }}
        style={{
          padding: '4px 8px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          lineHeight: '1.4',
          flex: '1',
          display: 'block',           // ✅ 关键：改为块级元素
          // width: '100%',             // ✅ 明确宽度
          maxWidth: '100%',          // ✅ 最大宽度
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          margin: 0,
        }}
      >
        <Tooltip
          title={title}
          color="#000"
          styles={{ body: { color: "#fff" } }}
        >
          {title}
        </Tooltip>
      </Text>

      {/* 作者信息和统计数据 */}
      <div style={{
        padding: '0px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #f5f5f5'
      }}>
        {/* 作者信息 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img
            src={author?.avatar_url || defaultAvatar}
            alt={author?.username || '未知作者'}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span style={{
            fontSize: '12px',
            color: '#666'
          }}>
            {author?.username || '未知作者'}
          </span>
        </div>

        {/* 统计数据 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '12px',
            color: '#999'
          }}>
            <HeartOutlined /> {like_count || 0}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#999'
          }}>
            <MessageOutlined /> {comment_count || 0}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#999'
          }}>
            <StarOutlined /> {collect_count || 0}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#999'
          }}>
            <EyeOutlined /> {view_count || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

// 主页组件
const Home = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // @ts-ignore
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  // @ts-ignore
  const [announcementError, setAnnouncementError] = useState<string | null>(null);
  // @ts-ignore
  const [sys_knowledge, setSysKnowledge] = useState<string[]>([
    '体系知识1',
    '体系知识2',
    '体系知识3',
    '体系知识4',
    '体系知识5',
  ]);

  // 组件挂载时获取文章列表和公告列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await request.get('/api/articles');
        setArticles(response);
        setError(null);
      } catch (err) {
        console.error('获取文章列表失败:', err);
        setError('获取文章列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        setAnnouncementLoading(true);
        const response = await request.get('/api/announcements');
        setAnnouncements(response);
        setAnnouncementError(null);
      } catch (err) {
        console.error('获取公告列表失败:', err);
        setAnnouncementError('获取公告列表失败，请稍后重试');
      } finally {
        setAnnouncementLoading(false);
      }
    };

    fetchArticles();
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '18px',
        color: '#666'
      }}>
        加载文章列表中...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '18px',
        color: '#ff4d4f'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 auto", padding: '20px 0 20px 20px', minWidth: '10vw' }}>
        <List
          style={{ backgroundColor: '#f5f5f5', height: '100%' }}
          header={<div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>体系知识</div>}
          footer={<div></div>}
          bordered
          dataSource={sys_knowledge}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
      <div style={{
        padding: '20px',
        // maxWidth: '1200px',
        margin: '0 auto',
        flex: "1"
      }}>
        {/* 文章卡片网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* 空状态 */}
        {articles.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
            fontSize: '16px'
          }}>
            暂无文章，敬请期待
          </div>
        )}
      </div>
      <div style={{ flex: "0 0 auto", padding: '20px 20px 0 0', width: '10vw' }}>
        <List
          style={{ backgroundColor: '#f5f5f5' }}
          header={<div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>网页公告</div>}
          footer={<div></div>}
          bordered
          dataSource={announcements}
          renderItem={(announcement) => (
            <List.Item >
              <a
                href={`/announcements/${announcement.id}`}
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/announcements/${announcement.id}`);
                }}
              >
                <Tooltip title={announcement.title}>
                  {announcement.title}
                </Tooltip>
              </a>
            </List.Item>
          )}
        />
      </div>
    </div >

  );
};

export default Home;