// 添加路由
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AuthGuard from './routes/AuthGuard.tsx';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// UI及对应ICON
import { FloatButton } from 'antd';

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
import ReadArticle from './routes/markdown/article.tsx';
import WriteArticle from './routes/markdown/WriteArticle.tsx';
import Login from './routes/login.tsx';
import { WindowSizeProvider } from './utils/windowContext/win.tsx';


// 创建布局组件以使用useLocation钩子
const AppLayout = () => {
	const location = useLocation();
	const specialRouter: string[] = [];
	return (
		<WindowSizeProvider>
			<div className="layout">
				{!specialRouter.includes(location.pathname) && (
					<header className="header" style={{}}>
						<TopMenu></TopMenu>
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

								{/* 文章相关路由 */}
								<Route path="/articles/:id" element={<ReadArticle />} />
								<Route
									path="/write-article"
									element={
										<WriteArticle />
										// <AuthGuard>
										// 	<WriteArticle />
										// </AuthGuard>
									}
								/>
								<Route
									path="/edit-article/:id"
									element={
										<AuthGuard>
											<WriteArticle />
										</AuthGuard>
									}
								/>
								<Route path="/login" element={<Login />} />
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
