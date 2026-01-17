import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import { LikeOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import request from '../../utils/https/request';

// 文章数据类型定义
interface Article {
  id: number;
  title: string;
  content: string;
  content_html: string;
  summary: string | null;
  tags: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  collect_count: number;
  created_at: string;
  published_at: string | null;
  comments?: HierarchicalComment[];
}

// 层级评论数据类型定义
interface HierarchicalComment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  content: string;
  is_approved: boolean;
  like_count: number;
  created_at: string;
  replies: HierarchicalComment[];
}

// 评论数据类型定义 (兼容旧的评论结构)
interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
  like_count: number;
}

export default function ReadArticle() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<HierarchicalComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const articleRef = useRef<HTMLDivElement>(null);

  // 获取文章详情
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await request.get(`/api/articles/${id}`);
        setArticle(response);

        // 直接从文章响应中获取评论
        if (response.comments) {
          setComments(response.comments);
        }

        setError(null);
      } catch (err) {
        console.error('获取文章详情失败:', err);
        setError('获取文章详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      try {
        // 如果文章详情中没有包含评论，单独获取评论
        if (!article?.comments || article.comments.length === 0) {
          const response = await request.get(`/api/articles/${id}/comments`);
          if (response.comments) {
            setComments(response.comments);
          }
        }
      } catch (err) {
        console.error('获取评论列表失败:', err);
      }
    };

    fetchComments();
  }, [id, article?.comments]);

  // 点赞文章
  const handleLikeArticle = async () => {
    if (!id) return;

    try {
      const response = await request.post(`/api/articles/${id}/like`);
      if (response.status === 'liked' || response.status === 'already_liked') {
        setIsLiked(true);
        if (article) {
          setArticle({ ...article, like_count: response.like_count });
        }
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 收藏文章
  const handleCollectArticle = async () => {
    if (!id) return;

    try {
      const endpoint = isCollected ? `/api/articles/${id}/uncollect` : `/api/articles/${id}/collect`;
      const response = await request.post(endpoint);

      if (response.status === 'collected' || response.status === 'already_collected') {
        setIsCollected(true);
      } else if (response.status === 'uncollected' || response.status === 'not_collected') {
        setIsCollected(false);
      }

      if (article) {
        setArticle({ ...article, collect_count: response.collect_count });
      }
    } catch (err) {
      console.error('收藏/取消收藏失败:', err);
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await request.post(`/api/comments/${commentId}/like`);

      // 更新评论的点赞数
      const updateComments = (comments: HierarchicalComment[]): HierarchicalComment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, like_count: response.like_count };
          } else if (comment.replies.length > 0) {
            return { ...comment, replies: updateComments(comment.replies) };
          }
          return comment;
        });
      };

      setComments(updateComments(comments));
    } catch (err) {
      console.error('评论点赞失败:', err);
    }
  };

  // 渲染评论（递归渲染层级评论）
  const renderComments = (comments: HierarchicalComment[], level: number = 0) => {
    const maxLevel = 3;
    const isExceedMaxLevel = level >= maxLevel;

    return comments.map(comment => (
      <div key={comment.id} style={{
        marginBottom: '20px',
        marginLeft: isExceedMaxLevel ? 0 : `${level * 20}px`,
        paddingLeft: isExceedMaxLevel ? 0 : '15px',
        borderLeft: isExceedMaxLevel ? 'none' : '1px solid #e8e8e8'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#fafafa',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontWeight: '500', color: '#262626' }}>
              {comment.author_name}
            </span>
            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <div style={{ color: '#262626', marginBottom: '10px', lineHeight: '1.6' }}>
            {comment.content}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            <span style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => handleLikeComment(comment.id)}>
              <LikeOutlined style={{ marginRight: '4px' }} /> {comment.like_count}
            </span>
            <span style={{ cursor: 'pointer', color: '#1890ff' }}>
              回复
            </span>
          </div>
        </div>

        {/* 递归渲染子评论 */}
        {comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </div>
    ));
  };

  // 监听滚动事件，检测是否到达底部
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const offset = 100; // 距离底部100px时视为到达底部

      setIsAtBottom(scrollHeight - scrollTop - clientHeight <= offset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        加载文章详情中...
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

  if (!article) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '18px',
        color: '#999'
      }}>
        文章不存在
      </div>
    );
  }

  return (
    <div ref={articleRef} style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingBottom: '60px' // 为底部栏留出空间
    }}>
      {/* 文章内容容器 */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        {/* 文章标题 */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#262626'
        }}>
          {article.title}
        </h1>

        {/* 文章元信息 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          fontSize: '14px',
          color: '#8c8c8c',
          paddingBottom: '15px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div>
            <span>发布时间: {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span>浏览量: {article.view_count}</span>
          </div>
          {article.tags && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {article.tags.split(',').map((tag, index) => (
                <span key={index} style={{
                  backgroundColor: '#f5f5f5',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px'
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 文章内容 */}
        <div style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#262626',
          marginBottom: '40px'
        }}>
          <ReactMarkdown rehypePlugins={[rehypePrism]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* 评论区 */}
        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '2px solid #f0f0f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '30px',
            color: '#262626'
          }}>
            评论 ({article.comment_count})
          </h2>

          {/* 评论列表 */}
          <div style={{ marginBottom: '40px' }}>
            {comments.length > 0 ? (
              renderComments(comments)
            ) : (
              <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '40px 0' }}>
                暂无评论，快来抢沙发吧！
              </div>
            )}
          </div>

          {/* 评论输入框 */}
          <div style={{
            backgroundColor: '#fafafa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
              发表评论
            </h3>
            <textarea
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontSize: '14px',
                resize: 'vertical',
                marginBottom: '15px'
              }}
              placeholder="请输入您的评论..."
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                提交评论
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部粘性操作栏 */}
      {!isAtBottom && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
          padding: '12px 0',
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px'
          }}>
            {/* 点赞按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'background-color 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }} onClick={handleLikeArticle}>
              <LikeOutlined style={{ fontSize: '20px', color: isLiked ? '#ff4d4f' : '#1890ff' }} />
              <span style={{ fontSize: '14px', color: '#262626' }}>
                {article.like_count}
              </span>
            </div>

            {/* 收藏按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'background-color 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }} onClick={handleCollectArticle}>
              <StarOutlined style={{ fontSize: '20px', color: isCollected ? '#ffc53d' : '#d9d9d9' }} />
              <span style={{ fontSize: '14px', color: '#262626' }}>
                {article.collect_count}
              </span>
            </div>

            {/* 评论按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'background-color 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
              <CommentOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
              <span style={{ fontSize: '14px', color: '#262626' }}>
                {article.comment_count}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}