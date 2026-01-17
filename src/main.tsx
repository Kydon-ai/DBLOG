// 添加路由
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AuthGuard from './routes/AuthGuard.tsx';

import { FC, StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';
// UI及对应ICON
import { FloatButton, Button } from 'antd';

// 引入自定义样式库
import './Layout.css';

// 自定义组件
import FooterCopyright from './routes/FooterCopyRight.tsx';
import TopMenu from './routes/topMenu.tsx';
import ShowDemo from './routes/demo.tsx';
import Home from './routes/Home.tsx';
// import AboutAuthor from './routes/normal/AboutAuthor.tsx';
import AboutProject from './routes/normal/AboutProject.tsx';
import ConcatMe from './routes/normal/ConcatMe.tsx';
import FriendChain from './routes/normal/FriendChain.tsx';
import { WindowSizeProvider } from './utils/windowContext/win.tsx';

// 主页导航栏数据
const items = [
	{
		key: 'home',
		label: '主页',
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
	// {
	// 	key: 'tailwind-demo',
	// 	label: 'Tailwind示例',
	// },
];

// 创建布局组件以使用useLocation钩子
const AppLayout = () => {
	const location = useLocation();
	const specialRouter: string[] = [];
	return (
		<WindowSizeProvider>
			<div className="layout">
				{!specialRouter.includes(location.pathname) && (
					<header className="header" style={{}}>
						<TopMenu items={items}></TopMenu>
					</header>
				)}
				<main className="content">
					<div style={{ minHeight: '100vh', backgroundColor: 'darkgray' }}>
						{/* 对chat路由应用100%宽度，其他路由保持80vw最大宽度 */}
						<div
							style={{
								maxWidth: specialRouter.includes(location.pathname)
									? '100vw'
									: '80vw',
								margin: 'auto',
							}}
						>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/home" element={<Home />} />
								<Route path="/demo" element={<ShowDemo />} />

								<Route
									path="/about-project"
									element={
										<AuthGuard>
											<AboutProject />
										</AuthGuard>
									}
								/>
								{/* <Route path="/about-author" element={<AboutAuthor />} /> */}
								<Route
									path="/concat-me"
									element={
										<AuthGuard>
											<ConcatMe />
										</AuthGuard>
									}
								/>
								<Route
									path="/friend-chain"
									element={
										<AuthGuard>
											<FriendChain />
										</AuthGuard>
									}
								/>
							</Routes>
						</div>
						<FloatButton.BackTop />
					</div>
				</main>
				{/* 当路由不是/chat时渲染页脚 */}
				{!specialRouter.includes(location.pathname) && (
					<footer className="footer" style={{ minHeight: '10vh' }}>
						<FooterCopyright></FooterCopyright>
					</footer>
				)}
			</div>
		</WindowSizeProvider>
	);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AppLayout />
		</BrowserRouter>
	</StrictMode>
);
