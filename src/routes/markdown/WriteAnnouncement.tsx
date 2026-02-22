import { useState, FC } from 'react';
import { Button, Input, Form, Card, Space, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './WriteArticle.css';
import request from '../../utils/https/request';
import 'prismjs/themes/prism-tomorrow.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;

const WriteAnnouncement: FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    // 处理内容变化，保持content与表单同步
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        form.setFieldValue('content', newContent);
    };

    // 发布公告
    const handlePublish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const announcementData = {
                ...values,
                is_published: true,
            };

            // 创建公告
            const response = await request.post('/api/announcements', announcementData);

            message.success('公告发布成功');

            // 跳转到公告详情页
            if (response.id) {
                navigate(`/announcements/${response.id}`);
            }
        } catch (error) {
            message.error('公告发布失败');
            console.error('Publish error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="write-article-container">
            <Card title="发布公告">
                <Form
                    form={form}
                    layout="vertical"
                    style={{ height: '100%' }}
                >
                    <div className="two-column-layout">
                        {/* 第一栏：Markdown编辑界面 */}
                        <div className="column editor-column" style={{ flex: 1, marginRight: '20px' }}>
                            <h3 className="column-title">公告内容编辑</h3>
                            <Form.Item
                                name="title"
                                label="公告标题"
                                rules={[{ required: true, message: '请输入公告标题' }]}
                            >
                                <Input placeholder="请输入公告标题" />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="公告内容"
                                rules={[{ required: true, message: '请输入公告内容' }]}
                            >
                                <TextArea
                                    autoSize={{ minRows: 20, maxRows: 9999 }}
                                    placeholder="请输入公告内容..."
                                    className="markdown-editor"
                                    style={{ fontFamily: 'monospace', width: '100%', resize: 'vertical', minHeight: '60vh' }}
                                    value={content}
                                    onChange={handleContentChange}
                                />
                            </Form.Item>
                        </div>

                        {/* 第二栏：实时预览界面 */}
                        {/* <div className="column preview-column" style={{ flex: 1 }}>
                            <h3 className="column-title">实时预览</h3>
                            <Card className="preview-card">
                                <div className="preview-content">
                                    <h1 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>
                                        {form.getFieldValue('title') || '公告标题'}
                                    </h1>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
                                        rehypePlugins={[rehypeRaw, rehypeKatex, rehypePrism]}
                                        children={content}
                                    />
                                </div>
                            </Card>
                        </div> */}
                    </div>

                    <Form.Item style={{ marginTop: '24px' }}>
                        <Space direction="horizontal">
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handlePublish}
                                loading={loading}
                                size="large"
                            >
                                发布公告
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default WriteAnnouncement;