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
import WriteAnnouncement from './routes/markdown/WriteAnnouncement.tsx';
import AnnouncementDetail from './routes/markdown/AnnouncementDetail.tsx';
import Login from './routes/login.tsx';
import PersonalCenter from './routes/businessComponents/PersonalCenter.tsx';
import { WindowSizeProvider } from './utils/windowContext/win.tsx';
import ExternalRedirect from './routes/businessComponents/UrlRedeirect.tsx';
import StringTool from './routes/tool/StringTool.tsx';


// 创建布局组件以使用useLocation钩子
const AppLayout = () => {
	const location = useLocation();
	// 只修改内容宽度
	const specialWidthRouter: string[] = ["/", "/home", "/write-article"];
	// 需要隐藏header 和footer
	const specialLayoutRouter: string[] = ["/url-redirect"];
	return (
		<WindowSizeProvider>
			<div className="layout">
				{!specialLayoutRouter.includes(location.pathname) && (
					<header className="header" style={{}}>
						<TopMenu></TopMenu>
					</header>
				)}
				<main className="content">
					<div style={{ minHeight: '100vh', backgroundColor: 'darkgray' }}>
						{/* 对chat路由应用100%宽度，其他路由保持80vw最大宽度 */}
						<div
							style={{
								maxWidth: specialWidthRouter.includes(location.pathname)
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
										<AboutProject />
									}
								/>
								{/* <Route path="/about-author" element={<AboutAuthor />} /> */}
								<Route
									path="/concat-me"
									element={
										<ConcatMe />
									}
								/>
								<Route
									path="/friend-chain"
									element={
										<FriendChain />
									}
								/>

								{/* 文章相关路由 */}
								<Route path="/articles/:id" element={<ReadArticle />} />
								<Route
									path="/write-article"
									element={
										<AuthGuard requiredRole="premium">
											<WriteArticle />
										</AuthGuard>
									}
								/>
								<Route
									path="/edit-article/:id"
									element={
										<AuthGuard requiredRole="premium">
											<WriteArticle />
										</AuthGuard>
									}
								/>
								<Route path="/login" element={<Login />} />
								<Route
									path="/profile-center"
									element={
										<AuthGuard requiredRole="user">
											<PersonalCenter />
										</AuthGuard>
									}
								/>
								{/* 跳转站外 */}
								<Route path="/url-redirect" element={<ExternalRedirect />} />
								{/* 工具路由 */}
								<Route path="/tool/url-split" element={<StringTool />} />
								{/* 公告相关路由 */}
								<Route
									path="/write-announcement"
									element={
										<AuthGuard requiredRole="admin">
											<WriteAnnouncement />
										</AuthGuard>
									}
								/>
								<Route path="/announcements/:id" element={<AnnouncementDetail />} />

								{/* 管理路由 */}
								<Route
									path="/admin"
									element={
										<AuthGuard requiredRole="admin">
											<div className="p-4">
												<h1>管理面板</h1>
												<p>欢迎访问管理面板</p>
											</div>
										</AuthGuard>
									}
								/>
								<Route
									path="/admin/users"
									element={
										<AuthGuard requiredRole="admin">
											<div className="p-4">
												<h1>用户管理</h1>
												<p>用户管理功能</p>
											</div>
										</AuthGuard>
									}
								/>
								<Route
									path="/admin/articles"
									element={
										<AuthGuard requiredRole="admin">
											<div className="p-4">
												<h1>文章管理</h1>
												<p>文章管理功能</p>
											</div>
										</AuthGuard>
									}
								/>
								<Route
									path="/admin/announcements"
									element={
										<AuthGuard requiredRole="admin">
											<div className="p-4">
												<h1>公告管理</h1>
												<p>公告管理功能</p>
											</div>
										</AuthGuard>
									}
								/>

								{/* 用户路由 */}
								<Route
									path="/profile"
									element={
										<AuthGuard requiredRole="user">
											<PersonalCenter />
										</AuthGuard>
									}
								/>
								<Route
									path="/liked"
									element={
										<AuthGuard requiredRole="user">
											<div className="p-4">
												<h1>我的点赞</h1>
												<p>我的点赞功能</p>
											</div>
										</AuthGuard>
									}
								/>
								<Route
									path="/collected"
									element={
										<AuthGuard requiredRole="user">
											<div className="p-4">
												<h1>我的收藏</h1>
												<p>我的收藏功能</p>
											</div>
										</AuthGuard>
									}
								/>

								{/* 高级用户路由 */}
								<Route
									path="/write"
									element={
										<AuthGuard requiredRole="premium">
											<WriteArticle />
										</AuthGuard>
									}
								/>
								<Route
									path="/dashboard"
									element={
										<AuthGuard requiredRole="premium">
											<div className="p-4">
												<h1>仪表盘</h1>
												<p>仪表盘功能</p>
											</div>
										</AuthGuard>
									}
								/>
							</Routes>
						</div>
						<FloatButton.BackTop />
					</div>
				</main>
				{!specialLayoutRouter.includes(location.pathname) && (
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
