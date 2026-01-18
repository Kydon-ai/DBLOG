// TopMenu.tsx
import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Row, Avatar, Space, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
const TopMenu: React.FC = () => {
    const [current, setCurrent] = useState('home');
    const { size, isHorizontal } = useWindowSize();
    const { isLogin, avatar, routes, permissions } = useAppStore();

    console.log("查看全屏宽高：", size.width, size.height, isHorizontal)
    console.log("路由模板：", routes)
    console.log("权限信息：", permissions)

    // 基于路由模板生成菜单项
    const generateMenuItems = () => {
        // 如果没有路由模板，使用默认菜单项
        if (!routes || routes.length === 0) {
            return [
                {
                    key: 'home',
                    label: '主页',
                },
                {
                    key: 'write-article',
                    label: '写文章',
                    disabled: !permissions.can_write,
                },
                {
                    key: 'about-project',
                    label: '关于项目',
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
        }

        // 根据路由模板生成菜单项
        return routes
            .filter(route => route.visible)  // 只显示可见的路由
            .map(route => {
                // 转换路由路径为菜单项key
                let key = route.path === '/' ? 'home' : route.path.slice(1);

                // 根据权限控制某些菜单项的可用性
                let disabled = false;
                if (key === 'write' && !permissions.can_write) {
                    disabled = true;
                }

                return {
                    key,
                    label: route.name,
                    disabled,
                };
            });
    };

    const items = generateMenuItems();
    const route = useNavigate()
    const onClick = (e: { key: string }) => {
        if (e.key === 'logout') {
            // 使用logout方法重置所有用户相关状态
            useAppStore.getState().logout();
            route('/login');
            return;
        }
        setCurrent(e.key);
        console.log('打印key', e.key)

        // 处理特殊路由映射
        if (e.key === 'home') {
            route('/');
        } else if (e.key === 'write') {
            route('/write-article');
        } else if (e.key === 'about') {
            route('/about-project');
        } else if (e.key === 'profile') {
            route('/profile-center');
        } else {
            // 默认情况下，将key作为路径的一部分
            route("/" + e.key)
        }
    };
    const menus = (
        <Menu
            selectedKeys={[current]}
            mode="vertical"
            onClick={onClick}
            items={items}
        />
    );
    const userItems: MenuProps['items'] = [
        {
            key: 'profile-center',
            label: '个人中心'
        },
        {
            key: 'logout',
            label: '退出登录'
        },
    ];
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
                                    <span>{useAppStore.getState().userInfo?.username || '用户未设置昵称'}</span>
                                    <Dropdown menu={{ items: userItems, onClick: onClick }} placement="bottomRight" >
                                        <Avatar src={avatar} size='large'></Avatar>
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