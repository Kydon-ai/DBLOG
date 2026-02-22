import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ExternalRedirect() {
    const location = useLocation();
    const [url, setUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 从URL查询参数中获取目标链接
        const searchParams = new URLSearchParams(location.search);
        const targetUrl = searchParams.get('url');
        if (targetUrl) {
            setUrl(decodeURIComponent(targetUrl));
        }
        setLoading(false);
    }, [location.search]);

    const handleConfirm = () => {
        // 确认跳转
        window.open(url, '_blank');
    };

    const handleCancel = () => {
        // 取消跳转，关闭当前窗口
        window.close();
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                加载中...
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '600px',
            margin: 'auto',
            padding: '30px',
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            position: 'relative',
            transform: 'translateY(50%)'
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#262626',
                textAlign: 'center'
            }}>
                跳转确认
            </h1>

            <div style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                lineHeight: '1.6'
            }}>
                <p style={{ marginBottom: '15px' }}>
                    您即将跳转到以下外部网站：
                </p>
                <p style={{
                    wordBreak: 'break-all',
                    color: '#1890ff',
                    fontSize: '14px'
                }}>
                    {url}
                </p>
                <p style={{ marginTop: '15px', fontSize: '14px', color: '#ff4d4f' }}>
                    ⚠️ 请注意：外部网站可能存在安全风险，请谨慎操作。
                </p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
            }}>
                <button
                    onClick={handleConfirm}
                    style={{
                        padding: '10px 30px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#40a9ff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1890ff';
                    }}
                >
                    确认跳转
                </button>

                <button
                    onClick={handleCancel}
                    style={{
                        padding: '10px 30px',
                        backgroundColor: '#f5f5f5',
                        color: '#262626',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e8e8e8';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                >
                    取消
                </button>
            </div>
        </div>
    );
}