import { useState, FC } from 'react';
import { Button, Input, Form, Switch, Card, Space, message } from 'antd';
import { SaveOutlined, EyeOutlined, EyeInvisibleOutlined, SendOutlined } from '@ant-design/icons';
import './WriteArticle.css';
import request from '../../utils/https/request';

const { TextArea } = Input;

interface WriteArticleProps {
    articleId?: string;
}

const WriteArticle: FC<WriteArticleProps> = ({ articleId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [previewContent, setPreviewContent] = useState('');

    // 预览Markdown内容
    const handlePreview = async () => {
        if (previewMode) {
            setPreviewMode(false);
            return;
        }

        try {
            const content = form.getFieldValue('content');
            if (!content) {
                message.warning('请输入内容后再预览');
                return;
            }

            // 实际项目中可以使用Markdown库在前端预览
            // 这里为了演示，直接将内容作为预览
            setPreviewContent(content);
            setPreviewMode(true);
        } catch (error) {
            message.error('预览失败');
            console.error('Preview error:', error);
        }
    };

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
                    }}
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="slug"
                        rules={[{ required: true, message: '请输入文章slug' }]}
                        extra="用于URL的友好标识，建议使用英文小写和连字符"
                    >
                        <Input placeholder="请输入文章slug，例如：my-first-article" />
                    </Form.Item>

                    <Form.Item
                        name="tags"
                        label="标签"
                        extra="请用逗号分隔多个标签"
                    >
                        <Input placeholder="请输入文章标签，例如：技术,前端,React" />
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="摘要"
                        extra="文章的简短描述，会显示在文章列表中"
                    >
                        <TextArea rows={3} placeholder="请输入文章摘要" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="default"
                                icon={previewMode ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                onClick={handlePreview}
                            >
                                {previewMode ? '编辑模式' : '预览模式'}
                            </Button>

                            {previewMode ? (
                                <Card title="预览">
                                    <pre>{previewContent}</pre>
                                </Card>
                            ) : (
                                <TextArea
                                    rows={20}
                                    placeholder="请输入Markdown格式的文章内容"
                                    className="markdown-editor"
                                    style={{ fontFamily: 'monospace' }}
                                />
                            )}
                        </Space>
                    </Form.Item>

                    <Form.Item
                        name="is_published"
                        label="发布状态"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
                    </Form.Item>

                    <Form.Item name="featured_image" label="特色图片URL">
                        <Input placeholder="请输入特色图片的URL" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="default"
                                icon={<SaveOutlined />}
                                onClick={() => handleSave(false)}
                                loading={loading}
                            >
                                保存草稿
                            </Button>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={() => handleSave(true)}
                                loading={loading}
                            >
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default WriteArticle;