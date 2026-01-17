// TopMenu.tsx
import React, { useState } from 'react';
import { Button, Dropdown, Menu, Row, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
const TopMenu: React.FC = () => {
    const [current, setCurrent] = useState('home');
    const { size, isHorizontal } = useWindowSize();
    const { isLogin } = useAppStore();

    console.log("查看全屏宽高：", size.width, size.height, isHorizontal)
    const items = [
        {
            key: 'home',
            label: '主页',
        },
        {
            key: 'write-article',
            label: '写文章',
        },
        {
            key: 'about-project',
            label: '关于项目',
        },
        {
            key: 'document-center',
            label: '文档中心',
        },
        {
            key: 'concat-me',
            label: '作者详情',
        },
        {
            key: 'friend-chain',
            label: '网站友链',
        },
    ];
    const route = useNavigate()
    const onClick = (e: { key: string }) => {
        setCurrent(e.key);
        console.log('打印key', e.key)
        route("/" + e.key)
    };
    const menus = (
        <Menu
            selectedKeys={[current]}
            mode="vertical"
            onClick={onClick}
            items={items}
        />
    );
    const handleClickLogo = () => {
        // console.log(window.location.href ,window.location.href)
        if (window.location.href != window.location.origin + '/') window.location.href = window.location.origin
    }
    return (
        <Row>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={handleClickLogo}>
                    <img style={{ height: '2rem', width: '2rem', marginRight: '5px' }} src="/img/yctf.jpg" alt="LOGO加载失败了" />

                    <div style={{ zoom: "60%" }}>
                        <p style={{ fontSize: '2rem', textAlign: 'justify', margin: 0, fontWeight: 'lighter' }}>DBLOG<span style={{ display: 'inline-block', width: '0%' }}></span></p>
                        <p style={{ fontSize: '1rem', textAlign: 'justify', margin: 0, fontWeight: 'bolder' }}>雏草姬的温暖港湾<span style={{ display: 'inline-block', width: '0%' }}></span></p>
                    </div>
                </div>
                {isHorizontal ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Menu
                            onClick={onClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={items}
                        />
                        {isLogin ? (
                            <>
                                <Space>
                                    <span>{useAppStore.getState().userInfo?.username || '用户'}</span>
                                    <Dropdown overlay={menus} trigger={['click']} >
                                        <Avatar src={"/img/ht.gif"} size='large'></Avatar>
                                    </Dropdown>
                                </Space>
                            </>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => route('/login')}
                                style={{ marginLeft: '16px' }}
                            >
                                登录
                            </Button>
                        )}
                    </div>
                ) : (
                    <Dropdown overlay={menus} trigger={['click']}>
                        <Button>
                            <MenuUnfoldOutlined />
                        </Button>
                    </Dropdown>
                )}
            </div>
        </Row>
    );
};

export default TopMenu;