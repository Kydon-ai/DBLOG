import { useState, FC, useEffect, Children } from 'react';
import { Button, Input, Form, Switch, Card, Space, message, Select } from 'antd';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import './WriteArticle.css';
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
// import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';
import React from 'react';

const { TextArea } = Input;
// const { Option } = Select;

// CodeBlock component for handling code blocks with copy functionality
export const CodeBlock: React.FC<{
    className?: string;
    children: React.ReactNode;
    [key: string]: any;
}> = ({ className, children, ...props }) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopy = async () => {

        // const childrenArray = React.Children.toArray(children);
        // 递归提取文本内容的函数
        const extractTextFromChildren: any = (children: any) => {
            // 使用 React.Children.toArray 保证 children 总是一个数组，便于安全遍历 [3,8](@ref)
            return Children.toArray(children).map(child => {
                // 情况1: child 是字符串或数字，直接返回
                if (typeof child === 'string' || typeof child === 'number') {
                    return child;
                }
                // 情况2: child 是合法的 React 元素（即你提供的对象结构）
                // 根据你的数据结构，它具有 $$typeof: Symbol(react.element) [3,7](@ref)
                if (React.isValidElement(child)) {
                    // 核心：递归提取这个元素的子内容（即其 props.children）
                    // 在你的例子中，每个 span 元素的 props.children 包含了文本和更深层的节点
                    return extractTextFromChildren(child.props.children);
                }
                // 情况3: 对于其他类型（如 null, undefined, boolean），返回空字符串避免干扰
                return '';
            }).join(''); // 将数组中的所有片段拼接成一个完整的字符串
        };
        console.log(extractTextFromChildren(children));
        try {
            // let codeText = String(children).replace(/\n$/, '');
            let codeText = extractTextFromChildren(children);
            // Try clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(codeText);
                console.log('复制成功', codeText);
            } else {
                // Fallback for insecure contexts

                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                console.log('复制成功', codeText);
            }

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('复制失败: ', err);
            message.error('复制失败，请手动复制');
        }
    };

    return (
        <div style={{ position: 'relative', margin: '16px 0' }}>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: isCopied ? '#52c41a' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 1,
                    transition: 'background 0.3s'
                }}
            >
                {isCopied ? '已复制!' : '复制代码'}
            </button>

            <pre style={{
                borderRadius: '4px',
                overflowX: 'auto',
                color: '#e6e6e6',
                padding: '16px',
                margin: 0,
                background: '#2d2d2d'
            }}>
                <code className={className} {...props}>{children}</code>
            </pre>
        </div>
    );
};

interface WriteArticleProps {
    articleId?: string;
}

const WriteArticle: FC<WriteArticleProps> = ({ articleId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    // 处理内容变化，保持content与表单同步
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        form.setFieldValue('content', newContent);
    };

    // 初始化内容
    useEffect(() => {
        const initialContent = form.getFieldValue('content') || '';
        setContent(initialContent);
    }, []);

    // 权限选项
    const permissionOptions = [
        { value: 'public', label: '公开' },
        { value: 'user', label: '仅登录用户' },
        { value: 'premium', label: '高级用户' },
        { value: 'private', label: '仅自己可见' },
        { value: 'admin', label: '仅管理员' }
    ];

    // 标签预设选项
    const tagOptions = [
        '技术', '前端', '后端', 'React', 'Vue', 'JavaScript', 'Python', '数据库', '算法', '设计'
    ];

    // 保存文章（草稿或发布）
    const handleSave = async (publish: boolean) => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const articleData = {
                ...values,
                is_published: publish,
                ...(articleId && { id: articleId }),
            };

            // 调用API保存文章
            const response = await request.post('/api/articles', articleData);

            message.success(publish ? '文章发布成功' : '文章保存成功');

            // 如果是发布，可以跳转到文章详情页
            if (publish && response.id) {
                // 实际项目中可以使用useNavigate跳转
                console.log('Article published successfully:', response);
            }
        } catch (error) {
            message.error(publish ? '文章发布失败' : '文章保存失败');
            console.error('Save error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="write-article-container">
            <Card title={articleId ? '编辑文章' : '写文章'}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        is_published: false,
                        visibility: 'public',
                    }}
                    style={{ height: '100%' }}
                >
                    <div className="three-column-layout">
                        {/* 第一栏：Markdown编辑界面 */}
                        <div className="column editor-column">
                            <h3 className="column-title">Markdown编辑器</h3>
                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: '请输入文章内容' }]}
                            >
                                <TextArea
                                    rows={45}
                                    placeholder="请输入Markdown格式的文章内容..."
                                    className="markdown-editor"
                                    style={{ fontFamily: 'monospace', width: '100%', resize: 'vertical' }}
                                    value={content}
                                    onChange={handleContentChange}
                                />
                            </Form.Item>
                        </div>

                        {/* 第二栏：实时预览界面 */}
                        <div className="column preview-column">
                            <h3 className="column-title">实时预览</h3>
                            <Card className="preview-card">
                                <div className="preview-content">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
                                        rehypePlugins={[rehypeRaw, rehypeKatex, rehypePrism]}
                                        children={content}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 {...props} style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }} />,
                                            h2: ({ node, ...props }) => <h2 {...props} style={{ fontSize: '20px', marginTop: '30px', marginBottom: '16px' }} />,
                                            h3: ({ node, ...props }) => <h3 {...props} style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }} />,
                                            p: ({ node, ...props }) => <p {...props} style={{ marginBottom: '16px' }} />,
                                            // @ts-ignore
                                            code: ({ node, inline, className, children, ...props }) => {
                                                if (inline) {
                                                    return (
                                                        <code
                                                            {...props}
                                                            style={{
                                                                backgroundColor: '#fafafa',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontFamily: 'monospace'
                                                            }}
                                                        >{children}</code>
                                                    );
                                                }

                                                return <CodeBlock className={className} children={children} {...props} />;
                                            },
                                            ul: ({ node, ...props }) => <ul {...props} style={{ marginBottom: '16px', paddingLeft: '24px' }} />,
                                            ol: ({ node, ...props }) => <ol {...props} style={{ marginBottom: '16px', paddingLeft: '24px' }} />,
                                            li: ({ node, ...props }) => <li {...props} style={{ marginBottom: '8px' }} />,
                                            blockquote: ({ node, ...props }) => <blockquote {...props} style={{ borderLeft: '4px solid #1890ff', paddingLeft: '16px', color: '#666', marginBottom: '16px' }} />,
                                            img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto', marginBottom: '16px' }} />,
                                            a: ({ node, ...props }) => <a {...props} style={{ color: '#1890ff', textDecoration: 'underline' }} />,
                                            table: ({ node, ...props }) => <table {...props} style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '16px' }} />,
                                            th: ({ node, ...props }) => <th {...props} style={{ border: '1px solid #e8e8e8', padding: '8px', backgroundColor: '#fafafa' }} />,
                                            td: ({ node, ...props }) => <td {...props} style={{ border: '1px solid #e8e8e8', padding: '8px' }} />,
                                            mark: ({ node, ...props }) => <mark {...props} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }} />
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* 第三栏：文章设置参数 */}
                        <div className="column settings-column">
                            <h3 className="column-title">文章设置</h3>
                            <div style={{ height: '100%', overflowY: 'auto' }}>
                                <Form.Item
                                    name="title"
                                    label="标题"
                                    rules={[{ required: true, message: '请输入文章标题' }]}
                                >
                                    <Input placeholder="请输入文章标题" />
                                </Form.Item>

                                <Form.Item
                                    name="slug"
                                    label="Slug"
                                    rules={[{ required: false, message: '请输入文章slug' }]}
                                    extra="用于URL的友好标识，建议使用英文小写和连字符"
                                >
                                    <Input placeholder="my-first-article" />
                                </Form.Item>

                                <Form.Item
                                    name="tags"
                                    label="标签"
                                    extra="可选择预设标签或手动输入"
                                >
                                    <Select
                                        mode="tags"
                                        placeholder="选择或输入标签"
                                        style={{ width: '100%' }}
                                        options={tagOptions.map(tag => ({ label: tag, value: tag }))}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="summary"
                                    label="摘要"
                                    extra="文章的简短描述，会显示在文章列表中"
                                >
                                    <TextArea rows={4} placeholder="请输入文章摘要" />
                                </Form.Item>

                                <Form.Item
                                    name="featured_image"
                                    label="特色图片URL"
                                >
                                    <Input placeholder="请输入特色图片的URL" />
                                </Form.Item>

                                <Form.Item
                                    name="visibility"
                                    label="查看权限"
                                    rules={[{ required: true, message: '请选择查看权限' }]}
                                >
                                    <Select
                                        placeholder="选择查看权限"
                                        options={permissionOptions}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="is_published"
                                    label="发布状态"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
                                </Form.Item>

                                <Form.Item style={{ marginTop: '24px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button
                                            type="default"
                                            icon={<SaveOutlined />}
                                            onClick={() => handleSave(false)}
                                            loading={loading}
                                            block
                                        >
                                            保存草稿
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={() => handleSave(true)}
                                            loading={loading}
                                            block
                                        >
                                            发布文章
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default WriteArticle;