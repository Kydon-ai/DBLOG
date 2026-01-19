import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../utils/https/request';

// 文章数据类型定义
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
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
}

// 文章卡片组件
const ArticleCard = ({ article }: { article: Article }) => {
  const navigate = useNavigate();
  const { id, title } = article;
  const [isHovered, setIsHovered] = useState(false);

  // 处理卡片点击事件
  const handleCardClick = () => {
    navigate(`/articles/${id}`);
  };

  // 使用默认图片URL
  const imageUrl = '/img/default_blog.svg';

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
      <div style={{
        padding: '16px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        lineHeight: '1.4'
      }}>
        {title}
      </div>
    </div>
  );
};

// 主页组件
const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 组件挂载时获取文章列表
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

    fetchArticles();
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
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* 页面标题 */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#262626'
      }}>
        文章列表
      </h1>

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
  );
};

export default Home;